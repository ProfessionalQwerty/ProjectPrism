#!/usr/bin/env node
import { installPrism } from '../dist/install.js'

const launch = process.argv.includes('--launch')

installPrism({ launch }).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
