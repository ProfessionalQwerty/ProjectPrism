export type AppUpdateInfo = {

  currentVersion: string

  latestVersion: string | null

  updateAvailable: boolean

  downloadUrl: string | null

  releaseUrl: string | null

  error?: string

}



export interface PrismDesktopAPI {

  getAppVersion: () => Promise<string>

  checkForUpdates: () => Promise<AppUpdateInfo>

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

