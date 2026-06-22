#!/usr/bin/env node
/**
 * Fail CI if the Vite bundle was built without cloud credentials.
 * Private Hugging Face Spaces return HTML 404 without VITE_HF_ACCESS_TOKEN.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const distAssets = join(process.cwd(), 'ui', 'dist', 'assets')

function readBundles() {
  return readdirSync(distAssets)
    .filter((name) => name.endsWith('.js'))
    .map((name) => readFileSync(join(distAssets, name), 'utf8'))
    .join('\n')
}

const bundle = readBundles()

const hasHfToken = /hf_[A-Za-z0-9]{10,}/.test(bundle)
const hasClientKey = /X-PRISM-Client-Key/.test(bundle)

let failed = false

if (!hasHfToken) {
  console.error(
    '::error::ui/dist is missing VITE_HF_ACCESS_TOKEN (no hf_* token in bundle). ' +
      'Private HF Spaces will return 404. Ensure secrets are set and build:electron runs before dist:only.'
  )
  failed = true
}

if (!hasClientKey) {
  console.error(
    '::error::ui/dist is missing VITE_PRISM_CLIENT_KEY. Engine API routes will reject requests.'
  )
  failed = true
}

if (failed) {
  process.exit(1)
}

console.log('Cloud build verification passed (HF token and client key present in bundle).')
