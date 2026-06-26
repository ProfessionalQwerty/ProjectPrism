import React from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { AuroraBackground } from '../ui/aurora-background'
import { Button } from '../ui/button'
import { PrismBrand } from './PrismBrand'
import { InstallCTA } from './InstallCTA'

interface PricingPageProps {
  onBack: () => void
}

export function PricingPage({ onBack }: PricingPageProps) {
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

      <article className="mx-auto max-w-3xl px-6 py-12 pb-20 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
          <Sparkles className="h-7 w-7 text-violet-600" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">PRISM is free</h1>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-neutral-600">
          Every feature — multi-model chat, repository memory, deploy pipelines, team workspaces — ships in the
          full version at no cost. Connect your own Claude, ChatGPT, or API accounts; PRISM does not resell AI credits.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-500">
          Our moat is data: with your explicit opt-in, anonymized engineering telemetry helps train better autonomous
          coding models. Your source code never leaves your machine unless you choose to sync.
        </p>

        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-violet-200 bg-white/90 p-8 shadow-sm">
          <div className="text-[13px] font-semibold uppercase tracking-wider text-violet-600">Full version</div>
          <div className="mt-2 text-4xl font-bold text-neutral-900">$0</div>
          <p className="mt-2 text-[14px] text-neutral-500">Forever — no subscription to PRISM</p>
          <ul className="mt-6 space-y-2 text-left text-[14px] text-neutral-700">
            <li>• Unlimited projects and sessions</li>
            <li>• OAuth for ChatGPT & Claude subscriptions</li>
            <li>• GitHub + Vercel deploy with self-healing retries</li>
            <li>• Optional PRISM Intelligence Engine telemetry (opt-in)</li>
          </ul>
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <p className="mb-3 text-[13px] font-medium text-neutral-700">
            Install — open <strong>cmd</strong> (Windows) or Terminal, then run:
          </p>
          <InstallCTA layout="compact" centered />
        </div>
      </article>
    </AuroraBackground>
  )
}
