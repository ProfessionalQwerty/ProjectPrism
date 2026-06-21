import { app } from 'electron'

const DEFAULT_REPO = 'ProfessionalQwerty/ProjectPrism'

export type UpdateCheckResult = {
  currentVersion: string
  latestVersion: string | null
  updateAvailable: boolean
  downloadUrl: string | null
  releaseUrl: string | null
  error?: string
}

function parseVersion(v: string): number[] {
  return v.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0)
}

function isNewer(latest: string, current: string): boolean {
  const a = parseVersion(latest)
  const b = parseVersion(current)
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0)
    if (diff > 0) return true
    if (diff < 0) return false
  }
  return false
}

export async function checkForUpdates(repo = DEFAULT_REPO): Promise<UpdateCheckResult> {
  const currentVersion = app.getVersion()

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'prism-desktop' },
    })

    if (!res.ok) {
      return {
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        downloadUrl: null,
        releaseUrl: `https://github.com/${repo}/releases/latest`,
        error: `Could not reach GitHub (${res.status})`,
      }
    }

    const data = (await res.json()) as {
      tag_name?: string
      html_url?: string
      assets?: Array<{ name: string; browser_download_url: string }>
    }

    const latestVersion = (data.tag_name || '').replace(/^v/i, '')
    const releaseUrl = data.html_url || `https://github.com/${repo}/releases/latest`

    let downloadUrl: string | null = null
    const platform = process.platform
    if (platform === 'win32') {
      downloadUrl =
        data.assets?.find((a) => a.name === 'PRISM-Setup-x64.exe')?.browser_download_url ?? null
    } else if (platform === 'darwin') {
      downloadUrl = data.assets?.find((a) => a.name.endsWith('.dmg'))?.browser_download_url ?? null
    } else {
      downloadUrl = data.assets?.find((a) => a.name.endsWith('.AppImage'))?.browser_download_url ?? null
    }

    return {
      currentVersion,
      latestVersion,
      updateAvailable: Boolean(latestVersion && isNewer(latestVersion, currentVersion)),
      downloadUrl,
      releaseUrl,
    }
  } catch (err) {
    return {
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      downloadUrl: null,
      releaseUrl: `https://github.com/${repo}/releases/latest`,
      error: err instanceof Error ? err.message : 'Update check failed',
    }
  }
}
