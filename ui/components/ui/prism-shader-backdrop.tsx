import React from 'react'
import { cn } from '../../lib/utils'
import { ShaderAnimation } from './shader-animation'

export type ShaderBackdropVariant = 'full' | 'muted' | 'blurred'

interface PrismShaderBackdropProps {
  variant?: ShaderBackdropVariant
  className?: string
}

/**
 * App-wide shader layers from 21st.txt — full strength on chrome, blurred under chat.
 */
export function PrismShaderBackdrop({ variant = 'full', className }: PrismShaderBackdropProps) {
  if (variant === 'blurred') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <div className="absolute inset-0 scale-110 opacity-40 blur-3xl dark:opacity-25">
          <ShaderAnimation intensity={0.85} />
        </div>
        <div className="absolute inset-0 bg-[#fafafa]/88 backdrop-blur-2xl dark:bg-neutral-950/82" />
      </div>
    )
  }

  const opacity = variant === 'muted' ? 'opacity-[0.18] dark:opacity-[0.12]' : 'opacity-[0.32] dark:opacity-[0.22]'

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className={cn('absolute inset-0', opacity)}>
        <ShaderAnimation intensity={variant === 'muted' ? 0.7 : 1} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-400/5" />
    </div>
  )
}
