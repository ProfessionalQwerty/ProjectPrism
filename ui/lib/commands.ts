export const QUICK_COMMANDS: Record<string, { prompt: string; hint: string }> = {
  '/index': {
    hint: 'Report repository graph index status',
    prompt: '/index repository memory and report the current graph status',
  },
  '/refactor': {
    hint: 'Improve cross-session context compilation',
    prompt: '/refactor context compilation for more reliable cross-session continuity',
  },
  '/summarize': {
    hint: 'Summarize current orchestration state',
    prompt: '/summarize the current PRISM orchestration state',
  },
  '/catchup': {
    hint: 'Sync model with graph + datalog since last session',
    prompt:
      'Review the execution ledger, datalog, and repository graph index since your last session on this project. Compile continuity context, summarize what changed and which tasks completed, then end with exactly: "I am up to date, what would you like me to do?"',
  },
  '/deploy': {
    hint: 'Commit, push to GitHub, and deploy on Vercel',
    prompt:
      'Use the PRISM connections API to deploy this project: POST /api/deploy with a clear commit message. Report the live URL when ready. If GitHub or Vercel is not connected, tell the user to open the Connections tab first.',
  },
  '/preview': {
    hint: 'Start local dev server preview inside PRISM',
    prompt:
      'Start a local preview with POST /api/preview/start, stream logs from GET /api/preview, and share the preview URL with the user.',
  },
}
