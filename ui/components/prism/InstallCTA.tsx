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
}

export function InstallCTA({
  className = '',
  showAllPlatforms = false,
  copied,
  onCopy,
  centered = true,
}: InstallCTAProps) {
  const [localCopied, setLocalCopied] = useState(false)
  const isCopied = copied ?? localCopied

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

  return (
    <div className={cn(centered && 'flex flex-col items-center text-center', className)}>
      <button
        type="button"
        onClick={() => void copy()}
        className="group flex w-full max-w-md items-center gap-3 rounded-xl border border-neutral-300 bg-neutral-900 px-4 py-3 text-left font-mono text-[14px] text-neutral-100 shadow-sm transition hover:border-neutral-400"
      >
        <span className="min-w-0 flex-1 truncate">{NPM_INSTALL_COMMAND}</span>
        {isCopied ? (
          <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
        ) : (
          <Copy className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-neutral-200" aria-hidden />
        )}
      </button>

      <div
        className={cn(
          'mt-4 flex gap-2',
          showAllPlatforms
            ? 'w-full max-w-xl flex-nowrap items-stretch justify-center'
            : 'max-w-md flex-wrap justify-center'
        )}
      >
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
              className="min-w-0 flex-1 shrink-0 whitespace-nowrap px-3"
              onClick={() => void downloadInstaller(p.filename)}
            >
              <Download className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              {p.label}
            </Button>
          ))
        )}
      </div>

      <p className={cn('mt-3 max-w-md text-[13px] leading-relaxed text-neutral-500', centered && 'mx-auto')}>
        {getInstallHint()}
      </p>
      {(showAllPlatforms || primary.id === 'windows') && (
        <p className={cn('mt-2 max-w-md text-[12px] leading-relaxed text-amber-800/90', centered && 'mx-auto')}>
          {getWindowsInstallWarning()}
        </p>
      )}
      <p className={cn('mt-2 max-w-md text-[12px] leading-relaxed text-neutral-400', centered && 'mx-auto')}>
        Windows installers are code-signed through the{' '}
        <a href="https://signpath.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          SignPath Foundation
        </a>{' '}
        when configured in CI.
      </p>
    </div>
  )
}
