import * as pty from 'node-pty'
import { ipcMain, type IpcMainInvokeEvent, type WebContents } from 'electron'
import { normalizeTerminalChunk } from './terminal-sanitize'

const shells = new Map<string, pty.IPty>()

/** Per-PTY scrubbed log buffer — flushed in chunks, never per-character. */
interface LogBuffer {
  raw: string
  timer: ReturnType<typeof setTimeout> | null
  sender: WebContents
}

const logBuffers = new Map<string, LogBuffer>()

const LOG_FLUSH_MS = 500
const LOG_MIN_CHARS = 256
const LOG_MAX_CHARS = 8192

function flushLogChunk(id: string, force = false): void {
  const buf = logBuffers.get(id)
  if (!buf || !buf.raw) return

  const chunk = normalizeTerminalChunk(buf.raw, LOG_MAX_CHARS)
  buf.raw = ''
  if (buf.timer) {
    clearTimeout(buf.timer)
    buf.timer = null
  }
  if (force || chunk.length >= LOG_MIN_CHARS) {
    buf.sender.send('pty:log-chunk', id, chunk)
  }
}

function scheduleLogFlush(id: string): void {
  const buf = logBuffers.get(id)
  if (!buf) return
  if (buf.raw.length >= LOG_MAX_CHARS) {
    flushLogChunk(id)
    return
  }
  if (buf.timer) return
  buf.timer = setTimeout(() => flushLogChunk(id), LOG_FLUSH_MS)
}

function appendScrubbedLog(id: string, data: string, sender: WebContents): void {
  let buf = logBuffers.get(id)
  if (!buf) {
    buf = { raw: '', timer: null, sender }
    logBuffers.set(id, buf)
  }
  buf.sender = sender
  buf.raw += stripForBuffer(data)
  scheduleLogFlush(id)
}

function stripForBuffer(data: string): string {
  return normalizeTerminalChunk(data, LOG_MAX_CHARS)
}

export function registerPtyHandlers(): void {
  ipcMain.handle('pty:create', (event: IpcMainInvokeEvent, cwd: string, cols = 80, rows = 24) => {
    const id = `pty-${Date.now()}`
    const shell = process.platform === 'win32' ? 'powershell.exe' : process.env.SHELL || 'bash'
    const p = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols,
      rows,
      cwd: cwd || process.cwd(),
      env: process.env as Record<string, string>,
    })
    shells.set(id, p)
    logBuffers.set(id, { raw: '', timer: null, sender: event.sender })

    p.onData((data) => {
      // Raw stream for xterm display only
      event.sender.send('pty:data', id, data)
      // Scrubbed + batched for ledger/indexing — never real-time per char
      appendScrubbedLog(id, data, event.sender)
    })

    p.onExit(() => {
      flushLogChunk(id, true)
      logBuffers.delete(id)
      shells.delete(id)
      event.sender.send('pty:exit', id)
    })
    return id
  })

  ipcMain.handle('pty:write', (_e: IpcMainInvokeEvent, id: string, data: string) => {
    shells.get(id)?.write(data)
  })

  ipcMain.handle('pty:resize', (_e: IpcMainInvokeEvent, id: string, cols: number, rows: number) => {
    shells.get(id)?.resize(cols, rows)
  })

  ipcMain.handle('pty:kill', (event: IpcMainInvokeEvent, id: string) => {
    flushLogChunk(id, true)
    logBuffers.delete(id)
    shells.get(id)?.kill()
    shells.delete(id)
    event.sender.send('pty:exit', id)
  })

  ipcMain.handle('pty:flush-log', (event: IpcMainInvokeEvent, id: string) => {
    const buf = logBuffers.get(id)
    if (buf) buf.sender = event.sender
    flushLogChunk(id, true)
  })
}
