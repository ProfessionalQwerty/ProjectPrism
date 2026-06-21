import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Terminal } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TerminalLine {
  type: 'prompt' | 'output' | 'success' | 'dim' | 'cmd' | 'flag' | 'path'
  text: string
}

const DEMO_SEQUENCE: TerminalLine[] = [
  { type: 'cmd', text: 'prism up' },
  { type: 'output', text: 'Initializing PRISM daemon...' },
  { type: 'output', text: 'Loading workspace: ' },
  { type: 'path', text: '~/projects/alpha' },
  { type: 'success', text: '✓ PRISM online at localhost:19991' },
  { type: 'dim', text: '' },
  { type: 'cmd', text: 'prism lock ' },
  { type: 'path', text: 'adapters/gemini-cli-adapter.ts' },
  { type: 'success', text: '✓ Locked by Agent [Gemini CLI]' },
  { type: 'dim', text: '' },
  { type: 'cmd', text: 'prism pipeline run ' },
  { type: 'flag', text: '--steps index,compile,route' },
  { type: 'output', text: 'Step 2/3: Context compiled (4,821 tokens)' },
  { type: 'success', text: '✓ Routed to Claude Code adapter' },
]

export function TerminalWidget() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [lineIndex, setLineIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const typeNextLine = useCallback(() => {
    if (lineIndex >= DEMO_SEQUENCE.length) {
      setTimeout(() => {
        setLines([])
        setLineIndex(0)
        setCurrentInput('')
        setIsTyping(true)
      }, 5000)
      return
    }

    const line = DEMO_SEQUENCE[lineIndex]

    if (line.type === 'cmd') {
      let charIdx = 0
      setIsTyping(true)
      const interval = setInterval(() => {
        charIdx++
        setCurrentInput(line.text.slice(0, charIdx))
        if (charIdx >= line.text.length) {
          clearInterval(interval)
          setTimeout(() => {
            setLines((prev) => [...prev, line])
            setCurrentInput('')
            setLineIndex((i) => i + 1)
          }, 500)
        }
      }, 55)
    } else {
      setTimeout(() => {
        setLines((prev) => [...prev, line])
        setLineIndex((i) => i + 1)
      }, line.type === 'dim' ? 150 : 350)
    }
  }, [lineIndex])

  useEffect(() => {
    typeNextLine()
  }, [lineIndex, typeNextLine])

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines, currentInput])

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5">
        <Terminal className="h-3.5 w-3.5 text-violet-400" />
        <span className="font-mono text-[11px] text-neutral-500">prism-cli</span>
        <div className="ml-auto flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      <div ref={containerRef} className="h-80 overflow-y-auto p-5 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={cn('mb-1', line.type === 'dim' && 'h-2')}>
            {line.type === 'cmd' && (
              <span>
                <span className="text-emerald-400">~/alpha </span>
                <span className="text-neutral-600">$ </span>
                <span className="text-violet-400">{line.text}</span>
              </span>
            )}
            {line.type === 'output' && <span className="text-neutral-400">{line.text}</span>}
            {line.type === 'path' && (
              <span>
                {i > 0 && lines[i - 1]?.type === 'output' && (
                  <span className="text-neutral-400">{lines[i - 1].text}</span>
                )}
                <span className="text-sky-400">{line.text}</span>
              </span>
            )}
            {line.type === 'flag' && (
              <span className="text-amber-400/90">{line.text}</span>
            )}
            {line.type === 'success' && <span className="text-emerald-400">{line.text}</span>}
          </div>
        ))}

        {(isTyping || currentInput) && (
          <div>
            <span className="text-emerald-400">~/alpha </span>
            <span className="text-neutral-600">$ </span>
            <span className="text-violet-400">{currentInput}</span>
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-violet-500/80" />
          </div>
        )}
      </div>
    </div>
  )
}
