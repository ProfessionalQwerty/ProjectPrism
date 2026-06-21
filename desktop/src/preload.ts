import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('prismDesktop', true)

contextBridge.exposeInMainWorld('prismAPI', {
  getAppVersion: () => ipcRenderer.invoke('app:version') as Promise<string>,
  checkForUpdates: () =>
    ipcRenderer.invoke('app:checkForUpdates') as Promise<{
      currentVersion: string
      latestVersion: string | null
      updateAvailable: boolean
      downloadUrl: string | null
      releaseUrl: string | null
      error?: string
    }>,
  pickFolder: () => ipcRenderer.invoke('dialog:pickFolder') as Promise<string | null>,
  pickFolderAndCollect: () =>
    ipcRenderer.invoke('project:pickAndCollect') as Promise<{
      name: string
      folder: string
      files: Array<{ path: string; content: string }>
    } | null>,
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url) as Promise<boolean>,
})
