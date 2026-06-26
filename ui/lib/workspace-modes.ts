import type { ThinkingStage } from './chat-types'

export type WorkspaceMode = 'agent' | 'plan' | 'debug' | 'multitask' | 'ask'

export interface WorkspaceModeDefinition {
  id: WorkspaceMode
  label: string
  description: string
  placeholder: string
  shortcut?: string
}

export const WORKSPACE_MODES: WorkspaceModeDefinition[] = [
  {
    id: 'agent',
    label: 'Agent',
    description: 'Autonomous think → plan → act with file edits',
    placeholder: 'Ask PRISM to build or change something…',
    shortcut: '⌘I',
  },
  {
    id: 'plan',
    label: 'Plan',
    description: 'Architecture and approach only — no code changes',
    placeholder: 'Describe what you want to plan…',
  },
  {
    id: 'debug',
    label: 'Debug',
    description: 'Diagnose errors from logs, tests, and deploy output',
    placeholder: 'Paste an error or describe what broke…',
  },
  {
    id: 'multitask',
    label: 'Multitask',
    description: 'Break work into parallel sub-tasks and execute in sequence',
    placeholder: 'List multiple goals for PRISM to tackle…',
  },
  {
    id: 'ask',
    label: 'Ask',
    description: 'Read-only Q&A — no file writes or commands',
    placeholder: 'Ask a question about the codebase…',
  },
]

const MODE_SET = new Set(WORKSPACE_MODES.map((m) => m.id))

export function isWorkspaceMode(value: string): value is WorkspaceMode {
  return MODE_SET.has(value as WorkspaceMode)
}

export function getWorkspaceModeDefinition(mode: WorkspaceMode): WorkspaceModeDefinition {
  return WORKSPACE_MODES.find((m) => m.id === mode) || WORKSPACE_MODES[0]
}

const STORAGE_KEY = 'prism-workspace-mode'

export function loadWorkspaceMode(): WorkspaceMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && isWorkspaceMode(raw)) return raw
  } catch {
    // ignore
  }
  return 'agent'
}

export function saveWorkspaceMode(mode: WorkspaceMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore
  }
}

const MODE_PREFIX: Record<WorkspaceMode, string> = {
  agent: '',
  plan:
    '[PLAN MODE] Produce a detailed plan only. Do NOT write code, patches, or shell commands. End with a numbered checklist the user can approve.',
  debug:
    '[DEBUG MODE] Focus on root-cause analysis. Use terminal output, test failures, build logs, and recent ledger entries. Propose minimal fixes with clear verification steps.',
  multitask:
    '[MULTITASK MODE] Split the request into independent sub-tasks. Label each sub-task, execute them one at a time in your response, and summarize outcomes at the end.',
  ask:
    '[ASK MODE] Read-only. Answer from the codebase context. Do NOT propose file edits, run commands, or change the repository.',
}

export function wrapQueryForMode(mode: WorkspaceMode, query: string): string {
  const prefix = MODE_PREFIX[mode]
  if (!prefix) return query
  return `${prefix}\n\n${query}`
}

export function shouldUseStagedOrchestration(mode: WorkspaceMode): boolean {
  return mode !== 'ask'
}

export function initialThinkingStages(mode: WorkspaceMode): ThinkingStage[] {
  if (mode === 'ask') return []
  if (mode === 'plan') {
    return [
      { phase: 'think', status: 'active', label: 'Understanding your request' },
      { phase: 'plan', status: 'pending', label: 'Planning the approach' },
    ]
  }
  return [
    { phase: 'think', status: 'active', label: 'Understanding your request' },
    { phase: 'plan', status: 'pending', label: 'Planning the approach' },
    { phase: 'act', status: 'pending', label: 'Writing code & changes' },
  ]
}
