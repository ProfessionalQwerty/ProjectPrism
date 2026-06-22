import React, { useId } from 'react'

/** Inline prism mark — works under Electron file:// (no public asset fetch). */
export function PrismGlyph({ className = '' }: { className?: string }) {
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
