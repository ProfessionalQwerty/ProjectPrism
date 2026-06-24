/**
 * Copy main-process runtime deps into desktop/dist/node_modules so they ship
 * inside app.asar via the desktop/dist pack rule in electron-builder.yml.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const DEST = join(ROOT, 'desktop', 'dist', 'node_modules')

const PACKAGES = [
  'electron-updater',
  'builder-util-runtime',
  'fs-extra',
  'graceful-fs',
  'jsonfile',
  'universalify',
  'js-yaml',
  'argparse',
  'lazy-val',
  'lodash.escaperegexp',
  'lodash.isequal',
  'semver',
  'tiny-typed-emitter',
  'debug',
  'ms',
  'sax',
]

function copyPackage(name) {
  const src = join(ROOT, 'node_modules', name)
  const dest = join(DEST, name)
  if (!existsSync(src)) {
    throw new Error(`Missing dependency ${name} — run npm install at repo root`)
  }
  cpSync(src, dest, { recursive: true })
}

if (existsSync(DEST)) {
  rmSync(DEST, { recursive: true, force: true })
}
mkdirSync(DEST, { recursive: true })

for (const pkg of PACKAGES) {
  copyPackage(pkg)
}

console.log(`[copy-main-deps] Copied ${PACKAGES.length} packages to desktop/dist/node_modules`)
