export type ModelProviderId =
  | 'openai'
  | 'claude-code'
  | 'gemini-cli'
  | 'codex'
  | 'local-model'
  | 'deepseek'
  | 'mistral'
  | 'grok'
  | 'qwen'

export interface ModelCatalogEntry {
  id: ModelProviderId
  name: string
  description: string
  requiresApiKey: boolean
  apiKeyLabel?: string
  providerLabel: string
}

export const MODEL_CATALOG: ModelCatalogEntry[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o and Codex-class models',
    requiresApiKey: true,
    apiKeyLabel: 'OpenAI API Key',
    providerLabel: 'OpenAI',
  },
  {
    id: 'claude-code',
    name: 'Claude',
    description: 'Anthropic Claude via API or CLI',
    requiresApiKey: true,
    apiKeyLabel: 'Anthropic API Key',
    providerLabel: 'Claude',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini',
    description: 'Google Gemini models',
    requiresApiKey: true,
    apiKeyLabel: 'Google AI API Key',
    providerLabel: 'Gemini',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek Chat and coder models',
    requiresApiKey: true,
    apiKeyLabel: 'DeepSeek API Key',
    providerLabel: 'DeepSeek',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    description: 'Mistral AI models',
    requiresApiKey: true,
    apiKeyLabel: 'Mistral API Key',
    providerLabel: 'Mistral',
  },
  {
    id: 'grok',
    name: 'Grok',
    description: 'xAI Grok models',
    requiresApiKey: true,
    apiKeyLabel: 'xAI API Key',
    providerLabel: 'Grok',
  },
  {
    id: 'qwen',
    name: 'Qwen',
    description: 'Alibaba Qwen models (DashScope)',
    requiresApiKey: true,
    apiKeyLabel: 'DashScope API Key',
    providerLabel: 'Qwen',
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'OpenAI Codex for code generation',
    requiresApiKey: true,
    apiKeyLabel: 'OpenAI API Key',
    providerLabel: 'Codex',
  },
  {
    id: 'local-model',
    name: 'Ollama',
    description: 'Local models via Ollama',
    requiresApiKey: false,
    providerLabel: 'Ollama',
  },
]

export const USER_AGENTS_STORAGE_KEY = 'prism-user-agents'

export function loadUserAgentIds(): string[] {
  try {
    const raw = localStorage.getItem(USER_AGENTS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function saveUserAgentIds(ids: string[]): void {
  localStorage.setItem(USER_AGENTS_STORAGE_KEY, JSON.stringify(ids))
}

export function getCatalogEntry(id: string): ModelCatalogEntry | undefined {
  return MODEL_CATALOG.find((m) => m.id === id)
}
