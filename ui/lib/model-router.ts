import type { LlmOAuthProviderId, ModelProviderId } from './models'

export interface ModelOption {
  id: string
  providerId: ModelProviderId
  label: string
  description: string
  oauthProvider?: LlmOAuthProviderId
  requiresConnection: boolean
}

/** Unified model picker — one chat, many models (like Claude/GPT apps). */
export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'gpt-5', providerId: 'openai', label: 'GPT-5', description: 'OpenAI flagship', oauthProvider: 'openai-codex', requiresConnection: true },
  { id: 'gpt-4o', providerId: 'openai', label: 'GPT-4o', description: 'Fast general coding', oauthProvider: 'openai-codex', requiresConnection: true },
  { id: 'codex', providerId: 'openai', label: 'Codex', description: 'Code generation (ChatGPT subscription)', oauthProvider: 'openai-codex', requiresConnection: true },
  { id: 'claude-opus-4', providerId: 'claude-code', label: 'Claude Opus 4', description: 'Anthropic reasoning', oauthProvider: 'anthropic', requiresConnection: true },
  { id: 'claude-sonnet-4', providerId: 'claude-code', label: 'Claude Sonnet 4', description: 'Balanced coding', oauthProvider: 'anthropic', requiresConnection: true },
  { id: 'gemini-2', providerId: 'gemini-cli', label: 'Gemini 2', description: 'Google AI', requiresConnection: true },
  { id: 'deepseek-v3', providerId: 'deepseek', label: 'DeepSeek V3', description: 'DeepSeek API', requiresConnection: true },
  { id: 'mistral-large', providerId: 'mistral', label: 'Mistral Large', description: 'Mistral API', requiresConnection: true },
  { id: 'grok-2', providerId: 'grok', label: 'Grok 2', description: 'xAI API', requiresConnection: true },
  { id: 'qwen-max', providerId: 'qwen', label: 'Qwen Max', description: 'DashScope API', requiresConnection: true },
  { id: 'ollama-local', providerId: 'local-model', label: 'Ollama (local)', description: 'On-device models', requiresConnection: true },
]

export function getModelOption(id: string): ModelOption | undefined {
  return MODEL_OPTIONS.find((m) => m.id === id)
}

export function defaultModelOption(): ModelOption {
  return MODEL_OPTIONS[0]
}
