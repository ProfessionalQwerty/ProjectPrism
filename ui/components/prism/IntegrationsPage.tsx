import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { AuroraBackground } from '../ui/aurora-background'
import { Button } from '../ui/button'
import { PrismBrand } from './PrismBrand'

interface IntegrationsPageProps {
  onBack: () => void
  onTechnologies?: () => void
}

const INTEGRATIONS = [
  { name: 'Headroom', role: 'Desktop-sidecar LLM payload compression (JSON, code, prose) via POST /v1/compress — up to 60–95% fewer tokens on tool output. Reference: headroom-main.' },
  { name: 'RTK (Rust)', role: 'CLI-backed token scrubbing on ledger writes, terminal logs, and grep (`rtk log` / `rtk grep`). Reference: rtk-develop.' },
  { name: 'ripgrep', role: 'Blazing-fast codebase search for context compilation and file discovery.' },
  { name: 'node-pty', role: 'Real terminal sessions for preview, deploy scripts, and agent shell access.' },
  { name: 'LanceDB', role: 'Embedded vector store for semantic repo memory and retrieval.' },
  { name: 'FastEmbed', role: 'Local embedding generation without sending code to third-party APIs.' },
  { name: 'LangChain', role: 'Composable agent toolchains and structured LLM orchestration patterns.' },
  { name: 'Electron', role: 'Cross-platform desktop shell for Windows, macOS, and Linux.' },
  { name: 'better-sqlite3', role: 'Local execution ledger and project graph persistence.' },
]

export function IntegrationsPage({ onBack, onTechnologies }: IntegrationsPageProps) {
  return (
    <AuroraBackground>
      <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <PrismBrand size="nav" />
          <Button variant="ghost" onClick={onBack} className="gap-2 text-[14px]">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 pb-20">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Integrations</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          PRISM composes best-in-class open-source tools into one agentic environment. Each integration
          strengthens repository intelligence, safety, or deployment — without locking you to a single model vendor.
        </p>
        {onTechnologies && (
          <button
            type="button"
            onClick={onTechnologies}
            className="mt-4 text-[14px] font-medium text-violet-600 hover:text-violet-700"
          >
            See full open-source technology stack →
          </button>
        )}

        <ul className="mt-10 space-y-4">
          {INTEGRATIONS.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-neutral-200/80 bg-white/80 px-5 py-4 backdrop-blur-sm"
            >
              <div className="text-[16px] font-semibold text-neutral-900">{item.name}</div>
              <p className="mt-1 text-[14px] leading-relaxed text-neutral-600">{item.role}</p>
            </li>
          ))}
        </ul>
      </article>
    </AuroraBackground>
  )
}
