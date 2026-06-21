import { apiClient } from '../api-config'

let lastOnline = false

export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.get<{ success: boolean }>('/api/health')
    lastOnline = true
    return true
  } catch {
    lastOnline = false
    return false
  }
}

export function wasApiOnline(): boolean {
  return lastOnline
}
