import React, { useEffect, useState } from 'react'
import { getCatalogEntry } from '../../lib/models'

const STEPS = [
  'Reading your message…',
  'Reviewing project vision and memory…',
  'Scanning relevant files in the repo…',
  'Building context for the model…',
  'Thinking…',
]

interface AgentThinkingProps {
  agentId: string | null
}

export function AgentThinking({ agentId }: AgentThinkingProps) {
  const [step, setStep] = useState(0)
  const name = agentId ? getCatalogEntry(agentId)?.name || agentId : 'Agent'

  useEffect(() => {
    setStep(0)
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % STEPS.length)
    }, 2400)
    return () => window.clearInterval(timer)
  }, [agentId])

  return (
    <div className="space-y-1">
      <p className="text-[15px] leading-relaxed text-neutral-700">{STEPS[step]}</p>
      <p className="text-[12px] text-neutral-400">{name} is working on your request</p>
    </div>
  )
}
