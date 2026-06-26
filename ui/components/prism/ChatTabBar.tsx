import React from 'react'
import { Moon, Sun, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ChatTabView {
  id: string
  sessionId: string
  title: string
}

interface ChatTabBarProps {
  tabs: ChatTabView[]
  activeTabId: string | null
  onSelectTab: (tabId: string) => void
  onNewTab: () => void
  onCloseTab: (tabId: string) => void
}

export function ChatTabBar({ tabs, activeTabId, onSelectTab, onNewTab, onCloseTab }: ChatTabBarProps) {
  return (
    <div className="relative z-10 flex items-center gap-1 overflow-x-auto border-b border-neutral-200/80 bg-white/75 px-3 py-2 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/75">
      {tabs.map((tab) => {
        const active = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            className={cn(
              'group flex max-w-[220px] shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 text-[14px] transition-colors',
              active
                ? 'border-violet-300 bg-violet-50 text-neutral-900 dark:border-violet-600 dark:bg-violet-950/40 dark:text-neutral-100'
                : 'border-transparent bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            )}
          >
            <button type="button" onClick={() => onSelectTab(tab.id)} className="min-w-0 flex-1 truncate text-left">
              {tab.title}
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                title="Close tab"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(tab.id)
                }}
                className="rounded p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100 dark:hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )
      })}
      <button
        type="button"
        onClick={onNewTab}
        className="shrink-0 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-[14px] text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 dark:border-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        + New chat
      </button>
    </div>
  )
}

interface ThemeToggleProps {
  dark: boolean
  onToggle: () => void
}

export function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
