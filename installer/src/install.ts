import { createWriteStream, existsSync, readdirSync, statSync } from 'node:fs'
import { mkdir, rm, writeFile, readFile, chmod, mkdtemp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { pipeline } from 'node:stream/promises'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import extractZip from 'extract-zip'
import * as tar from 'tar'

export type PlatformId = 'windows' | 'mac' | 'linux'

export type PlatformAsset = {
  id: PlatformId
  label: string
  /** Preferred zip/tar asset for npm installer */
  portableFilename: string
  /** Fallback direct installer */
  installerFilename: string
}

export const DEFAULT_REPO = 'ProfessionalQwerty/ProjectRuby'

export function detectPlatform(): PlatformAsset {
  const platform = process.platform
  if (platform === 'win32') {
    return {
      id: 'windows',
      label: 'Windows',
      portableFilename: 'PRISM-Setup-x64.zip',
      installerFilename: 'PRISM-Setup-x64.exe',
    }
  }
  if (platform === 'darwin') {
    return {
      id: 'mac',
      label: 'macOS',
      portableFilename: 'PRISM-mac-x64.zip',
      installerFilename: 'PRISM-mac-x64.dmg',
    }
  }
  return {
    id: 'linux',
    label: 'Linux',
    portableFilename: 'PRISM-linux-x64.tar.gz',
    installerFilename: 'PRISM-linux-x64.AppImage',
  }
}

export function installDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || ''
  if (process.platform === 'win32') {
    const local = process.env.LOCALAPPDATA || joinPath(home, 'AppData', 'Local')
    return joinPath(local, 'Programs', 'PRISM')
  }
  if (process.platform === 'darwin') {
    return joinPath(home, 'Applications', 'PRISM.app')
  }
  return joinPath(home, '.local', 'share', 'prism')
}

export function joinPath(...parts: string[]): string {
  return parts.filter(Boolean).join(process.platform === 'win32' ? '\\' : '/')
}

export type ReleaseAsset = {
  name: string
  browser_download_url: string
}

export async function fetchLatestAssets(repo = DEFAULT_REPO): Promise<ReleaseAsset[]> {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'prism-install',
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch latest release (${res.status}). Is a release published?`)
  }
  const data = (await res.json()) as { assets?: ReleaseAsset[] }
  return data.assets || []
}

// Strict per-platform matchers — must NEVER fall back to another OS's archive.
const PLATFORM_MATCHERS: Record<string, (name: string) => boolean> = {
  windows: (n) => n.endsWith('.zip') && /(win|setup)/i.test(n) && !/(mac|osx|darwin|linux)/i.test(n),
  mac: (n) => n.endsWith('.zip') && /(mac|osx|darwin)/i.test(n),
  linux: (n) => /\.(tar\.gz|tgz|appimage)$/i.test(n) && /linux/i.test(n),
}

export function pickPortableAsset(assets: ReleaseAsset[], platform: PlatformAsset): ReleaseAsset {
  const exact = assets.find((a) => a.name === platform.portableFilename)
  if (exact) return exact

  const matcher = PLATFORM_MATCHERS[platform.id]
  const match = matcher && assets.find((a) => matcher(a.name))
  if (match) return match

  throw new Error(
    `No ${platform.label} package found in the latest release (expected ${platform.portableFilename}). ` +
      `Available: ${assets.map((a) => a.name).join(', ') || 'none'}`
  )
}

export async function downloadFile(url: string, dest: string): Promise<void> {
  await mkdir(dirname(dest), { recursive: true })

  const res = await fetch(url, {
    headers: { 'User-Agent': 'prism-install' },
  })
  if (!res.ok || !res.body) {
    throw new Error(`Download failed (${res.status}): ${url}`)
  }

  const file = createWriteStream(dest)
  await pipeline(res.body as unknown as NodeJS.ReadableStream, file)
}

export async function extractArchive(archivePath: string, destDir: string): Promise<void> {
  await mkdir(destDir, { recursive: true })

  if (archivePath.endsWith('.zip')) {
    await extractZip(archivePath, { dir: destDir })
    return
  }

  if (archivePath.endsWith('.tar.gz') || archivePath.endsWith('.tgz')) {
    await tar.extract({ file: archivePath, cwd: destDir })
    return
  }

  throw new Error(`Unsupported archive: ${archivePath}`)
}

export function findAppExecutable(installRoot: string, platform: PlatformAsset): string {
  const candidates: string[] = []

  function walk(dir: string, depth = 0): void {
    if (depth > 6 || !existsSync(dir)) return
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      const stat = statSync(full)
      if (stat.isDirectory()) {
        walk(full, depth + 1)
        continue
      }
      if (platform.id === 'windows' && entry.toLowerCase() === 'prism.exe') {
        candidates.push(full)
      }
      if (platform.id === 'mac' && entry === 'PRISM') {
        candidates.push(full)
      }
      if (platform.id === 'linux' && (entry === 'prism' || entry.endsWith('.AppImage'))) {
        candidates.push(full)
      }
    }
  }

  walk(installRoot)

  if (candidates.length === 0) {
    throw new Error(`Could not find PRISM executable under ${installRoot}`)
  }
  return candidates[0]
}

export async function createShortcuts(exePath: string, platform: PlatformAsset): Promise<void> {
  const exec = promisify(execFile)

  if (platform.id === 'windows') {
    const desktop = join(process.env.USERPROFILE || '', 'Desktop', 'PRISM.lnk')
    const startMenu = join(
      process.env.APPDATA || '',
      'Microsoft',
      'Windows',
      'Start Menu',
      'Programs',
      'PRISM.lnk'
    )
    const ps = `
$shell = New-Object -ComObject WScript.Shell
function New-Shortcut($path) {
  $dir = Split-Path $path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $s = $shell.CreateShortcut($path)
  $s.TargetPath = '${exePath.replace(/'/g, "''")}'
  $s.WorkingDirectory = '${joinPath(exePath, '..').replace(/'/g, "''")}'
  $s.Description = 'PRISM Agentic Development Environment'
  $s.Save()
}
New-Shortcut '${desktop.replace(/'/g, "''")}'
New-Shortcut '${startMenu.replace(/'/g, "''")}'
`
    await exec('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], {
      windowsHide: true,
    })
    return
  }

  if (platform.id === 'mac') {
    const appBundle = exePath.includes('.app/')
      ? exePath.split('.app/')[0] + '.app'
      : join(installDir(), 'PRISM.app')
    console.log(`Installed app at ${appBundle}`)
    console.log('Open from Applications or run: open "' + appBundle + '"')
    return
  }

  const appsDir = join(process.env.HOME || '', '.local', 'share', 'applications')
  await mkdir(appsDir, { recursive: true })
  try {
    await chmod(exePath, 0o755)
  } catch {
    /* ignore */
  }
  const desktopFile = join(appsDir, 'prism.desktop')
  const content = `[Desktop Entry]
Name=PRISM
Comment=PRISM Agentic Development Environment
Exec="${exePath}"
Terminal=false
Type=Application
Categories=Development;
`
  await writeFile(desktopFile, content, 'utf8')
  console.log(`Wrote ${desktopFile}`)
}

export async function installPrism(options: { repo?: string; launch?: boolean } = {}): Promise<void> {
  const platform = detectPlatform()
  console.log(`Installing PRISM for ${platform.label}...`)

  const assets = await fetchLatestAssets(options.repo)
  const asset = pickPortableAsset(assets, platform)
  console.log(`Downloading ${asset.name}...`)

  const tempDir = await mkdtemp(join(tmpdir(), 'prism-install-'))
  const archivePath = join(tempDir, asset.name)

  try {
    await downloadFile(asset.browser_download_url, archivePath)

    const target = installDir()
    console.log(`Extracting to ${target}...`)
    await extractArchive(archivePath, target)

    const exePath = findAppExecutable(target, platform)
    await createShortcuts(exePath, platform)

    const marker = join(target, '.prism-install.json')
    await writeFile(
      marker,
      JSON.stringify({ version: '0.1.1', exePath, installedAt: new Date().toISOString() }, null, 2)
    )

    console.log('')
    console.log('PRISM installed successfully.')
    console.log(`  Location: ${exePath}`)
    console.log('  Desktop shortcut created.')
    console.log('')
    console.log('First launch on Windows: if SmartScreen appears, click "More info" → "Run anyway".')
    console.log('First launch on macOS: right-click the app → Open (Gatekeeper).')
    console.log('')
    console.log('Launch: prism')
    console.log(`Or run: "${exePath}"`)

    if (options.launch) {
      spawn(exePath, [], { detached: true, stdio: 'ignore' }).unref()
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

export async function launchInstalled(): Promise<void> {
  const marker = join(installDir(), '.prism-install.json')
  let exePath: string | undefined

  if (existsSync(marker)) {
    const data = JSON.parse(await readFile(marker, 'utf8')) as { exePath?: string }
    exePath = data.exePath
  }

  if (!exePath || !existsSync(exePath)) {
    const platform = detectPlatform()
    exePath = findAppExecutable(installDir(), platform)
  }

  spawn(exePath, [], { detached: true, stdio: 'ignore' }).unref()
}
