const viteEnv = (import.meta as ImportMeta & {
  env?: {
    VITE_DOWNLOAD_BASE_URL?: string
    VITE_GITHUB_REPO?: string
  }
}).env

const DEFAULT_REPO = 'ProfessionalQwerty/ProjectRuby'
const DEFAULT_TAG_BASE = `https://github.com/${DEFAULT_REPO}/releases/latest/download`

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
  const base = (viteEnv?.VITE_DOWNLOAD_BASE_URL || DEFAULT_TAG_BASE).replace(/\/$/, '')
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

/**
 * Start a direct file download.
 * Uses GitHub API browser_download_url when available (reliable cross-origin).
 * Falls back to /releases/latest/download/{filename}.
 */
export async function downloadInstaller(filename?: string): Promise<void> {
  const platform = detectPlatformAsset()
  const target = filename || platform.filename

  const direct = await resolveDirectDownloadUrl({ ...platform, filename: target })
  const url = direct || getDownloadUrl(target)

  // Navigation triggers GitHub's Content-Disposition download for .exe/.dmg/.AppImage.
  // The HTML download attribute is ignored cross-origin and often opens the releases page.
  window.location.assign(url)
}

export function getDownloadButtonLabel(): string {
  const { label } = detectPlatformAsset()
  return label === 'your platform' ? 'Download PRISM' : `Download for ${label}`
}
