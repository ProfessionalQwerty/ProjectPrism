import React from 'react'
import { Minus, Square, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { getDesktopAPI } from '../../lib/desktop-bridge'

interface WindowControlsProps {
  className?: string
}

export function WindowControls({ className }: WindowControlsProps) {
  const api = getDesktopAPI()
  if (!api?.windowMinimize) return null

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <button
        type="button"
        title="Minimize"
        onClick={() => void api.windowMinimize?.()}
        className="flex h-8 w-10 items-center justify-center rounded text-neutral-500 hover:bg-neutral-200/80 dark:text-neutral-400 dark:hover:bg-neutral-700"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Maximize"
        onClick={() => void api.windowToggleMaximize?.()}
        className="flex h-8 w-10 items-center justify-center rounded text-neutral-500 hover:bg-neutral-200/80 dark:text-neutral-400 dark:hover:bg-neutral-700"
      >
        <Square className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        title="Close"
        onClick={() => void api.windowClose?.()}
        className="flex h-8 w-10 items-center justify-center rounded text-neutral-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
