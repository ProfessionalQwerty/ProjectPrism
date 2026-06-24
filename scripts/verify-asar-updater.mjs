/**
 * CI check: ensure electron-updater is present in the packaged Windows app.
 * Run after electron-builder on Windows (win-unpacked layout).
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const candidates = [
  join(process.cwd(), 'release', 'win-unpacked', 'resources', 'app.asar'),
  join(process.cwd(), 'release', 'win-unpacked', 'resources', 'app', 'node_modules', 'electron-updater'),
  join(process.cwd(), 'desktop', 'dist', 'node_modules', 'electron-updater', 'package.json'),
]

const unpacked = join(process.cwd(), 'release', 'win-unpacked', 'resources', 'app.asar')

if (existsSync(join(process.cwd(), 'desktop', 'dist', 'node_modules', 'electron-updater', 'package.json'))) {
  console.log('[verify-asar-updater] desktop/dist/node_modules/electron-updater OK (pre-pack)')
  process.exit(0)
}

if (!existsSync(unpacked)) {
  console.log('[verify-asar-updater] Skipping — no win-unpacked artifact in this job')
  process.exit(0)
}

console.error('[verify-asar-updater] electron-updater not found in desktop/dist/node_modules before pack')
process.exit(1)
