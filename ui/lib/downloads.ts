const DEFAULT_REPO = 'ProfessionalQwerty/ProjectRuby'
const DEFAULT_TAG_BASE = `https://github.com/${DEFAULT_REPO}/releases/latest/download`

/** Install from GitHub (no npm registry publish required). */
export const NPM_INSTALL_COMMAND = 'npx --yes github:ProfessionalQwerty/ProjectRuby'

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
    return { id: 'mac', label: 'macOS', filename: 'PRISM-mac-x64.dmg' }
  }
  if (platform.includes('linux') || ua.includes('linux')) {
    return { id: 'linux', label: 'Linux', filename: 'PRISM-linux-x64.AppImage' }
  }
  return { id: 'unknown', label: 'your platform', filename: 'PRISM-Setup-x64.exe' }
}

export function getNpmInstallLabel(): string {
  return 'Install with npm'
}

export function getDownloadButtonLabel(): string {
  const { label } = detectPlatformAsset()
  return label === 'your platform' ? 'Direct download' : `Direct download (${label})`
}

export function getInstallHint(): string {
  return 'Requires Node.js 18+. Downloads PRISM from GitHub Releases and creates a desktop shortcut.'
}

export function getWindowsInstallWarning(): string {
  return 'Windows: SmartScreen may warn on first launch — click More info → Run anyway. This is normal for unsigned or newly signed apps.'
}

export async function copyNpmInstallCommand(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(NPM_INSTALL_COMMAND)
    return true
  } catch {
    return false
  }
}

function normalizeDownloadBase(raw?: string): string {
  const viteEnv = (import.meta as ImportMeta & { env?: { VITE_DOWNLOAD_BASE_URL?: string } }).env
  if (!raw?.trim() && !viteEnv?.VITE_DOWNLOAD_BASE_URL?.trim()) return DEFAULT_TAG_BASE

  let base = (raw || viteEnv?.VITE_DOWNLOAD_BASE_URL || '').trim().replace(/\/$/, '')
  const tagMatch = base.match(/\/releases\/tag\/(v[^/?#]+)$/i)
  if (tagMatch) {
    base = base.replace(/\/releases\/tag\/[^/?#]+$/i, `/releases/download/${tagMatch[1]}`)
  }
  if (!/\/download(\/|$)/i.test(base)) return DEFAULT_TAG_BASE
  return base
}

export function getDownloadUrl(filename?: string): string {
  const file = filename || detectPlatformAsset().filename
  return `${normalizeDownloadBase()}/${file}`
}

export async function downloadInstaller(filename?: string): Promise<void> {
  const platform = detectPlatformAsset()
  const target = filename || platform.filename

  try {
    const repo =
      (import.meta as ImportMeta & { env?: { VITE_GITHUB_REPO?: string } }).env?.VITE_GITHUB_REPO ||
      DEFAULT_REPO
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (res.ok) {
      const data = (await res.json()) as {
        assets?: Array<{ name: string; browser_download_url: string }>
      }
      const asset = data.assets?.find((a) => a.name === target)
      if (asset?.browser_download_url) {
        window.location.assign(asset.browser_download_url)
        return
      }
    }
  } catch {
    /* fallback */
  }

  window.location.assign(getDownloadUrl(target))
}

export const ALL_PLATFORM_DOWNLOADS: PlatformAsset[] = [
  { id: 'windows', label: 'Windows', filename: 'PRISM-Setup-x64.exe' },
  { id: 'mac', label: 'macOS', filename: 'PRISM-mac-x64.dmg' },
  { id: 'linux', label: 'Linux', filename: 'PRISM-linux-x64.AppImage' },
]
