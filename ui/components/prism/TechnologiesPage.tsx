import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { AuroraBackground } from '../ui/aurora-background'
import { Button } from '../ui/button'
import { PrismBrand } from './PrismBrand'

interface TechnologiesPageProps {
  onBack: () => void
  onIntegrations?: () => void
}

type TechEntry = {
  name: string
  role: string
  upstream?: string
  license?: string
}

type TechSection = {
  title: string
  description: string
  items: TechEntry[]
}

const SECTIONS: TechSection[] = [
  {
    title: 'Token compression',
    description: 'Three layers keep models focused on code — not noise, duplicates, or bloated tool output.',
    items: [
      {
        name: 'RTK (Rust Token Killer)',
        role: 'Scrubs terminal output, ledger writes, grep results, and session history before they enter PRISM memory.',
        upstream: 'https://github.com/rtk-ai/rtk',
        license: 'Open source',
      },
      {
        name: 'Headroom',
        role: 'Compresses LLM request payloads on desktop — JSON tool results, code blocks, and conversation history via SmartCrusher, AST-aware code compression, and Kompress ONNX (60–95% savings on large contexts).',
        upstream: 'https://github.com/chopratejas/headroom',
        license: 'Apache-2.0',
      },
      {
        name: 'PRISM graph budgeting',
        role: 'AST dependency graph + semantic vector search rank files, then trim snippets to your token budget before every model call.',
      },
    ],
  },
  {
    title: 'Context & memory',
    description: 'Persistent repository intelligence that survives model switches.',
    items: [
      { name: 'AST graph compiler', role: 'tree-sitter + PageRank file selection for context packets.' },
      { name: 'LanceDB', role: 'Embedded vector store for semantic repo memory.', upstream: 'https://lancedb.com/' },
      { name: 'FastEmbed / Transformers.js', role: 'Local embeddings without sending code to third-party APIs.' },
      { name: 'Execution ledger', role: 'Append-only SQLite datalog of every agent action, file change, and decision.' },
    ],
  },
  {
    title: 'Agent orchestration',
    description: 'Multi-model pipelines with safety and handoffs.',
    items: [
      {
        name: 'LangChain-style tools',
        role: 'Composable toolchains for multi-step agent runs inside the PRISM orchestrator.',
        upstream: 'https://github.com/langchain-ai/langchain',
        license: 'MIT',
      },
      { name: 'File-lock coordination', role: 'Prevents concurrent agents from editing the same path.' },
      { name: '/catchup sync', role: 'Brings a model up to speed on ledger changes since its last run.' },
    ],
  },
  {
    title: 'Search & indexing',
    description: 'Fast discovery across large repos.',
    items: [
      { name: 'ripgrep', role: 'Primary codebase search for context compilation and API search.', upstream: 'https://github.com/BurntSushi/ripgrep' },
      { name: 'RTK grep', role: 'Compressed ripgrep output when the RTK binary is available.' },
      { name: 'tree-sitter', role: 'AST parsing for dependency graphs and symbol-aware context.', upstream: 'https://tree-sitter.github.io/' },
    ],
  },
  {
    title: 'Desktop & terminal',
    description: 'Native shell for local development.',
    items: [
      { name: 'Electron', role: 'Cross-platform desktop app for Windows, macOS, and Linux.', upstream: 'https://www.electronjs.org/' },
      { name: 'node-pty + xterm', role: 'Real terminal sessions with ANSI-stripped, batched ledger logging.' },
    ],
  },
  {
    title: 'Persistence & teams',
    description: 'Local-first with optional cloud sync.',
    items: [
      { name: 'better-sqlite3', role: 'Local project graph, ledger, and agent session storage.' },
      { name: 'Supabase', role: 'GitHub OAuth, team orgs, collaboration sessions, and realtime sync rows.', upstream: 'https://supabase.com/' },
    ],
  },
  {
    title: 'Reference & inspiration',
    description: 'Open-source projects studied and composed into PRISM — not vendored wholesale.',
    items: [
      { name: 'Aider', role: 'Pair-programming agent patterns.', upstream: 'https://github.com/Aider-AI/aider' },
      { name: 'Pi', role: 'Multi-provider agent harness design.', upstream: 'https://github.com/badlogic/pi-mono' },
    ],
  },
]

export function TechnologiesPage({ onBack, onIntegrations }: TechnologiesPageProps) {
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
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Technologies</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          PRISM composes best-in-class open-source tools into one agentic environment. We source ideas and
          integrations from the repos in our reference tree — RTK and Headroom power the compression stack;
          LangChain patterns inform orchestration; ripgrep and tree-sitter drive indexing.
        </p>
        {onIntegrations && (
          <button
            type="button"
            onClick={onIntegrations}
            className="mt-4 text-[14px] font-medium text-violet-600 hover:text-violet-700"
          >
            See runtime integrations →
          </button>
        )}

        <div className="mt-12 space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-neutral-900">{section.title}</h2>
              <p className="mt-1 text-[14px] text-neutral-600">{section.description}</p>
              <ul className="mt-5 space-y-4">
                {section.items.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-xl border border-neutral-200/80 bg-white/80 px-5 py-4 backdrop-blur-sm"
                  >
                    <div className="flex flex-wrap items-baseline gap-2">
                      {item.upstream ? (
                        <a
                          href={item.upstream}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[16px] font-semibold text-violet-700 hover:underline"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <span className="text-[16px] font-semibold text-neutral-900">{item.name}</span>
                      )}
                      {item.license && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                          {item.license}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-600">{item.role}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </AuroraBackground>
  )
}
