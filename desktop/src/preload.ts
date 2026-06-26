import { contextBridge, ipcRenderer } from 'electron'

export type UpdateStatusPayload = {
  phase: string
  currentVersion: string
  latestVersion: string | null
  percent: number | null
  message: string | null
  error: string | null
}

contextBridge.exposeInMainWorld('prismDesktop', true)

contextBridge.exposeInMainWorld('prismAPI', {
  getAppVersion: () => ipcRenderer.invoke('app:version') as Promise<string>,

  checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates') as Promise<UpdateStatusPayload>,

  downloadUpdate: () => ipcRenderer.invoke('app:downloadUpdate') as Promise<UpdateStatusPayload>,

  installUpdate: () => ipcRenderer.invoke('app:installUpdate') as Promise<void>,

  getUpdateStatus: () => ipcRenderer.invoke('app:getUpdateStatus') as Promise<UpdateStatusPayload>,

  onUpdateStatus: (listener: (status: UpdateStatusPayload) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: UpdateStatusPayload) => listener(status)
    ipcRenderer.on('app:updateStatus', handler)
    return () => ipcRenderer.removeListener('app:updateStatus', handler)
  },

  pickFolder: () => ipcRenderer.invoke('dialog:pickFolder') as Promise<string | null>,

  pickFolderAndCollect: () =>
    ipcRenderer.invoke('project:pickAndCollect') as Promise<{
      name: string
      folder: string
      files: Array<{ path: string; content: string }>
    } | null>,

  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url) as Promise<boolean>,

  windowMinimize: () => ipcRenderer.invoke('window:minimize') as Promise<void>,
  windowToggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize') as Promise<void>,
  windowClose: () => ipcRenderer.invoke('window:close') as Promise<void>,

  ptyCreate: (cwd: string, cols?: number, rows?: number) =>
    ipcRenderer.invoke('pty:create', cwd, cols, rows) as Promise<string>,
  ptyWrite: (id: string, data: string) => ipcRenderer.invoke('pty:write', id, data) as Promise<void>,
  ptyResize: (id: string, cols: number, rows: number) =>
    ipcRenderer.invoke('pty:resize', id, cols, rows) as Promise<void>,
  ptyKill: (id: string) => ipcRenderer.invoke('pty:kill', id) as Promise<void>,
  ptyFlushLog: (id: string) => ipcRenderer.invoke('pty:flush-log', id) as Promise<void>,
  onPtyData: (listener: (id: string, data: string) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, id: string, data: string) => listener(id, data)
    ipcRenderer.on('pty:data', handler)
    return () => ipcRenderer.removeListener('pty:data', handler)
  },
  onPtyLogChunk: (listener: (id: string, chunk: string) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, id: string, chunk: string) => listener(id, chunk)
    ipcRenderer.on('pty:log-chunk', handler)
    return () => ipcRenderer.removeListener('pty:log-chunk', handler)
  },
})
