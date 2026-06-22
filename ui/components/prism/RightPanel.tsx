import React, { useState } from 'react'
import { Link2, MessageSquare, Plus, ScrollText } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ModelLogo } from '../ui/ModelLogo'
import { getCatalogEntry } from '../../lib/models'
import type { AgentSession, LedgerEntry } from '../../hooks/useWorkspaceState'
import { ConnectionsPanel } from './ConnectionsPanel'
import type { useConnections } from '../../hooks/useConnections'

type PanelTab = 'datalog' | 'sessions' | 'connections'

interface RightPanelProps {
  apiOnline: boolean
  ledgerEntries: LedgerEntry[]
  agentSessions: AgentSession[]
  activeAgentId: string | null
  activeSessionId: string | null
  onSelectSession: (sessionId: string) => void
  onNewChat: () => void
  connections: ReturnType<typeof useConnections>
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function RightPanel({
  apiOnline,
  ledgerEntries,
  agentSessions,
  activeAgentId,
  activeSessionId,
  onSelectSession,
  onNewChat,
  connections,
}: RightPanelProps) {
  const [tab, setTab] = useState<PanelTab>('sessions')

  const agentName = activeAgentId ? getCatalogEntry(activeAgentId)?.name || activeAgentId : null

  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-neutral-300/80 bg-[#f3f3f3] dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex h-12 items-center justify-between border-b border-neutral-300/80 px-3 dark:border-neutral-700">
        <div className="flex gap-1">
          <TabBtn active={tab === 'datalog'} onClick={() => setTab('datalog')} icon={<ScrollText className="h-3.5 w-3.5" />} label="Datalog" />
          <TabBtn active={tab === 'sessions'} onClick={() => setTab('sessions')} icon={<MessageSquare className="h-3.5 w-3.5" />} label="Sessions" />
          <TabBtn active={tab === 'connections'} onClick={() => setTab('connections')} icon={<Link2 className="h-3.5 w-3.5" />} label="Connections" />
        </div>
        <span className="flex items-center gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          <span className={cn('h-2 w-2 rounded-full', apiOnline ? 'bg-emerald-500' : 'bg-amber-500')} />
          {apiOnline ? 'Live' : 'Offline'}
        </span>
      </div>

      {tab === 'datalog' ? (
        <div className="flex-1 overflow-y-auto p-3">
          {ledgerEntries.length === 0 ? (
            <EmptyState
              online={apiOnline}
              text="Code changes (files created or edited by agents) will appear here."
            />
          ) : (
            <div className="space-y-2">
              {ledgerEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    'rounded-lg border bg-white px-3 py-2.5',
                    entry.outcome === 'error' || entry.outcome === 'failure'
                      ? 'border-red-200'
                      : 'border-neutral-200'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {entry.agentId && <ModelLogo provider={entry.agentId} size={14} />}
                      <span className="truncate text-[12px] font-medium text-neutral-800">{entry.agent}</span>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-neutral-400">{formatTime(entry.timestamp)}</span>
                  </div>
                  <div className="mt-1.5 text-[13px] font-medium leading-snug text-neutral-800">{entry.summary}</div>
                  {entry.filesModified && entry.filesModified.length > 0 && (
                    <div className="mt-1.5 text-[11px] text-blue-600">
                      {entry.filesModified.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tab === 'connections' ? (
        <ConnectionsPanel apiOnline={apiOnline} connections={connections} />
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-neutral-300/60 px-3 py-2">
            <div className="flex items-center gap-2 text-[12px] text-neutral-600">
              {activeAgentId && <ModelLogo provider={activeAgentId} size={16} />}
              <span>{agentName || 'Select a model'}</span>
            </div>
            <button
              type="button"
              onClick={onNewChat}
              disabled={!activeAgentId}
              className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
              New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {!activeAgentId ? (
              <EmptyState online={apiOnline} text="Select a model tab above to view its chat sessions." />
            ) : agentSessions.length === 0 ? (
              <EmptyState online={apiOnline} text="No sessions yet. Start a new chat or run /catchup." />
            ) : (
              <div className="space-y-1">
                {agentSessions.map((session) => (
                  <button
                    key={session.sessionId}
                    type="button"
                    onClick={() => onSelectSession(session.sessionId)}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2.5 text-left transition-colors',
                      activeSessionId === session.sessionId
                        ? 'border-violet-300 bg-violet-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {activeAgentId && <ModelLogo provider={activeAgentId} size={14} />}
                      <span className="truncate text-[13px] font-medium text-neutral-800">
                        {session.query || 'Untitled session'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{formatTime(session.timestamp)}</span>
                      <span className={cn(session.status === 'success' ? 'text-emerald-600' : 'text-neutral-400')}>
                        {session.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors',
        active ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function EmptyState({ online, text }: { online: boolean; text: string }) {
  return (
    <p className="px-2 py-10 text-center text-[13px] leading-relaxed text-neutral-400">
      {!online && 'Engine offline — '}
      {text}
    </p>
  )
}
