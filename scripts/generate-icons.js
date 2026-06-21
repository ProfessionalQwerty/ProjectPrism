/**
 * Generate electron-builder icons from prism-logo or cut-stone source PNG.
 * Run: npm run generate-icons
 */
const { mkdir, readFile, writeFile } = require('fs/promises')
const { existsSync } = require('fs')
const { join } = require('path')
const sharp = require('sharp')
const pngToIco = require('png-to-ico')

const root = join(__dirname, '..')
const buildDir = join(root, 'build')

const SOURCE_CANDIDATES = [
  join(root, '..', 'prism_logo_cut_stone_final.png'),
  join(root, 'ui', 'public', 'prism-logo.png'),
]

async function findSource() {
  for (const candidate of SOURCE_CANDIDATES) {
    if (existsSync(candidate)) return candidate
  }
  throw new Error(`No source logo found. Expected one of:\n${SOURCE_CANDIDATES.join('\n')}`)
}

async function writePngSizes(source, sizes) {
  const outputs = []
  for (const size of sizes) {
    outputs.push(
      await sharp(source)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  }
  return outputs
}

async function main() {
  await mkdir(buildDir, { recursive: true })
  const sourcePath = await findSource()
  console.log('Using source:', sourcePath)

  const source = await readFile(sourcePath)
  const icon512 = await sharp(source)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  await writeFile(join(buildDir, 'icon.png'), icon512)

  const icoSizes = await writePngSizes(source, [16, 24, 32, 48, 64, 128, 256])
  const ico = await pngToIco(icoSizes)
  await writeFile(join(buildDir, 'icon.ico'), ico)

  console.log('Wrote build/icon.png and build/icon.ico')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
