import type { ChatMessage } from './chat-types'

export interface ChatTab {
  id: string
  sessionId: string
  title: string
  messages: ChatMessage[]
  updatedAt: string
}

function storageKey(projectId: string | null, agentId: string): string {
  return `prism-chat-tabs:${projectId || 'default'}:${agentId}`
}

export function loadChatTabs(projectId: string | null, agentId: string): ChatTab[] {
  try {
    const raw = localStorage.getItem(storageKey(projectId, agentId))
    if (!raw) return [createChatTab('New chat')]
    const parsed = JSON.parse(raw) as ChatTab[]
    return parsed.length > 0 ? parsed : [createChatTab('New chat')]
  } catch {
    return [createChatTab('New chat')]
  }
}

export function saveChatTabs(projectId: string | null, agentId: string, tabs: ChatTab[]): void {
  localStorage.setItem(storageKey(projectId, agentId), JSON.stringify(tabs))
}

export function createChatTab(title = 'New chat'): ChatTab {
  const sessionId = crypto.randomUUID()
  return {
    id: sessionId,
    sessionId,
    title,
    messages: [],
    updatedAt: new Date().toISOString(),
  }
}

export function titleFromMessages(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user' && m.content.trim())
  if (!firstUser) return 'New chat'
  const text = firstUser.content.trim()
  return text.length > 36 ? `${text.slice(0, 36)}…` : text
}
