const viteEnv = (import.meta as ImportMeta & {
  env?: {
    VITE_DOWNLOAD_BASE_URL?: string
    VITE_GITHUB_REPO?: string
  }
}).env

const DEFAULT_REPO = 'ProfessionalQwerty/ProjectRuby'
const DEFAULT_TAG_BASE = `https://github.com/${DEFAULT_REPO}/releases/latest/download`

export const NPM_INSTALL_COMMAND = 'npx @prism/install'

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

/**
 * Valid download bases end with /download or /latest/download — NOT /releases/tag/vX.
 * Common mistake: .../releases/tag/v0.1.0 → .../releases/download/v0.1.0
 */
export function normalizeDownloadBase(raw?: string): string {
  if (!raw?.trim()) return DEFAULT_TAG_BASE

  let base = raw.trim().replace(/\/$/, '')

  const tagMatch = base.match(/\/releases\/tag\/(v[^/?#]+)$/i)
  if (tagMatch) {
    base = base.replace(/\/releases\/tag\/[^/?#]+$/i, `/releases/download/${tagMatch[1]}`)
  }

  if (/\/releases\/tag\//i.test(base)) {
    return DEFAULT_TAG_BASE
  }

  if (!/\/download(\/|$)/i.test(base)) {
    return DEFAULT_TAG_BASE
  }

  return base
}

export function getDownloadUrl(filename?: string): string {
  const base = normalizeDownloadBase(viteEnv?.VITE_DOWNLOAD_BASE_URL)
  const file = filename || detectPlatformAsset().filename
  return `${base}/${file}`
}

function repoSlug(): string {
  return viteEnv?.VITE_GITHUB_REPO || DEFAULT_REPO
}

function pickAssetFromList(
  assets: Array<{ name: string; browser_download_url: string }>,
  platform: PlatformAsset
): { name: string; browser_download_url: string } | undefined {
  const exact = assets.find((a) => a.name === platform.filename)
  if (exact) return exact

  if (platform.id === 'windows') {
    return assets.find((a) => a.name.endsWith('.exe') && !a.name.endsWith('.blockmap'))
  }
  if (platform.id === 'mac') {
    return assets.find((a) => a.name.endsWith('.dmg') && !a.name.endsWith('.blockmap'))
  }
  if (platform.id === 'linux') {
    return assets.find((a) => a.name.endsWith('.AppImage'))
  }
  return undefined
}

async function resolveDirectDownloadUrl(platform: PlatformAsset): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoSlug()}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      assets?: Array<{ name: string; browser_download_url: string }>
    }
    const asset = pickAssetFromList(data.assets || [], platform)
    return asset?.browser_download_url ?? null
  } catch {
    return null
  }
}

/** Start a direct installer download (not the GitHub releases page). */
export async function downloadInstaller(filename?: string): Promise<void> {
  const platform = detectPlatformAsset()
  const target = filename || platform.filename

  const direct = await resolveDirectDownloadUrl({ ...platform, filename: target })
  const url = direct || getDownloadUrl(target)

  window.location.assign(url)
}

export function getDownloadButtonLabel(): string {
  const { label } = detectPlatformAsset()
  return label === 'your platform' ? 'Direct download' : `Direct download (${label})`
}

export function getNpmInstallLabel(): string {
  return 'Install with npm'
}

export async function copyNpmInstallCommand(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(NPM_INSTALL_COMMAND)
    return true
  } catch {
    return false
  }
}

export function getInstallHint(): string {
  const { label } = detectPlatformAsset()
  if (label === 'your platform') {
    return 'Requires Node.js 18+. Creates a desktop shortcut. On first launch, approve the unsigned app if prompted.'
  }
  return `Requires Node.js 18+. Installs PRISM for ${label} with a desktop shortcut. On first launch, approve the unsigned app if prompted.`
}

export function getSmartScreenHint(): string {
  return 'Windows SmartScreen: click "More info" → "Run anyway" on first launch. macOS: right-click → Open.'
}
