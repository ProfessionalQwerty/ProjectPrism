export type AppUpdateStatus = {
  phase: string
  currentVersion: string
  latestVersion: string | null
  percent: number | null
  message: string | null
  error: string | null
}

export interface PrismDesktopAPI {
  getAppVersion: () => Promise<string>
  checkForUpdates: () => Promise<AppUpdateStatus>
  downloadUpdate: () => Promise<AppUpdateStatus>
  installUpdate: () => Promise<void>
  getUpdateStatus: () => Promise<AppUpdateStatus>
  onUpdateStatus: (listener: (status: AppUpdateStatus) => void) => () => void
  pickFolder: () => Promise<string | null>
  pickFolderAndCollect: () => Promise<{
    name: string
    folder: string
    files: Array<{ path: string; content: string }>
  } | null>
  openExternal: (url: string) => Promise<boolean>
  windowMinimize: () => Promise<void>
  windowToggleMaximize: () => Promise<void>
  windowClose: () => Promise<void>
  ptyCreate?: (cwd: string, cols?: number, rows?: number) => Promise<string>
  ptyWrite?: (id: string, data: string) => Promise<void>
  ptyResize?: (id: string, cols: number, rows: number) => Promise<void>
  ptyKill?: (id: string) => Promise<void>
  ptyFlushLog?: (id: string) => Promise<void>
  onPtyData?: (listener: (id: string, data: string) => void) => () => void
  onPtyLogChunk?: (listener: (id: string, chunk: string) => void) => () => void
}

declare global {
  interface Window {
    prismDesktop?: boolean
    prismAPI?: PrismDesktopAPI
  }
}

export {}
