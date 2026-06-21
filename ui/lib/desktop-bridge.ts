/** Typed bridge to Electron preload APIs. */
export function isDesktopApp(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(window.prismDesktop)
}

export function getDesktopAPI(): Window['prismAPI'] | null {
  if (!isDesktopApp() || !window.prismAPI) return null
  return window.prismAPI
}

export async function pickFolderAndCollect(): Promise<{
  name: string
  folder: string
  files: Array<{ path: string; content: string }>
} | null> {
  const api = getDesktopAPI()
  if (!api?.pickFolderAndCollect) return null
  return api.pickFolderAndCollect()
}

export async function pickFolder(): Promise<string | null> {
  const api = getDesktopAPI()
  if (!api?.pickFolder) return null
  return api.pickFolder()
}
