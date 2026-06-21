export interface PrismDesktopAPI {
  getAppVersion: () => Promise<string>
  pickFolder: () => Promise<string | null>
  pickFolderAndCollect: () => Promise<{
    name: string
    folder: string
    files: Array<{ path: string; content: string }>
  } | null>
  openExternal: (url: string) => Promise<boolean>
}

declare global {
  interface Window {
    prismDesktop?: boolean
    prismAPI?: PrismDesktopAPI
  }
}

export {}
