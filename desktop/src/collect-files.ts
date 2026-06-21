import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.ruby-data',
  'release',
  '.vercel',
])

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.css',
  '.html',
  '.yml',
  '.yaml',
  '.txt',
  '.env.example',
])

export const MAX_FILES = 500
export const MAX_BYTES = 20 * 1024 * 1024

export interface CollectedFile {
  path: string
  content: string
}

export function collectProjectFiles(rootDir: string): CollectedFile[] {
  const files: CollectedFile[] = []
  let totalBytes = 0

  const walk = (dir: string): void => {
    if (files.length >= MAX_FILES) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (files.length >= MAX_FILES) break
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full)
        continue
      }
      if (!entry.isFile()) continue
      const ext = entry.name.includes('.') ? entry.name.slice(entry.name.lastIndexOf('.')) : ''
      if (!TEXT_EXTENSIONS.has(ext) && ext !== '') continue
      const stat = statSync(full)
      if (stat.size > 512 * 1024) continue
      const content = readFileSync(full, 'utf8')
      totalBytes += Buffer.byteLength(content, 'utf8')
      if (totalBytes > MAX_BYTES) {
        throw new Error(`Project folder exceeds ${MAX_BYTES} bytes upload limit`)
      }
      files.push({
        path: relative(rootDir, full).replace(/\\/g, '/'),
        content,
      })
    }
  }

  walk(rootDir)
  return files
}
