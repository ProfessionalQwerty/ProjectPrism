import React from 'react'
import logoUrl from '../../src/assets/prism-logo.png'

/** Bundled PNG — Vite resolves a stable URL for web and Electron file:// loads. */
export function PrismGlyph({ className = '', alt = '' }: { className?: string; alt?: string }) {
  return <img src={logoUrl} alt={alt} className={className} draggable={false} />
}
