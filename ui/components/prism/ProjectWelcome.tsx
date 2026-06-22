import React, { useState } from 'react'
import { FolderOpen, FolderPlus, Clock } from 'lucide-react'
import { isDesktopApp, pickFolderAndCollect } from '../../lib/desktop-bridge'
import type { Project } from '../../hooks/useWorkspaceState'
import { DaemonBanner } from './DaemonBanner'
import { ThemeToggle } from './ChatTabBar'
import { UpdateCheckButton } from './UpdateCheckButton'

interface ProjectWelcomeProps {
  apiOnline: boolean
  bootstrapComplete: boolean
  projects: Project[]
  dark: boolean
  onToggleTheme: () => void
  onRetryConnection: () => void
  onOpenProject: (id: string) => Promise<void>
  onConnectUpload: (name: string, files: Array<{ path: string; content: string }>) => Promise<void>
}

export function ProjectWelcome({
  apiOnline,
  bootstrapComplete,
  projects,
  dark,
  onToggleTheme,
  onRetryConnection,
  onOpenProject,
  onConnectUpload,
}: ProjectWelcomeProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const desktop = isDesktopApp()

  const recent = [...projects].sort((a, b) => {
    const ta = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0
    const tb = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0
    return tb - ta
  })

  const openFolder = async () => {
    if (!apiOnline) {
      setError('Cloud engine is offline. Retry connection first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (desktop) {
        const picked = await pickFolderAndCollect()
        if (!picked) return
        await onConnectUpload(name.trim() || picked.name, picked.files)
      } else {
        setError('Install the desktop app to open a local folder with the cloud engine.')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const openRecent = async (id: string) => {
    if (!apiOnline) {
      setError('Cloud engine is offline. Retry connection first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onOpenProject(id)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="workspace-theme flex h-screen flex-col overflow-hidden bg-[#ececec] text-[16px] dark:bg-neutral-950 dark:text-neutral-100">
      {!apiOnline && <DaemonBanner onRetry={onRetryConnection} />}

      <div className="flex items-center justify-end gap-2 border-b border-neutral-300/80 bg-[#f3f3f3] px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900">
        <UpdateCheckButton />
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              PRISM
            </h1>
            <p className="mt-2 text-[14px] text-neutral-500 dark:text-neutral-400">
              Open a repository to start. Chat, sessions, and connections are scoped to each project.
            </p>
          </div>

          {!bootstrapComplete ? (
            <p className="text-center text-[13px] text-neutral-500">Connecting to engine…</p>
          ) : (
            <>
              <label className="mb-4 block">
                <span className="mb-1 block text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
                  Display name <span className="font-normal text-neutral-400">(optional)</span>
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My App"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-violet-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </label>

              <button
                type="button"
                disabled={loading || !apiOnline}
                onClick={() => void openFolder()}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-[14px] font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
              >
                <FolderOpen className="h-4 w-4" />
                {loading ? 'Opening…' : desktop ? 'Open folder' : 'Open folder (desktop app)'}
              </button>

              {recent.length > 0 && (
                <div className="mt-6 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3 text-[12px] font-medium uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
                    <Clock className="h-3.5 w-3.5" />
                    Recent projects
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {recent.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          disabled={loading || !apiOnline}
                          onClick={() => void openRecent(p.id)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-neutral-50 disabled:opacity-50 dark:hover:bg-neutral-800"
                        >
                          <FolderPlus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-medium text-neutral-800 dark:text-neutral-100">
                              {p.name}
                            </div>
                            {p.repoPath && (
                              <div className="truncate font-mono text-[11px] text-neutral-500">{p.repoPath}</div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && <p className="mt-4 text-center text-[12px] text-red-600">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
