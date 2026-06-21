import React, { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { isDesktopApp } from '../../lib/desktop-bridge'
import { checkForAppUpdate, openUpdateDownload } from '../../lib/updates'

export function UpdateCheckButton() {
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!isDesktopApp()) return null

  const onCheck = async () => {
    setBusy(true)
    setStatus(null)
    try {
      const result = await checkForAppUpdate()
      if (result.error) {
        setStatus('Could not check for updates')
      } else if (result.updateAvailable && result.latestVersion) {
        setStatus(`Update available: v${result.latestVersion}`)
        if (result.downloadUrl) {
          await openUpdateDownload(result.downloadUrl)
        }
      } else {
        setStatus(`You're on the latest version (v${result.currentVersion})`)
      }
    } finally {
      setBusy(false)
      window.setTimeout(() => setStatus(null), 5000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status && (
        <span className="hidden max-w-[180px] truncate text-[11px] text-neutral-500 sm:inline">{status}</span>
      )}
      <button
        type="button"
        onClick={() => void onCheck()}
        disabled={busy}
        title="Check for updates"
        className="flex h-8 items-center gap-1.5 rounded-md border border-neutral-300/80 bg-white px-2.5 text-[12px] font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Updates</span>
      </button>
    </div>
  )
}
