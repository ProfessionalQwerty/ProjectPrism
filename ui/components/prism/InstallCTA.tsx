import React, { useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { ButtonColorful } from '../ui/button-colorful'
import { cn } from '../../lib/utils'
import {
  NPM_INSTALL_COMMAND,
  SUPPORTED_PLATFORMS,
  copyNpmInstallCommand,
  getFirstLaunchNote,
  getInstallHint,
  getNpmInstallLabel,
} from '../../lib/downloads'

interface InstallCTAProps {
  className?: string
  /** kept for API compatibility; no longer toggles download buttons */
  showAllPlatforms?: boolean
  copied?: boolean
  onCopy?: () => void
  centered?: boolean
  layout?: 'stacked' | 'wide' | 'compact'
  compactNotes?: boolean
}

export function InstallCTA({
  className = '',
  copied,
  onCopy,
  centered = true,
  layout = 'stacked',
  compactNotes = false,
}: InstallCTAProps) {
  const [localCopied, setLocalCopied] = useState(false)
  const isCopied = copied ?? localCopied
  const isWide = layout === 'wide'
  const alignStart = !centered || layout === 'compact'

  const copy = useCallback(async () => {
    if (onCopy) {
      onCopy()
      return
    }
    const ok = await copyNpmInstallCommand()
    if (ok) {
      setLocalCopied(true)
      window.setTimeout(() => setLocalCopied(false), 2000)
    }
  }, [onCopy])

  const npmLabel = isCopied ? 'Copied!' : getNpmInstallLabel()

  const npmBar = (
    <button
      type="button"
      onClick={() => void copy()}
      className={cn(
        'group flex w-full min-w-0 items-center gap-3 rounded-xl border border-neutral-300 bg-neutral-900 px-4 py-3 text-left font-mono text-[13px] text-neutral-100 shadow-sm transition hover:border-neutral-400 sm:text-[14px]',
        !isWide && !alignStart && 'max-w-md'
      )}
    >
      <span className="shrink-0 select-none text-neutral-500">$</span>
      <span className="min-w-0 flex-1 truncate">{NPM_INSTALL_COMMAND}</span>
      {isCopied ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-neutral-200" aria-hidden />
      )}
    </button>
  )

  const actions = (
    <div className={cn('flex flex-wrap items-center gap-3', alignStart ? 'justify-start' : 'justify-center')}>
      <ButtonColorful label={npmLabel} onClick={() => void copy()} className="h-10 shrink-0 px-5 text-[13px]" />
      <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-neutral-500">
        {SUPPORTED_PLATFORMS.map((p) => (
          <span key={p.id} className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )

  const notes = !compactNotes && (
    <div
      className={cn(
        'space-y-2 text-[12px] leading-relaxed text-neutral-500',
        alignStart ? 'text-left' : 'mx-auto max-w-md text-center'
      )}
    >
      <p>{getInstallHint()}</p>
      <p className="text-amber-800/90">{getFirstLaunchNote()}</p>
    </div>
  )

  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col gap-3',
        !alignStart && 'items-center text-center',
        className
      )}
    >
      {npmBar}
      {actions}
      {notes && <div className="border-t border-neutral-200/80 pt-3">{notes}</div>}
    </div>
  )
}
