import React from 'react'
import { cn } from '../../lib/utils'
import { WindowControls } from './WindowControls'
import { ThemeToggle } from './ChatTabBar'
import { UpdateCheckButton } from './UpdateCheckButton'

interface TitleBarProps {
  dark: boolean
  onToggleTheme: () => void
  children?: React.ReactNode
}

export function TitleBar({ dark, onToggleTheme, children }: TitleBarProps) {
  return (
    <div
      className={cn(
        'prism-titlebar relative z-20 flex h-11 shrink-0 items-center border-b border-neutral-300/60 bg-[#f3f3f3]/80 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/80',
        '[-webkit-app-region:drag]'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 [-webkit-app-region:no-drag]">
        <span className="text-[15px] font-semibold tracking-wide text-neutral-800 dark:text-neutral-100">
          PRISM
        </span>
      </div>
      {children && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [-webkit-app-region:no-drag]">
          {children}
        </div>
      )}
      <div className="flex shrink-0 items-center gap-1 pr-1 [-webkit-app-region:no-drag]">
        <UpdateCheckButton />
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
        <WindowControls />
      </div>
    </div>
  )
}
