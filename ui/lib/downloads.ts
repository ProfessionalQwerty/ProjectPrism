const viteEnv = (import.meta as ImportMeta & {
  env?: {
    VITE_DOWNLOAD_BASE_URL?: string
    VITE_APP_VERSION?: string
  }
}).env

const DEFAULT_BASE =
  'https://github.com/ProfessionalQwerty/ProjectRuby/releases/latest/download'

export type PlatformAsset = {
  id: 'windows' | 'mac' | 'linux' | 'unknown'
  label: string
  filename: string
}

export function detectPlatformAsset(): PlatformAsset {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
  const platform = typeof navigator !== 'undefined' ? navigator.platform.toLowerCase() : ''

  if (platform.includes('win') || ua.includes('windows')) {
    return { id: 'windows', label: 'Windows', filename: 'PRISM-Setup-x64.exe' }
  }
  if (platform.includes('mac') || ua.includes('macintosh')) {
    return { id: 'mac', label: 'macOS', filename: 'PRISM-x64.dmg' }
  }
  if (platform.includes('linux') || ua.includes('linux')) {
    return { id: 'linux', label: 'Linux', filename: 'PRISM-x64.AppImage' }
  }
  return { id: 'unknown', label: 'your platform', filename: 'PRISM-Setup-x64.exe' }
}

export function getDownloadUrl(filename?: string): string {
  const base = (viteEnv?.VITE_DOWNLOAD_BASE_URL || DEFAULT_BASE).replace(/\/$/, '')
  const file = filename || detectPlatformAsset().filename
  return `${base}/${file}`
}

/** Trigger a direct browser download (not a GitHub releases page). */
export function downloadInstaller(filename?: string): void {
  const asset = filename || detectPlatformAsset().filename
  const url = getDownloadUrl(asset)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = asset
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export function getDownloadButtonLabel(): string {
  const { label } = detectPlatformAsset()
  return label === 'your platform' ? 'Download PRISM' : `Download for ${label}`
}
