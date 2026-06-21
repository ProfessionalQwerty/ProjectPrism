import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface DaemonBannerProps {
  onRetry: () => void
}

export function DaemonBanner({ onRetry }: DaemonBannerProps) {
  return (
    <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1 space-y-2">
        <p>
          <span className="font-medium">Engine offline.</span> The UI needs the PRISM daemon on port{' '}
          <strong>19991</strong>. Keep that terminal open — closing it stops the engine.
        </p>
        <p className="text-[12px] text-amber-800">
          <span className="font-medium">Terminal 1</span> (daemon — leave running):
        </p>
        <code className="block rounded bg-amber-100/80 px-2 py-1.5 font-mono text-[11px] leading-relaxed">
          cd ruby-pass3
          <br />
          npm run start
        </code>
        <p className="text-[12px] text-amber-800">
          <span className="font-medium">Terminal 2</span> (UI):
        </p>
        <code className="block rounded bg-amber-100/80 px-2 py-1.5 font-mono text-[11px]">
          cd ruby-pass3/ui
          <br />
          npm run dev
        </code>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex shrink-0 items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-[12px] font-medium hover:bg-amber-100"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  )
}
