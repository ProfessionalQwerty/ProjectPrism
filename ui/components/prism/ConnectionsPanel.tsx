import React, { useState } from 'react'
import {
  Cloud,
  Globe,
  Link2,
  Play,
  Rocket,
  Square,
  Unplug,
} from 'lucide-react'
import { GitHubIcon } from '../ui/GitHubIcon'
import { cn } from '../../lib/utils'
import type { useConnections } from '../../hooks/useConnections'

type ConnectionsApi = ReturnType<typeof useConnections>

interface ConnectionsPanelProps {
  apiOnline: boolean
  connections: ConnectionsApi
}

export function ConnectionsPanel({ apiOnline, connections }: ConnectionsPanelProps) {
  const [vercelToken, setVercelToken] = useState('')
  const { connections: state, gitStatus, preview, deployLog, busy, error } = connections

  if (!apiOnline) {
    return (
      <EmptyBlock text="Connect to the PRISM engine to manage GitHub, Vercel, and deployments." />
    )
  }

  if (!state) {
    return <EmptyBlock text="Loading connections…" />
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <section className="space-y-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Connections
        </h3>
        <ConnectionCard
          icon={<Cloud className="h-4 w-4" />}
          title="PRISM Cloud Engine"
          subtitle={state.engine.account || 'Hosted intelligence'}
          connected
        />
        <ConnectionCard
          icon={<GitHubIcon className="h-4 w-4" />}
          title="GitHub"
          subtitle={state.github.account || 'Push code without the terminal'}
          connected={state.github.connected}
          action={
            state.github.connected ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void connections.disconnect('github')}
                className={actionBtnClass}
              >
                <Unplug className="h-3 w-3" />
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void connections.connectGitHub()}
                className={actionBtnClass}
              >
                <Link2 className="h-3 w-3" />
                Connect
              </button>
            )
          }
        />
        <ConnectionCard
          icon={<Globe className="h-4 w-4" />}
          title="Vercel"
          subtitle={state.vercel.account || 'Deploy and get a live URL'}
          connected={state.vercel.connected}
          action={
            state.vercel.connected ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void connections.disconnect('vercel')}
                className={actionBtnClass}
              >
                <Unplug className="h-3 w-3" />
                Disconnect
              </button>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <input
                  type="password"
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  placeholder="Vercel token (vercel.com/account/tokens)"
                  className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-[12px] dark:border-neutral-600 dark:bg-neutral-800"
                />
                <button
                  type="button"
                  disabled={busy || !vercelToken.trim()}
                  onClick={() => void connections.connectVercel(vercelToken.trim())}
                  className={actionBtnClass}
                >
                  <Link2 className="h-3 w-3" />
                  Connect Vercel
                </button>
              </div>
            )
          }
        />
      </section>

      <section className="space-y-2 rounded-lg border border-neutral-300/80 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Local preview
        </h3>
        <p className="text-[12px] text-neutral-600 dark:text-neutral-400">
          Runs your dev server inside PRISM and opens a browser preview — no terminal needed.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void connections.startPreview()}
            className={actionBtnClass}
          >
            <Play className="h-3 w-3" />
            Start preview
          </button>
          {preview?.running ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void connections.stopPreview()}
              className={actionBtnClass}
            >
              <Square className="h-3 w-3" />
              Stop
            </button>
          ) : null}
        </div>
        {preview ? (
          <div className="rounded-md bg-neutral-100 p-2 font-mono text-[11px] dark:bg-neutral-900">
            <div>{preview.command}</div>
            <div className="text-emerald-600">{preview.url}</div>
            {preview.logs.slice(-6).map((line) => (
              <div key={line} className="truncate text-neutral-500">
                {line}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-2 rounded-lg border border-neutral-300/80 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Deploy
        </h3>
        {gitStatus ? (
          <p className="text-[12px] text-neutral-600 dark:text-neutral-400">
            {gitStatus.hasRepo ? (
              <>
                Branch <code className="font-mono">{gitStatus.branch || 'main'}</code>
                {gitStatus.changed.length + gitStatus.untracked.length > 0
                  ? ` · ${gitStatus.changed.length + gitStatus.untracked.length} changed file(s)`
                  : ' · clean'}
              </>
            ) : (
              'Git will be initialized on first deploy.'
            )}
          </p>
        ) : null}
        <button
          type="button"
          disabled={
            busy || !state.github.connected || !state.vercel.connected
          }
          onClick={() => void connections.deploy()}
          className={cn(
            actionBtnClass,
            'w-full justify-center bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900'
          )}
        >
          <Rocket className="h-3.5 w-3.5" />
          Deploy to Vercel
        </button>
        {deployLog ? (
          <p className="text-[12px] text-neutral-600 dark:text-neutral-400">{deployLog}</p>
        ) : null}
      </section>
    </div>
  )
}

const actionBtnClass =
  'inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[12px] font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700'

function ConnectionCard({
  icon,
  title,
  subtitle,
  connected,
  action,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  connected: boolean
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-neutral-300/80 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2">
          <div className="mt-0.5 text-neutral-500">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium">{title}</span>
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  connected ? 'bg-emerald-500' : 'bg-amber-400'
                )}
              />
            </div>
            <p className="text-[12px] text-neutral-500">{subtitle}</p>
          </div>
        </div>
      </div>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center text-[13px] text-neutral-500">
      {text}
    </div>
  )
}
