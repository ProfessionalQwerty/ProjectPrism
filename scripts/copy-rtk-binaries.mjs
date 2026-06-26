/**
 * Stage RTK binaries for electron-builder extraResources.
 * Sources (first match wins):
 *   - prism-app/bin/rtk/<platform>/rtk[.exe]  (pre-staged)
 *   - ../reference-repos/rtk-develop/target/release/rtk[.exe]
 *   - cargo build --release in reference repo (if cargo is on PATH)
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const REF = join(ROOT, '..', 'reference-repos', 'rtk-develop')
const OUT = join(ROOT, 'bin', 'rtk')

function platformKey() {
  if (process.platform === 'win32') return 'win32'
  if (process.platform === 'darwin') return 'darwin'
  return 'linux'
}

function rtkName() {
  return process.platform === 'win32' ? 'rtk.exe' : 'rtk'
}

function tryCargoBuild() {
  if (!existsSync(join(REF, 'Cargo.toml'))) return null
  console.log('[copy-rtk] Building RTK from reference repo (cargo build --release)…')
  const result = spawnSync('cargo', ['build', '--release'], {
    cwd: REF,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) return null
  const built = join(REF, 'target', 'release', rtkName())
  return existsSync(built) ? built : null
}

function resolveSource() {
  const staged = join(OUT, platformKey(), rtkName())
  if (existsSync(staged)) return staged

  const release = join(REF, 'target', 'release', rtkName())
  if (existsSync(release)) return release

  return tryCargoBuild()
}

const src = resolveSource()
const destDir = join(OUT, platformKey())
const dest = join(destDir, rtkName())

if (!src) {
  console.warn('[copy-rtk] No RTK binary found — ledger scrubbing uses JS fallback. Install RTK or build reference-repos/rtk-develop.')
  process.exit(0)
}

mkdirSync(destDir, { recursive: true })
cpSync(src, dest)
console.log(`[copy-rtk] Staged ${dest}`)
