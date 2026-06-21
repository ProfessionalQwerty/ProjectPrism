import React, { useState } from 'react'
import { FolderOpen, Upload, X } from 'lucide-react'
import { isDesktopApp, pickFolderAndCollect } from '../../lib/desktop-bridge'

interface ConnectProjectModalProps {
  onClose: () => void
  onConnect: (repoPath: string, name?: string) => Promise<void>
  onConnectUpload?: (name: string, files: Array<{ path: string; content: string }>) => Promise<void>
}

export function ConnectProjectModal({ onClose, onConnect, onConnectUpload }: ConnectProjectModalProps) {
  const [repoPath, setRepoPath] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const desktop = isDesktopApp()

  const submitPath = async () => {
    const path = repoPath.trim()
    if (!path) {
      setError('Repository path is required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onConnect(path, name.trim() || undefined)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const submitDesktopUpload = async () => {
    if (!onConnectUpload) return
    setLoading(true)
    setError(null)
    try {
      const picked = await pickFolderAndCollect()
      if (!picked) {
        setLoading(false)
        return
      }
      await onConnectUpload(name.trim() || picked.name, picked.files)
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">Connect repository</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {desktop ? (
          <>
            <p className="mb-4 text-[13px] text-neutral-500 dark:text-neutral-400">
              Choose a local folder. PRISM uploads source files to the cloud engine for indexing (max 500 files / 20MB).
            </p>
            <label className="mb-4 block">
              <span className="mb-1 block text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
                Display name <span className="font-normal text-neutral-400">(optional)</span>
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My App"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] outline-none focus:border-violet-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={() => void submitDesktopUpload()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-[14px] font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-violet-600"
            >
              <FolderOpen className="h-4 w-4" />
              {loading ? 'Uploading…' : 'Choose folder & upload to cloud'}
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-[13px] text-neutral-500 dark:text-neutral-400">
              Browser preview cannot index local folders on the cloud engine. Install the desktop app for full project
              indexing, or enter a path if running a local engine.
            </p>
            <label className="mb-3 block">
              <span className="mb-1 block text-[12px] font-medium text-neutral-700 dark:text-neutral-300">Absolute path</span>
              <input
                value={repoPath}
                onChange={(e) => setRepoPath(e.target.value)}
                placeholder="C:\Users\you\projects\my-app"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-[13px] outline-none focus:border-violet-400 dark:border-neutral-600 dark:bg-neutral-800"
              />
            </label>
            <label className="mb-4 block">
              <span className="mb-1 block text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
                Display name <span className="font-normal text-neutral-400">(optional)</span>
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My App"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] outline-none dark:border-neutral-600 dark:bg-neutral-800"
              />
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={() => void submitPath()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white dark:bg-violet-600"
            >
              <Upload className="h-4 w-4" />
              {loading ? 'Connecting…' : 'Connect (local engine)'}
            </button>
          </>
        )}

        {error && <p className="mt-3 text-[12px] text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
