import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { join } from 'path'
import { collectProjectFiles } from './collect-files'

const isDev = process.env.ELECTRON_DEV === '1'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    title: 'PRISM',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (isDev) {
    void win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    const indexPath = join(__dirname, '../../ui/dist/index.html')
    void win.loadFile(indexPath)
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('app:version', () => app.getVersion())

ipcMain.handle('dialog:pickFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (result.canceled || result.filePaths.length === 0) return null
  return result.filePaths[0]
})

ipcMain.handle('project:pickAndCollect', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (result.canceled || result.filePaths.length === 0) return null
  const folder = result.filePaths[0]
  const name = folder.split(/[/\\]/).pop() || 'Project'
  const files = collectProjectFiles(folder)
  return { name, folder, files }
})

ipcMain.handle('shell:openExternal', (_event, url: string) => {
  if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
    return shell.openExternal(url)
  }
  return false
})
