import { app, BrowserWindow } from 'electron'
import type { AppUpdater } from 'electron-updater'

export type UpdatePhase =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error'

export type UpdateStatus = {
  phase: UpdatePhase
  currentVersion: string
  latestVersion: string | null
  percent: number | null
  message: string | null
  error: string | null
}

let mainWindow: BrowserWindow | null = null
let status: UpdateStatus = {
  phase: 'idle',
  currentVersion: app.getVersion(),
  latestVersion: null,
  percent: null,
  message: null,
  error: null,
}

function getAutoUpdater(): AppUpdater | null {
  try {
    // Bundled at desktop/dist/node_modules via scripts/copy-main-deps.mjs
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { autoUpdater } = require('electron-updater') as { autoUpdater: AppUpdater }
    return autoUpdater
  } catch (err) {
    console.warn('[PRISM] electron-updater unavailable:', (err as Error).message)
    return null
  }
}

function pushStatus(patch: Partial<UpdateStatus>): void {
  status = { ...status, ...patch }
  mainWindow?.webContents.send('app:updateStatus', status)
}

export function attachAutoUpdater(win: BrowserWindow): void {
  const autoUpdater = getAutoUpdater()
  if (!autoUpdater) return

  mainWindow = win
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    pushStatus({ phase: 'checking', message: 'Checking for updates…', error: null })
  })

  autoUpdater.on('update-available', (info) => {
    pushStatus({
      phase: 'available',
      latestVersion: info.version,
      message: `Update v${info.version} is available`,
      error: null,
    })
  })

  autoUpdater.on('update-not-available', () => {
    pushStatus({
      phase: 'not-available',
      latestVersion: status.latestVersion,
      message: `You're on the latest version (v${app.getVersion()})`,
      error: null,
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    pushStatus({
      phase: 'downloading',
      percent: progress.percent,
      message: `Downloading update… ${Math.round(progress.percent)}%`,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    pushStatus({
      phase: 'downloaded',
      latestVersion: info.version,
      percent: 100,
      message: `Update v${info.version} ready — restart to install`,
    })
  })

  autoUpdater.on('error', (err) => {
    pushStatus({
      phase: 'error',
      error: err.message,
      message: 'Update failed',
    })
  })
}

export function getUpdateStatus(): UpdateStatus {
  return status
}

export async function checkForAppUpdates(): Promise<UpdateStatus> {
  const autoUpdater = getAutoUpdater()
  if (!autoUpdater) {
    pushStatus({
      phase: 'error',
      error: 'In-app updater is not available in this build',
      message: null,
    })
    return status
  }

  if (!app.isPackaged) {
    pushStatus({
      phase: 'not-available',
      currentVersion: app.getVersion(),
      message: 'Updates apply to installed desktop builds only',
      error: null,
    })
    return status
  }

  try {
    await autoUpdater.checkForUpdates()
  } catch (err) {
    pushStatus({
      phase: 'error',
      error: err instanceof Error ? err.message : 'Update check failed',
    })
  }
  return status
}

export async function downloadAppUpdate(): Promise<UpdateStatus> {
  const autoUpdater = getAutoUpdater()
  if (!autoUpdater || !app.isPackaged) return status
  try {
    pushStatus({ phase: 'downloading', percent: 0, message: 'Starting download…' })
    await autoUpdater.downloadUpdate()
  } catch (err) {
    pushStatus({
      phase: 'error',
      error: err instanceof Error ? err.message : 'Download failed',
    })
  }
  return status
}

export function installDownloadedUpdate(): void {
  const autoUpdater = getAutoUpdater()
  if (!autoUpdater) return
  autoUpdater.quitAndInstall(false, true)
}
