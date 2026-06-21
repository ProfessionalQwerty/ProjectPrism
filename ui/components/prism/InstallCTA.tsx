import React, { useCallback, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { ButtonColorful } from '../ui/button-colorful'
import { cn } from '../../lib/utils'
import {
  ALL_PLATFORM_DOWNLOADS,
  NPM_INSTALL_COMMAND,
  copyNpmInstallCommand,
  detectPlatformAsset,
  downloadInstaller,
  getDownloadButtonLabel,
  getInstallHint,
  getNpmInstallLabel,
  getWindowsInstallWarning,
} from '../../lib/downloads'

interface InstallCTAProps {
  className?: string
  showAllPlatforms?: boolean
  copied?: boolean
  onCopy?: () => void
  centered?: boolean
  layout?: 'stacked' | 'horizontal'
  /** Hide fine-print notes (e.g. when parent shows them elsewhere) */
  compactNotes?: boolean
}

export function InstallCTA({
  className = '',
  showAllPlatforms = false,
  copied,
  onCopy,
  centered = true,
  layout = 'stacked',
  compactNotes = false,
}: InstallCTAProps) {
  const [localCopied, setLocalCopied] = useState(false)
  const isCopied = copied ?? localCopied
  const horizontal = layout === 'horizontal'

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
  const primary = detectPlatformAsset()

  const npmBar = (
    <button
      type="button"
      onClick={() => void copy()}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl border border-neutral-300 bg-neutral-900 px-4 py-3 text-left font-mono text-[13px] text-neutral-100 shadow-sm transition hover:border-neutral-400 sm:text-[14px]',
        horizontal ? 'min-w-0 flex-1' : 'max-w-md'
      )}
    >
      <span className="min-w-0 flex-1 truncate">{NPM_INSTALL_COMMAND}</span>
      {isCopied ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-neutral-200" aria-hidden />
      )}
    </button>
  )

  const actionButtons = (
    <>
      <ButtonColorful label={npmLabel} onClick={() => void copy()} className="shrink-0" />
      {!showAllPlatforms ? (
        <Button variant="landingOutline" size="lg" onClick={() => void downloadInstaller()} className="shrink-0">
          <Download className="mr-2 h-4 w-4" />
          {getDownloadButtonLabel()}
        </Button>
      ) : (
        ALL_PLATFORM_DOWNLOADS.map((p) => (
          <Button
            key={p.id}
            variant="landingOutline"
            size="sm"
            className="shrink-0 whitespace-nowrap px-3"
            onClick={() => void downloadInstaller(p.filename)}
          >
            <Download className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            {p.label}
          </Button>
        ))
      )}
    </>
  )

  const notes = !compactNotes && (
    <div
      className={cn(
        'text-[12px] leading-relaxed text-neutral-500',
        horizontal
          ? 'mt-4 grid gap-3 border-t border-neutral-200/80 pt-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4'
          : 'mt-3 max-w-md space-y-2',
        centered && !horizontal && 'mx-auto text-center'
      )}
    >
      <p className={horizontal ? 'text-left' : undefined}>{getInstallHint()}</p>
      {(showAllPlatforms || primary.id === 'windows') && (
        <p className={cn('text-amber-800/90', horizontal && 'text-left')}>{getWindowsInstallWarning()}</p>
      )}
      <p className={cn('text-neutral-400', horizontal && 'text-left sm:col-span-2 lg:col-span-1')}>
        Windows installers are code-signed through the{' '}
        <a href="https://signpath.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          SignPath Foundation
        </a>{' '}
        when configured in CI.
      </p>
    </div>
  )

  if (horizontal) {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {npmBar}
          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:justify-end">{actionButtons}</div>
        </div>
        {notes}
      </div>
    )
  }

  return (
    <div className={cn(centered && 'flex flex-col items-center text-center', className)}>
      {npmBar}
      <div
        className={cn(
          'mt-4 flex gap-2',
          showAllPlatforms
            ? 'w-full max-w-xl flex-nowrap items-stretch justify-center'
            : 'max-w-md flex-wrap justify-center'
        )}
      >
        {actionButtons}
      </div>
      {notes}
    </div>
  )
}
