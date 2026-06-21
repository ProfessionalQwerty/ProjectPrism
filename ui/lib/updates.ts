import { getDesktopAPI } from './desktop-bridge'

export type AppUpdateInfo = {
  currentVersion: string
  latestVersion: string | null
  updateAvailable: boolean
  downloadUrl: string | null
  releaseUrl: string | null
  error?: string
}

export async function checkForAppUpdate(): Promise<AppUpdateInfo> {
  const api = getDesktopAPI()
  if (api?.checkForUpdates) {
    return api.checkForUpdates()
  }
  return {
    currentVersion: '0.0.0',
    latestVersion: null,
    updateAvailable: false,
    downloadUrl: null,
    releaseUrl: 'https://github.com/ProfessionalQwerty/ProjectRuby/releases/latest',
    error: 'Not running in desktop app',
  }
}

export async function openUpdateDownload(url: string): Promise<void> {
  const api = getDesktopAPI()
  if (api?.openExternal) {
    await api.openExternal(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
