import React from 'react'
import { ArrowLeft, GitBranch, Layers, Shield, Shrink, Workflow, Zap } from 'lucide-react'
import { GitHubIcon } from '../ui/GitHubIcon'
import { AuroraBackground } from '../ui/aurora-background'
import { Button } from '../ui/button'
import { InstallCTA } from './InstallCTA'
import { PrismBrand } from './PrismBrand'
import { GITHUB_REPO_URL } from '../../lib/app-shell'

interface FeaturesDetailPageProps {
  onBack: () => void
}

const sections = [
  {
    icon: Shrink,
    title: 'Token Compression Stack',
    summary: 'Three layers attack token waste before and during every model call.',
    bullets: [
      'RTK (Rust): scrubs terminal output, ledger writes, grep results, and session history',
      'Headroom (desktop): compresses LLM request payloads — JSON tool output, code, prose — up to 60–95%',
      'PRISM graph: AST + vector-ranked file snippets trimmed to your token budget',
      'Cloud engine v1: RTK + graph budgeting (Headroom optional on local/desktop engine)',
    ],
  },
  {
    icon: Layers,
    title: 'Context Layer',
    summary: 'Repository intelligence that survives session resets.',
    bullets: [
      'Injects vision.md, active tasks, and ledger continuity before every model call',
      'Builds a graph of files, dependencies, and patterns — not just the current file',
      'Works with any model: Claude, GPT, Gemini, Ollama, DeepSeek, and more',
    ],
  },
  {
    icon: GitBranch,
    title: 'Multi-Agent Pipelines',
    summary: 'Coordinate models without stepping on each other.',
    bullets: [
      'File locks prevent two agents from editing the same path simultaneously',
      'Full activity ledger — every task, handoff, and completion is recorded',
      '/catchup syncs a model with everything that changed since its last run',
    ],
  },
  {
    icon: Workflow,
    title: 'Native Desktop Workspace',
    summary: 'One app for every model you use.',
    bullets: [
      'Connect local folders; index and chat against real project structure',
      'Per-model chat tabs with persistent history per project',
      'Dark mode, multi-tab sessions, and a focused editor layout',
    ],
  },
  {
    icon: Zap,
    title: 'Cloud Engine',
    summary: 'Heavy lifting runs on Hugging Face — the shell stays open source.',
    bullets: [
      'Graph indexing, orchestration, and datalog live in the cloud engine',
      'Desktop app is a thin client — your UI is MIT-licensed on GitHub',
      'API access protected by client key; bring your own model API keys',
    ],
  },
  {
    icon: Shield,
    title: 'Trust & Distribution',
    summary: 'Install via npm or direct download on all platforms.',
    bullets: [
      'Windows builds signed via SignPath Foundation when CI is configured',
      'npm install or direct .exe / .dmg / .AppImage from GitHub Releases',
      'Check for updates built into the desktop app',
    ],
  },
]

export function FeaturesDetailPage({ onBack }: FeaturesDetailPageProps) {
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
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Features in depth
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-neutral-600">
          PRISM is an Agentic Development Environment — persistent repository intelligence for any coding model.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map(({ icon: Icon, title, summary, bullets }) => (
            <section key={title} className="rounded-2xl border border-neutral-200/80 bg-white/70 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                  <Icon className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
                  <p className="text-[14px] text-neutral-600">{summary}</p>
                </div>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-neutral-200/80 bg-white/70 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Get PRISM</h2>
          <InstallCTA className="mt-6" showAllPlatforms />
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="border-neutral-300" asChild>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <GitHubIcon className="h-4 w-4" />
              View source on GitHub
            </a>
          </Button>
        </div>
      </article>
    </AuroraBackground>
  )
}
