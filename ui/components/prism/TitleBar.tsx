import React from 'react'
import { Minus, Square, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const PROVIDERS = ['OpenAI', 'Claude', 'Gemini', 'Ollama'] as const

interface TitleBarProps {
  activeProvider: string
  onProviderChange: (provider: string) => void
  tabs?: { id: string; label: string; active?: boolean }[]
}

export function TitleBar({ activeProvider, onProviderChange, tabs }: TitleBarProps) {
  const workspaceTabs = tabs ?? [
    { id: 'workspace', label: 'Workspace', active: true },
    { id: 'pipelines', label: 'Pipelines' },
    { id: 'graph', label: 'Graph Index' },
  ]

  return (
    <header className="prism-titlebar flex h-10 shrink-0 items-center border-b border-zinc-800/50 bg-obsidian-300/90 backdrop-blur-md select-none">
      <div className="flex h-full items-center gap-3 pl-3 pr-4">
        <img
          src="/prism-logo.png"
          alt="PRISM"
          className="h-5 w-5 object-contain"
          draggable={false}
        />
        <span className="text-[13px] font-semibold tracking-wide text-zinc-300">PRISM</span>
      </div>

      <div className="flex h-full items-stretch gap-0.5 border-l border-zinc-800/50 pl-3">
        {workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              'relative px-3 text-[11px] font-medium uppercase tracking-wider transition-colors',
              tab.active
                ? 'text-zinc-200 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-zinc-400'
                : 'text-zinc-600 hover:text-zinc-400'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <nav className="ml-6 flex h-full items-stretch gap-0.5" aria-label="Model provider">
        {PROVIDERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onProviderChange(item)}
            className={cn(
              'relative px-3 text-[12px] font-medium transition-colors',
              activeProvider === item
                ? 'text-zinc-100 after:absolute after:bottom-0 after:left-1 after:right-1 after:h-px after:bg-zinc-300'
                : 'text-zinc-600 hover:text-zinc-400'
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex h-full items-center">
        <div className="flex items-center">
          <WindowControl icon={<Minus className="h-3 w-3" />} />
          <WindowControl icon={<Square className="h-2.5 w-2.5" />} />
          <WindowControl icon={<X className="h-3 w-3" />} danger />
        </div>
      </div>
    </header>
  )
}

function WindowControl({
  icon,
  danger,
}: {
  icon: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-11 items-center justify-center text-zinc-500 transition-colors',
        danger ? 'hover:bg-red-950/80 hover:text-red-400' : 'hover:bg-zinc-800/60 hover:text-zinc-300'
      )}
    >
      {icon}
    </button>
  )
}
