import React from 'react'
import { Lock, Shield } from 'lucide-react'
import { cn } from '../../lib/utils'
import AgentsHistoryView from '../AgentsHistoryView'

interface ActivityEntry {
  time: string
  title: string
  detail: string
  tone: 'good' | 'warn' | 'error'
}

interface FileLock {
  path: string
  agent: string
  since: string
}

interface AgentLedgerPanelProps {
  activity: ActivityEntry[]
  apiOnline: boolean
  showAgents: boolean
  onToggleAgents: () => void
  fileLocks?: FileLock[]
}

const DEFAULT_LOCKS: FileLock[] = [
  { path: 'adapters/gemini-cli-adapter.ts', agent: 'Gemini CLI', since: '14:02:11' },
]

export function AgentLedgerPanel({
  activity,
  apiOnline,
  showAgents,
  onToggleAgents,
  fileLocks = DEFAULT_LOCKS,
}: AgentLedgerPanelProps) {
  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-zinc-800/50 bg-obsidian-200/60 backdrop-blur-sm">
      <div className="flex h-10 items-center justify-between border-b border-zinc-800/50 px-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {showAgents ? 'Agent Registry' : 'Activity Log'}
          </span>
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              apiOnline ? 'bg-zinc-400' : 'bg-zinc-600'
            )}
          />
        </div>
        <button
          type="button"
          onClick={onToggleAgents}
          className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-zinc-400"
        >
          {showAgents ? 'Ledger' : 'Agents'}
        </button>
      </div>

      {showAgents ? (
        <div className="flex-1 overflow-auto">
          <AgentsHistoryView />
        </div>
      ) : (
        <>
          <section className="border-b border-zinc-800/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-zinc-600" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                File Locks
              </span>
            </div>
            <div className="space-y-1.5">
              {fileLocks.map((lock) => (
                <div
                  key={lock.path}
                  className="rounded-md border border-zinc-800/50 bg-obsidian-100/50 px-2.5 py-2"
                >
                  <div className="truncate font-mono text-[10px] text-zinc-400">{lock.path}</div>
                  <div className="mt-0.5 flex items-center justify-between text-[10px] text-zinc-600">
                    <span>{lock.agent}</span>
                    <span>{lock.since}</span>
                  </div>
                </div>
              ))}
              {fileLocks.length === 0 && (
                <p className="text-[11px] text-zinc-600">No active locks</p>
              )}
            </div>
          </section>

          <div className="relative flex-1 overflow-y-auto px-4 py-4">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-zinc-800/80" />
            <div className="space-y-4">
              {activity.map((item, i) => (
                <div key={`${item.time}-${i}`} className="relative flex gap-4 pl-0">
                  <div
                    className={cn(
                      'relative z-10 mt-1 h-2 w-2 shrink-0 rounded-full border-2 border-obsidian-200',
                      item.tone === 'good' && 'bg-zinc-500',
                      item.tone === 'warn' && 'bg-zinc-600',
                      item.tone === 'error' && 'bg-red-900 border-red-950'
                    )}
                  />
                  <div
                    className={cn(
                      'min-w-0 flex-1 rounded-md px-2 py-1.5',
                      item.tone === 'error' && 'border border-red-950/50 bg-red-950/20'
                    )}
                  >
                    <div className="font-mono text-[10px] text-zinc-600">{item.time}</div>
                    <div
                      className={cn(
                        'text-[12px] font-medium',
                        item.tone === 'error' ? 'text-red-400/90' : 'text-zinc-300'
                      )}
                    >
                      {item.title}
                    </div>
                    <div
                      className={cn(
                        'mt-0.5 text-[11px] italic',
                        item.tone === 'error' ? 'text-red-400/60' : 'text-zinc-600'
                      )}
                    >
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="border-t border-zinc-800/50 p-4">
            <div className="mb-3 flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-zinc-600" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                System Metrics
              </span>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex justify-between text-zinc-500">
                <span>CPU Load</span>
                <span className="text-zinc-400">24%</span>
              </div>
              <div className="h-0.5 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-1/4 bg-zinc-500" />
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Memory Hash</span>
                <span className="text-zinc-400">0x4F…E2</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Ledger Entries</span>
                <span className="text-zinc-400">{activity.length}</span>
              </div>
            </div>
          </section>
        </>
      )}
    </aside>
  )
}
