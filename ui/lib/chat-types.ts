export type ThinkingPhase = 'think' | 'plan' | 'act'

export interface ThinkingStage {
  phase: ThinkingPhase
  status: 'pending' | 'active' | 'done' | 'error'
  label: string
  content?: string
  error?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  detail?: string
  stages?: ThinkingStage[]
}
