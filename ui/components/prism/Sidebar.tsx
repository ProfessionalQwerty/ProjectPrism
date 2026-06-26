import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FolderOpen,
  FolderTree,
  Plus,
  Search,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { Project } from '../../hooks/useWorkspaceState'

interface SidebarProps {
  activeProject: Project | null
  projects: Project[]
  repoFiles: string[]
  restorationMessage: string | null
  activeTaskTitle: string | null
  onSelectProject: (id: string) => void
  onConnectProject: () => void
}

export function Sidebar({
  activeProject,
  projects,
  repoFiles,
  restorationMessage,
  activeTaskTitle,
  onSelectProject,
  onConnectProject,
}: SidebarProps) {
  const [explorerOpen, setExplorerOpen] = useState(true)
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredFiles = repoFiles.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-r border-neutral-300/60 bg-[#f3f3f3]/75 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/75">
      <div className="relative border-b border-neutral-300/80 p-2">
        <button
          type="button"
          onClick={() => setProjectMenuOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
        >
          <FolderOpen className="h-5 w-5 shrink-0 text-neutral-500" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-medium text-neutral-800 dark:text-neutral-100">
              {activeProject?.name || 'No project'}
            </div>
            {activeProject?.repoPath && (
              <div className="truncate font-mono text-[10px] text-neutral-500">
                {activeProject.repoPath}
              </div>
            )}
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
        </button>

        {projectMenuOpen && (
          <div className="absolute left-2 right-2 top-full z-40 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectProject(p.id)
                  setProjectMenuOpen(false)
                }}
                className={cn(
                  'block w-full truncate px-3 py-2 text-left text-[12px] hover:bg-neutral-50',
                  p.id === activeProject?.id && 'bg-violet-50 text-violet-900'
                )}
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setProjectMenuOpen(false)
                onConnectProject()
              }}
              className="flex w-full items-center gap-2 border-t border-neutral-100 px-3 py-2 text-[12px] text-violet-700 hover:bg-violet-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Connect repository…
            </button>
          </div>
        )}
      </div>

      {(restorationMessage || activeTaskTitle) && (
        <div className="border-b border-neutral-300/60 px-3 py-2">
          {restorationMessage && (
            <p className="text-[11px] leading-relaxed text-neutral-500">{restorationMessage}</p>
          )}
          {activeTaskTitle && (
            <p className="mt-1 text-[11px] text-neutral-600">
              Task: <span className="font-medium">{activeTaskTitle}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <button
          type="button"
          onClick={() => setExplorerOpen((v) => !v)}
          className="flex w-full items-center gap-1 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 hover:bg-neutral-200/50"
        >
          {explorerOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <FolderTree className="h-3.5 w-3.5" />
          Explorer
        </button>

        {explorerOpen && (
          <div className="px-2 pb-3">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter files…"
                className="w-full rounded border border-neutral-200 bg-white py-1 pl-7 pr-2 text-[11px] outline-none focus:border-violet-300"
              />
            </div>

            {filteredFiles.length === 0 ? (
              <p className="px-2 py-4 text-center text-[11px] text-neutral-400">
                {activeProject
                  ? 'No indexed files yet. Run a prompt to index the repo.'
                  : 'Connect a repository to browse files.'}
              </p>
            ) : (
              <ul className="space-y-0.5">
                {filteredFiles.map((file) => (
                  <li key={file}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left font-mono text-[11px] text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900"
                    >
                      <FileCode2 className="h-3 w-3 shrink-0 text-neutral-400" />
                      <span className="truncate">{file}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
