import React, { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { getDesktopAPI } from '../../lib/desktop-bridge'
import { isDesktopApp } from '../../lib/desktop-bridge'
import { apiClient } from '../../api-config'

interface TerminalPanelProps {
  cwd?: string
  projectId?: string | null
  sessionId?: string | null
}

export function TerminalPanel({ cwd, projectId, sessionId }: TerminalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const ptyIdRef = useRef<string | null>(null)
  const pendingRef = useRef<string[]>([])
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isDesktopApp() || !containerRef.current) return
    const api = getDesktopAPI()
    if (!api?.ptyCreate) return

    const term = new Terminal({
      fontFamily: 'Consolas, monospace',
      fontSize: 13,
      theme: { background: '#1a1a1a', foreground: '#e8e8e8' },
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(containerRef.current)
    fit.fit()

    let ptyId: string | null = null
    void api.ptyCreate(cwd || '.', term.cols, term.rows).then((id) => {
      ptyId = id
      ptyIdRef.current = id
    })

    const flushLogChunks = () => {
      if (!projectId || pendingRef.current.length === 0) return
      const combined = pendingRef.current.join('\n')
      pendingRef.current = []
      void apiClient.fetch('/api/terminal/log-chunk', {
        method: 'POST',
        body: JSON.stringify({
          chunk: combined,
          ptyId: ptyIdRef.current,
          sessionId: sessionId || 'terminal',
          projectId,
        }),
      }).catch(() => {
        /* ledger writes are best-effort */
      })
    }

    const queueLogChunk = (chunk: string) => {
      if (!chunk.trim()) return
      pendingRef.current.push(chunk)
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
      flushTimerRef.current = setTimeout(flushLogChunks, 750)
    }

    const offData = api.onPtyData?.((id, data) => {
      if (id === ptyId) term.write(data)
    })

    const offLog = api.onPtyLogChunk?.((id, chunk) => {
      if (id === ptyId) queueLogChunk(chunk)
    })

    term.onData((data) => {
      if (ptyId) void api.ptyWrite?.(ptyId, data)
    })

    const onResize = () => {
      fit.fit()
      if (ptyId) void api.ptyResize?.(ptyId, term.cols, term.rows)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
      flushLogChunks()
      offData?.()
      offLog?.()
      if (ptyId) {
        void api.ptyFlushLog?.(ptyId)
        void api.ptyKill?.(ptyId)
      }
      term.dispose()
    }
  }, [cwd, projectId, sessionId])

  if (!isDesktopApp()) {
    return (
      <p className="p-4 text-[13px] text-neutral-500">
        Interactive terminal is available in the desktop app (node-pty).
      </p>
    )
  }

  return <div ref={containerRef} className="h-full min-h-[200px] w-full bg-neutral-900 p-1" />
}
