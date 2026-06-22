import React, { useId } from 'react'

type PrismBrandSize = 'nav' | 'hero' | 'footer'

interface PrismBrandProps {
  size?: PrismBrandSize
  showText?: boolean
  className?: string
}

const sizeConfig: Record<
  PrismBrandSize,
  { box: string; scale: string; text: string; gap: string }
> = {
  nav: {
    box: 'h-14 w-14',
    scale: 'scale-[1.35]',
    text: 'text-[22px] font-bold tracking-[0.12em]',
    gap: 'gap-3.5',
  },
  hero: {
    box: 'h-32 w-32 md:h-40 md:w-40',
    scale: 'scale-[1.2]',
    text: 'text-5xl md:text-6xl font-bold tracking-[0.14em]',
    gap: 'gap-0',
  },
  footer: {
    box: 'h-9 w-9',
    scale: 'scale-[1.25]',
    text: 'text-[14px] font-medium',
    gap: 'gap-2.5',
  },
}

/**
 * Inline SVG so the brand mark always renders — public asset paths break under
 * Electron's file:// loader (and across web/electron base paths), which left the
 * top-left logo showing a broken-image placeholder.
 */
function PrismGlyph({ className = '' }: { className?: string }) {
  const uid = useId()
  const a = `${uid}-a`
  const b = `${uid}-b`
  const c = `${uid}-c`
  return (
    <svg viewBox="0 0 512 512" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={a} x1="80" y1="48" x2="432" y2="464" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#A855F7" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id={b} x1="256" y1="48" x2="256" y2="464" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id={c} x1="368" y1="120" x2="144" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDD6FE" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
      <polygon points="256,56 448,208 256,456 64,208" fill={`url(#${a})`} />
      <polygon points="256,56 256,456 160,208" fill={`url(#${b})`} opacity="0.85" />
      <polygon points="256,56 448,208 352,208" fill={`url(#${c})`} opacity="0.75" />
      <polygon points="256,208 448,208 256,456" fill="#5B21B6" opacity="0.25" />
    </svg>
  )
}

export function PrismBrand({ size = 'nav', showText = true, className = '' }: PrismBrandProps) {
  const cfg = sizeConfig[size]

  return (
    <div className={`inline-flex items-center justify-center ${cfg.gap} ${className}`}>
      <div className={`relative shrink-0 ${cfg.box}`}>
        <PrismGlyph
          className={`absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 ${cfg.scale} drop-shadow-lg`}
        />
      </div>
      {showText && <span className={`leading-none text-neutral-900 ${cfg.text}`}>PRISM</span>}
    </div>
  )
}
