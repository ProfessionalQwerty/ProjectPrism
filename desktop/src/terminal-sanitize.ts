/**
 * Strip ANSI / terminal escape sequences before indexing or ledger writes.
 * Fast single-pass regex — safe for high-frequency PTY streams.
 */
const ANSI_RE =
  // eslint-disable-next-line no-control-regex
  /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g

const C0_RE =
  // eslint-disable-next-line no-control-regex
  /[\x00-\x08\x0B\x0C\x0E-\x1A\x7F]/g

export function stripTerminalAnsi(input: string): string {
  return input.replace(ANSI_RE, '').replace(C0_RE, '')
}

export function normalizeTerminalChunk(input: string, maxLen = 16_384): string {
  const cleaned = stripTerminalAnsi(input).replace(/\r\n/g, '\n').trim()
  if (cleaned.length <= maxLen) return cleaned
  return cleaned.slice(-maxLen)
}
