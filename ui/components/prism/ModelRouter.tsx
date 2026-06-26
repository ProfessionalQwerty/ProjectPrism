import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Link2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ModelLogo } from '../ui/ModelLogo'
import { MODEL_OPTIONS, getModelOption, type ModelOption } from '../../lib/model-router'
import type { LlmOAuthProviderId } from '../../lib/models'

interface ModelRouterProps {
  selectedModelId: string
  connectedProviders: Set<string>
  onSelectModel: (option: ModelOption) => void
  onConnectModel: (providerId: string, oauthProvider?: LlmOAuthProviderId) => void
  disabled?: boolean
}

export function ModelRouter({
  selectedModelId,
  connectedProviders,
  onSelectModel,
  onConnectModel,
  disabled,
}: ModelRouterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = getModelOption(selectedModelId) || MODEL_OPTIONS[0]
  const isConnected = connectedProviders.has(selected.providerId)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[13px] dark:border-neutral-600 dark:bg-neutral-800',
          disabled && 'opacity-50'
        )}
      >
        <ModelLogo provider={selected.providerId} size={16} />
        <span className="font-medium text-neutral-800 dark:text-neutral-100">{selected.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
      </button>

      {!isConnected && (
        <button
          type="button"
          onClick={() => onConnectModel(selected.providerId, selected.oauthProvider)}
          className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[12px] font-medium text-violet-800 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200"
        >
          <Link2 className="h-3.5 w-3.5" />
          Connect model
        </button>
      )}

      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-1 max-h-64 w-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectModel(opt)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800',
                opt.id === selectedModelId && 'bg-violet-50 dark:bg-violet-950/30'
              )}
            >
              <ModelLogo provider={opt.providerId} size={18} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-100">{opt.label}</div>
                <div className="text-[11px] text-neutral-500">{opt.description}</div>
              </div>
              {!connectedProviders.has(opt.providerId) && (
                <span className="text-[10px] text-amber-600">connect</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
