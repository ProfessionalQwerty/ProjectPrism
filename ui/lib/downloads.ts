/** Install via npx (no npm registry publish, no direct binary download). */
export const NPM_INSTALL_COMMAND = 'npx --yes github:ProfessionalQwerty/ProjectPrism'

export type PlatformId = 'windows' | 'mac' | 'linux' | 'unknown'

export function detectPlatform(): { id: PlatformId; label: string } {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''
  const platform = typeof navigator !== 'undefined' ? navigator.platform.toLowerCase() : ''

  if (platform.includes('win') || ua.includes('windows')) return { id: 'windows', label: 'Windows' }
  if (platform.includes('mac') || ua.includes('macintosh')) return { id: 'mac', label: 'macOS' }
  if (platform.includes('linux') || ua.includes('linux')) return { id: 'linux', label: 'Linux' }
  return { id: 'unknown', label: 'your platform' }
}

export const SUPPORTED_PLATFORMS: Array<{ id: Exclude<PlatformId, 'unknown'>; label: string }> = [
  { id: 'windows', label: 'Windows' },
  { id: 'mac', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
]

export function getNpmInstallLabel(): string {
  return 'Copy install command'
}

export function getInstallHint(): string {
  return 'Requires Node.js 18+. Installs PRISM and creates a desktop shortcut. One command — Windows, macOS, or Linux.'
}

export function getInstallSupportLabel(): string {
  return 'Works on Windows, macOS & Linux'
}

export function getFirstLaunchNote(): string {
  return 'Windows: SmartScreen may warn on first launch — click More info → Run anyway. This is normal for unsigned apps.'
}

export async function copyNpmInstallCommand(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(NPM_INSTALL_COMMAND)
    return true
  } catch {
    return false
  }
}
