import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { setTelemetryOptIn } from '../../lib/telemetry-consent'
import { setTelemetryOptInRemote } from '../../lib/team-api'

interface TokenCapModalProps {
  open: boolean
  message: string
  onClose: () => void
  onOptIn?: () => void
}

export function TokenCapModal({ open, message, onClose, onOptIn }: TokenCapModalProps) {
  if (!open) return null

  const enableTelemetry = async () => {
    setTelemetryOptIn(true)
    try {
      await setTelemetryOptInRemote(true)
    } catch {
      // local opt-in still applies
    }
    onOptIn?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-labelledby="token-cap-title"
        className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-950">
            <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <h2 id="token-cap-title" className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Token cap reached
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {message ||
                "You've used your 100,000 free offline tokens for this hour. To unlock unlimited compute context right now, simply flip on the PRISM Intelligence Engine toggle in settings to contribute anonymized telemetry!"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[14px] dark:border-neutral-600"
          >
            Later
          </button>
          <button
            type="button"
            onClick={() => void enableTelemetry()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-violet-500"
          >
            Enable PRISM Intelligence Engine
          </button>
        </div>
      </div>
    </div>
  )
}
