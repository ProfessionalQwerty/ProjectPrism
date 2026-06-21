import React from 'react'
import {
  BookOpen,
  ChevronRight,
  FileCode2,
  FolderTree,
  GitBranch,
  HelpCircle,
  Network,
  Plus,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

interface LeftRailProps {
  projectName: string
  statusMessage: string
  activeTaskTitle?: string | null
  nodeCount: number
  provider: string
}

const FILE_TREE = [
  { name: 'src', type: 'folder' as const, children: [
    { name: 'core', type: 'folder' as const, children: [
      { name: 'indexing_protocol.ts', type: 'file' as const, active: true },
      { name: 'context_fusion.ts', type: 'file' as const },
    ]},
    { name: 'adapters', type: 'folder' as const, children: [
      { name: 'gemini-cli-adapter.ts', type: 'file' as const, locked: true },
    ]},
  ]},
  { name: 'config', type: 'folder' as const, children: [
    { name: 'orchestration.json', type: 'file' as const },
  ]},
]

export function LeftRail({
  projectName,
  statusMessage,
  activeTaskTitle,
  nodeCount,
  provider,
}: LeftRailProps) {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-zinc-800/50 bg-obsidian-200/60 backdrop-blur-sm">
      <section className="border-b border-zinc-800/50 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse-subtle" />
          <span className="text-sm font-semibold text-zinc-200">{projectName}</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{statusMessage}</p>
        {activeTaskTitle && (
          <p className="mt-1 text-[11px] text-zinc-600">
            Active: <span className="text-zinc-400">{activeTaskTitle}</span>
          </p>
        )}
      </section>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-3">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md border-l-2 border-zinc-400 bg-zinc-800/30 px-3 py-2 text-left text-[13px] font-medium text-zinc-200"
          >
            <FolderTree className="h-3.5 w-3.5 text-zinc-500" />
            Explorer
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            File Tree
          </div>
          <div className="space-y-0.5 font-mono text-[11px]">
            {FILE_TREE.map((item) => (
              <TreeNode key={item.name} node={item} depth={0} />
            ))}
          </div>
        </div>

        <section className="border-t border-zinc-800/50 px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Live Graph Index
            </span>
            <Network className="h-3 w-3 text-zinc-600" />
          </div>
          <div className="relative h-28 overflow-hidden rounded-md border border-zinc-800/50 bg-obsidian">
            <svg viewBox="0 0 240 128" className="h-full w-full">
              <line x1="48" y1="38" x2="118" y2="82" stroke="#52525b" strokeDasharray="3 4" strokeWidth="1" />
              <line x1="118" y1="82" x2="196" y2="24" stroke="#52525b" strokeDasharray="3 4" strokeWidth="1" />
              <line x1="48" y1="38" x2="196" y2="24" stroke="#3f3f46" strokeDasharray="2 6" strokeWidth="0.5" />
              <circle cx="48" cy="38" r="3" fill="#71717a" />
              <circle cx="118" cy="82" r="4" fill="#a1a1aa" />
              <circle cx="196" cy="24" r="3" fill="#71717a" />
            </svg>
            <span className="absolute bottom-2 right-2 font-mono text-[10px] text-zinc-500">
              Nodes: {nodeCount.toLocaleString()}
            </span>
          </div>
        </section>

        <section className="border-t border-zinc-800/50 px-4 py-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Memory Explorer
          </div>
          <div className="space-y-1">
            <RailItem icon={<GitBranch className="h-3 w-3" />} label={`Context: ${provider}`} />
            <RailItem icon={<Network className="h-3 w-3" />} label="Cross-Agent Index" />
            <RailItem icon={<FileCode2 className="h-3 w-3" />} label="Models" />
            <RailItem icon={<BookOpen className="h-3 w-3" />} label="Logs" />
          </div>
        </section>

        <section className="border-t border-zinc-800/50 px-4 py-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Active Pipelines
          </div>
          <div className="space-y-2">
            <PipelineItem name="index → compile → route" status="running" step={2} total={3} />
            <PipelineItem name="lock → edit → release" status="idle" step={0} total={3} />
          </div>
        </section>
      </nav>

      <div className="border-t border-zinc-800/50 p-3">
        <Button
          variant="outline"
          size="sm"
          className="mb-3 w-full border-zinc-700/60 text-zinc-300 hover:bg-zinc-800/50"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Agent
        </Button>
        <div className="flex gap-4 px-1">
          <button type="button" className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400">
            <BookOpen className="h-3 w-3" /> Docs
          </button>
          <button type="button" className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400">
            <HelpCircle className="h-3 w-3" /> Help
          </button>
        </div>
      </div>
    </aside>
  )
}

interface TreeNodeData {
  name: string
  type: 'folder' | 'file'
  active?: boolean
  locked?: boolean
  children?: TreeNodeData[]
}

function TreeNode({ node, depth }: { node: TreeNodeData; depth: number }) {
  const [open, setOpen] = React.useState(depth < 2)

  if (node.type === 'file') {
    return (
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left transition-colors',
          node.active ? 'bg-zinc-800/50 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400',
          node.locked && 'opacity-60'
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <FileCode2 className="h-3 w-3 shrink-0" />
        <span className="truncate">{node.name}</span>
        {node.locked && (
          <span className="ml-auto text-[9px] uppercase tracking-wider text-zinc-600">locked</span>
        )}
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-zinc-500 hover:text-zinc-400"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <ChevronRight className={cn('h-3 w-3 shrink-0 transition-transform', open && 'rotate-90')} />
        <span>{node.name}/</span>
      </button>
      {open && node.children?.map((child) => (
        <TreeNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

function RailItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] text-zinc-400 transition-colors hover:bg-zinc-800/30 hover:text-zinc-300"
    >
      <span className="text-zinc-600">{icon}</span>
      {label}
    </button>
  )
}

function PipelineItem({
  name,
  status,
  step,
  total,
}: {
  name: string
  status: 'running' | 'idle'
  step: number
  total: number
}) {
  const progress = status === 'running' ? (step / total) * 100 : 0

  return (
    <div className="rounded-md border border-zinc-800/50 bg-obsidian-100/50 px-2.5 py-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-500">{name}</span>
        {status === 'running' && (
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse-subtle" />
        )}
      </div>
      <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-zinc-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
