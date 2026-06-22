import React from 'react'
import { ArrowUp, Bot, Paperclip, User, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { PrismGlyph } from './PrismGlyph'

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  detail?: string
}

interface CanvasPanelProps {
  vision: string
  messages: ChatMessage[]
  prompt: string
  isRunning: boolean
  onPromptChange: (value: string) => void
  onSubmit: () => void
  onEditVision: () => void
  onQuickCommand: (cmd: string) => void
}

const SAMPLE_CODE = `interface MemoryNode {
  id: string;
  vector: number[];
  metadata: Record<string, unknown>;
}

export class CrossAgentIndex {
  async broadcast(node: MemoryNode): Promise<void> {
    // Sync through ranked graph and action ledger.
  }
}`

export function CanvasPanel({
  vision,
  messages,
  prompt,
  isRunning,
  onPromptChange,
  onSubmit,
  onEditVision,
  onQuickCommand,
}: CanvasPanelProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-obsidian">
      <section className="mx-4 mt-4 flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-obsidian-200/40 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-700/50 bg-zinc-900/50">
          <PrismGlyph className="h-4 w-4 opacity-80" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Core Product Vision
          </div>
          <p className="truncate text-[13px] font-medium text-zinc-300">{vision}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEditVision} className="shrink-0 text-xs">
          Edit Vision
        </Button>
      </section>

      <section className="flex-1 overflow-y-auto px-6 py-8">
        {messages.map((message) =>
          message.role === 'agent' ? (
            <div key={message.id} className="mb-6 flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-700/50 bg-zinc-900/60">
                <Bot className="h-4 w-4 text-zinc-500" />
              </div>
              <div className="max-w-2xl">
                <p className="text-[14px] leading-relaxed text-zinc-300">{message.content}</p>
                {message.detail && message.detail !== 'pending' && (
                  <p className="mt-2 font-mono text-[11px] text-zinc-600">{message.detail}</p>
                )}
                {message.detail === 'pending' && (
                  <span className="mt-2 inline-flex gap-1 text-zinc-500">
                    <span className="animate-pulse-subtle">·</span>
                    <span className="animate-pulse-subtle" style={{ animationDelay: '0.2s' }}>·</span>
                    <span className="animate-pulse-subtle" style={{ animationDelay: '0.4s' }}>·</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div key={message.id} className="mb-6 flex justify-end gap-3">
              <div className="max-w-lg rounded-md border border-zinc-800/50 bg-zinc-900/40 px-4 py-3 text-[14px] text-zinc-300">
                {message.content}
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-800/50 bg-zinc-900/30">
                <User className="h-4 w-4 text-zinc-600" />
              </div>
            </div>
          )
        )}

        <div className="ml-12 max-w-2xl overflow-hidden rounded-lg border border-zinc-800/50 bg-obsidian-100">
          <div className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-2">
            <span className="font-mono text-[12px] text-zinc-500">indexing_protocol.ts</span>
            <button type="button" className="text-zinc-600 hover:text-zinc-400">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
            <code>
              <span className="text-zinc-500">interface </span>
              <span className="text-zinc-300">MemoryNode</span>
              <span className="text-zinc-600"> {'{'}{'\n'}</span>
              <span className="text-zinc-500">  id</span>
              <span className="text-zinc-600">: </span>
              <span className="text-zinc-400">string</span>
              <span className="text-zinc-600">;{'\n'}</span>
              <span className="text-zinc-500">  vector</span>
              <span className="text-zinc-600">: </span>
              <span className="text-zinc-400">number[]</span>
              <span className="text-zinc-600">;{'\n'}</span>
              <span className="text-zinc-500">  metadata</span>
              <span className="text-zinc-600">: </span>
              <span className="text-zinc-400">Record</span>
              <span className="text-zinc-600">&lt;</span>
              <span className="text-zinc-400">string, unknown</span>
              <span className="text-zinc-600">&gt;;{'\n'}</span>
              <span className="text-zinc-600">{'}'}{'\n\n'}</span>
              <span className="text-zinc-500">export class </span>
              <span className="text-zinc-300">CrossAgentIndex</span>
              <span className="text-zinc-600"> {'{'}{'\n'}</span>
              <span className="text-zinc-500">  async </span>
              <span className="text-zinc-300">broadcast</span>
              <span className="text-zinc-600">(node: MemoryNode): Promise&lt;void&gt; {'{'}{'\n'}</span>
              <span className="text-zinc-600">    </span>
              <span className="text-zinc-700">// Sync through ranked graph and action ledger.</span>
              {'\n'}
              <span className="text-zinc-600">  {'}'}{'\n'}</span>
              <span className="text-zinc-600">{'}'}</span>
            </code>
          </pre>
        </div>
      </section>

      <section className="border-t border-zinc-800/50 px-6 py-4">
        <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-obsidian-200/30 px-4 py-2 backdrop-blur-sm">
          <button type="button" className="text-zinc-600 hover:text-zinc-400">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            type="text"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isRunning) onSubmit()
            }}
            placeholder="Type a command or ask a technical question..."
            className="min-w-0 flex-1 bg-transparent text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isRunning || !prompt.trim()}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
              prompt.trim()
                ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-100'
                : 'bg-zinc-800/50 text-zinc-600'
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          <span>Quick Commands:</span>
          {['/index', '/refactor', '/summarize'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => onQuickCommand(cmd)}
              className="rounded border border-zinc-800/50 px-2 py-0.5 text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-400"
            >
              {cmd}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export { SAMPLE_CODE }
