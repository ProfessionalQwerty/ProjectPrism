import React, { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Bug,
  ChevronDown,
  Layers,
  ListTree,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import {
  WORKSPACE_MODES,
  getWorkspaceModeDefinition,
  type WorkspaceMode,
} from '../../lib/workspace-modes'

const MODE_ICONS: Record<WorkspaceMode, LucideIcon> = {
  agent: Bot,
  plan: ListTree,
  debug: Bug,
  multitask: Layers,
  ask: MessageCircle,
}

interface ModeSelectorProps {
  mode: WorkspaceMode
  onModeChange: (mode: WorkspaceMode) => void
  disabled?: boolean
  /** Opens upward (composer) or downward (title bar) */
  menuPlacement?: 'up' | 'down'
  compact?: boolean
}

export function ModeSelector({
  mode,
  onModeChange,
  disabled,
  menuPlacement = 'down',
  compact,
}: ModeSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = getWorkspaceModeDefinition(mode)
  const Icon = MODE_ICONS[mode]

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded-md border border-transparent text-[13px] font-medium transition-colors',
          compact ? 'px-2 py-1' : 'px-2.5 py-1.5',
          'text-neutral-700 hover:bg-neutral-200/70 dark:text-neutral-200 dark:hover:bg-neutral-800',
          open && 'bg-neutral-200/70 dark:bg-neutral-800',
          disabled && 'opacity-50'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
        <span>{current.label}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-neutral-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute z-50 w-72 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900',
            menuPlacement === 'up' ? 'bottom-full left-0 mb-1' : 'left-0 top-full mt-1'
          )}
        >
          {WORKSPACE_MODES.map((opt) => {
            const OptIcon = MODE_ICONS[opt.id]
            const selected = opt.id === mode
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onModeChange(opt.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800',
                  selected && 'bg-violet-50 dark:bg-violet-950/30'
                )}
              >
                <OptIcon
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    selected ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-400'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-100">
                      {opt.label}
                    </span>
                    {opt.shortcut && (
                      <span className="rounded border border-neutral-200 px-1 py-px font-mono text-[10px] text-neutral-400 dark:border-neutral-600">
                        {opt.shortcut}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                    {opt.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
