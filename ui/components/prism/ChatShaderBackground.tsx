import React from 'react'
import { PrismShaderBackdrop } from '../ui/prism-shader-backdrop'

/** Blurred shader layer behind chat messages — keeps focus on text. */
export function ChatShaderBackground() {
  return <PrismShaderBackdrop variant="blurred" />
}
