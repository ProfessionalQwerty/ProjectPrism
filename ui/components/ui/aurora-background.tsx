import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { PrismShaderBackdrop } from './prism-shader-backdrop'

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
}

export function AuroraBackground({ className, children, ...props }: AuroraBackgroundProps) {
  return (
    <div
      className={cn('relative flex min-h-screen flex-col overflow-hidden bg-neutral-100', className)}
      {...props}
    >
      <PrismShaderBackdrop variant="muted" className="z-0" />
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div
          className={cn(
            'absolute -inset-[10px] opacity-30 blur-2xl',
            '[background-image:linear-gradient(100deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.6)_10%,rgba(255,255,255,0)_20%),',
            'repeating-linear-gradient(100deg,rgba(99,102,241,0.15)_10%,rgba(168,85,247,0.12)_20%,rgba(236,72,153,0.1)_30%,rgba(251,191,36,0.08)_40%)]',
            '[background-size:300%_200%,300%_200%] animate-aurora'
          )}
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  )
}
