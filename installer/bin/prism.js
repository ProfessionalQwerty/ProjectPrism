#!/usr/bin/env node
import { launchInstalled } from '../dist/install.js'

launchInstalled().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  console.error('PRISM is not installed. Run: npx @prism/install')
  process.exit(1)
})
