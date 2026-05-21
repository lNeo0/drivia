import sharp from 'sharp'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORKER = path.resolve(__dirname, '../../../scripts/_bg-remove-worker.ts')

const TARGET_W = 1600
const TARGET_H = 900
const FIT_PCT = 0.85
const VERTICAL_OFFSET_PCT = 0.03
const BG_COLOR = { r: 13, g: 13, b: 13, alpha: 1 } as const

async function tryRemoveBackground(imageUrl: string): Promise<Buffer | null> {
  try {
    const result = spawnSync(
      'npx',
      ['tsx', WORKER, imageUrl],
      { maxBuffer: 50 * 1024 * 1024, timeout: 120_000, encoding: 'buffer' }
    )
    if (result.status === 0 && result.stdout.length > 0) {
      return Buffer.from(result.stdout.toString(), 'base64')
    }
    console.warn(`  [normalize] Background removal failed (exit ${result.status}), using original`)
    return null
  } catch (err) {
    console.warn(`  [normalize] Background removal error: ${err}, using original`)
    return null
  }
}

export async function normalizeCarImage(imageUrl: string): Promise<Buffer> {
  console.log(`  [normalize] Fetching image…`)
  const res = await fetch(imageUrl, {
    headers: { 'User-Agent': 'Drivia/1.0 (https://github.com/lNeo0/drivia)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${imageUrl}`)
  const arrayBuffer = await res.arrayBuffer()
  const sourceBuffer = Buffer.from(arrayBuffer)

  console.log(`  [normalize] Removing background (isolated process)…`)
  const nobgBuffer = await tryRemoveBackground(imageUrl)
  const workBuffer = nobgBuffer ?? sourceBuffer

  console.log(`  [normalize] Trimming and resizing…`)
  const trimmed = await sharp(workBuffer)
    .trim({ threshold: nobgBuffer ? 10 : undefined })
    .toBuffer()

  const fitW = Math.round(TARGET_W * FIT_PCT)
  const fitH = Math.round(TARGET_H * FIT_PCT)

  const resized = await sharp(trimmed)
    .resize(fitW, fitH, { fit: 'inside', withoutEnlargement: false })
    .toBuffer()

  const { width: rW = fitW, height: rH = fitH } = await sharp(resized).metadata()

  const left = Math.round((TARGET_W - rW) / 2)
  const topBase = Math.round((TARGET_H - rH) / 2)
  const top = Math.min(Math.round(topBase + TARGET_H * VERTICAL_OFFSET_PCT), TARGET_H - rH)

  console.log(`  [normalize] Compositing ${rW}×${rH} onto ${TARGET_W}×${TARGET_H} dark canvas…`)
  const final = await sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite([{ input: resized, left, top }])
    .webp({ quality: 90 })
    .toBuffer()

  return final
}
