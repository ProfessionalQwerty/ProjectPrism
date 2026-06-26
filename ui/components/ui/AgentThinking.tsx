import React from 'react'
import { cn } from '../../lib/utils'
import { getCatalogEntry } from '../../lib/models'
import type { ThinkingStage } from '../../lib/chat-types'

interface AgentThinkingProps {
  agentId: string | null
  stages?: ThinkingStage[]
}

export function AgentThinking({ agentId, stages }: AgentThinkingProps) {
  const name = agentId ? getCatalogEntry(agentId)?.name || agentId : 'Agent'
  const displayStages = stages?.length ? stages : null
  const active = displayStages
    ? [...displayStages].reverse().find((s) => s.status === 'active')
    : null
  const headline = active?.label || (displayStages ? displayStages[displayStages.length - 1]?.label : 'Thinking…')

  if (!displayStages) {
    return (
      <div className="space-y-1">
        <p className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200">{headline}</p>
        <p className="text-[12px] text-neutral-400">{name} is working on your request</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200">{headline}</p>
      <ol className="space-y-1.5">
        {displayStages.map((stage) => (
          <li
            key={stage.phase}
            className={cn(
              'flex items-center gap-2 text-[13px]',
              stage.status === 'done' && 'text-emerald-600 dark:text-emerald-400',
              stage.status === 'active' && 'text-violet-600 dark:text-violet-400',
              stage.status === 'error' && 'text-red-600 dark:text-red-400',
              stage.status === 'pending' && 'text-neutral-400'
            )}
          >
            <span
              className={cn(
                'inline-block h-1.5 w-1.5 shrink-0 rounded-full',
                stage.status === 'done' && 'bg-emerald-500',
                stage.status === 'active' && 'animate-pulse bg-violet-500',
                stage.status === 'error' && 'bg-red-500',
                stage.status === 'pending' && 'bg-neutral-300'
              )}
            />
            <span>{stage.label}</span>
          </li>
        ))}
      </ol>
      <p className="text-[12px] text-neutral-400">{name} is working through think → plan → act</p>
    </div>
  )
}
