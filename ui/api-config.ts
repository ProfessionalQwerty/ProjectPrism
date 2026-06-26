/**
 * API Configuration — cloud engine URL + optional client key for HF Spaces.
 */
import { getAccessToken } from './lib/supabase-auth'

const viteEnv = import.meta.env

const DEFAULT_CLOUD_API = 'https://yashshshsh-prism.hf.space'

/** Production desktop/web builds always target the cloud engine unless overridden. */
export const API_URL =
  viteEnv.VITE_API_URL?.trim() ||
  (viteEnv.DEV ? '' : DEFAULT_CLOUD_API)

const CLIENT_KEY = viteEnv.VITE_PRISM_CLIENT_KEY?.trim() || ''
const HF_ACCESS_TOKEN = viteEnv.VITE_HF_ACCESS_TOKEN?.trim() || ''

/** True when the build embedded credentials for a private Hugging Face Space. */
export const hasCloudCredentials = (): boolean =>
  Boolean(HF_ACCESS_TOKEN && CLIENT_KEY)

export const getApiUrl = (path: string): string => `${API_URL}${path}`

export function buildApiHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  }
  if (CLIENT_KEY) {
    headers['X-PRISM-Client-Key'] = CLIENT_KEY
  }
  if (HF_ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_ACCESS_TOKEN}`
  }
  return headers
}

export async function buildApiHeadersAsync(extra?: Record<string, string>): Promise<Record<string, string>> {
  const headers = buildApiHeaders(extra)
  if (!HF_ACCESS_TOKEN) {
    const token = await getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const apiClient = {
  async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(getApiUrl(path), {
      ...options,
      headers: await buildApiHeadersAsync(options?.headers as Record<string, string>),
    })

    if (!response.ok) {
      let detail = `${response.status} ${response.statusText}`
      let showUpgradeModal = false
      try {
        const body = (await response.json()) as {
          error?: string
          message?: string
          showUpgradeModal?: boolean
        }
        if (body.error) detail = body.error
        else if (body.message) detail = body.message
        showUpgradeModal = Boolean(body.showUpgradeModal)
      } catch {
        // ignore non-JSON bodies
      }
      const err = new Error(detail) as Error & { showUpgradeModal?: boolean; status?: number }
      err.showUpgradeModal = showUpgradeModal
      err.status = response.status
      throw err
    }

    return response.json()
  },

  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.fetch<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'GET' })
  },
}
