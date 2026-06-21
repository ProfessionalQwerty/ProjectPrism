import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'prism-theme'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark((value) => !value), [])

  return { dark, toggle }
}
