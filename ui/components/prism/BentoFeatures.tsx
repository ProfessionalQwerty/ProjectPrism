import React from 'react'
import { GitBranch, Layers, MessageSquare, Shield, Zap, Workflow } from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    title: 'Context Persistence',
    description: 'Cross-session memory that survives model switches and compounds over time.',
  },
  {
    icon: GitBranch,
    title: 'Cross-Model Pipelines',
    description: 'Orchestration with file locks and ledger audit trails across any provider.',
  },
  {
    icon: Shield,
    title: 'File Lock Engine',
    description: 'Coordinated multi-agent file access with real-time conflict detection.',
  },
  {
    icon: Zap,
    title: 'RTK History Scrubbing',
    description: 'Automatic token budget management. 30–50% fewer tokens per request.',
  },
  {
    icon: MessageSquare,
    title: 'Session History',
    description: 'Per-model chat sessions with full datalog — pick up exactly where you left off.',
  },
  {
    icon: Workflow,
    title: '/catchup Command',
    description: 'One command syncs a model with graph index and datalog since its last session.',
  },
]

export function BentoFeatures() {
  return (
    <section id="capabilities" className="border-t border-neutral-200/80 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
            Engine Capabilities
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Built for agentic development
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-200/40 via-fuchsia-200/30 to-amber-200/20 blur-2xl opacity-60 group-hover:opacity-100" />
              <div className="relative flex flex-1 flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                  <feature.icon className="h-5 w-5 text-neutral-600" />
                </div>
                <h3 className="mb-2 text-[16px] font-semibold text-neutral-900">{feature.title}</h3>
                <p className="text-[14px] leading-relaxed text-neutral-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
