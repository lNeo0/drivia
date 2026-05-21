import { findCandidates } from './search'
import { selectBestImage } from './score'
import { normalizeCarImage } from './normalize'
import { uploadCarImage, getStoredImageUrl } from './storage'
import type { PipelineResult } from './types'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function processCar(carId: string, forceReprocess = false): Promise<PipelineResult> {
  const start = Date.now()
  console.log(`\n[pipeline] Processing: ${carId}`)

  try {
    if (!forceReprocess) {
      const existing = await getStoredImageUrl(carId)
      if (existing) {
        console.log(`[pipeline] Already processed — ${existing}`)
        return { success: true, carId, publicUrl: existing, duration: Date.now() - start }
      }
    }

    console.log(`[pipeline] Step 1/4 — Searching Wikimedia candidates…`)
    const candidates = await findCandidates(carId)
    if (!candidates.length) {
      return { success: false, carId, error: 'No candidates found', duration: Date.now() - start }
    }

    console.log(`[pipeline] Step 2/4 — Scoring ${candidates.length} candidates with Claude Vision…`)
    const best = await selectBestImage(candidates)
    if (!best) {
      return { success: false, carId, error: 'No candidate scored >= 60', duration: Date.now() - start }
    }

    console.log(`[pipeline] Step 3/4 — Normalizing image (background removal + crop)…`)
    const buffer = await normalizeCarImage(best.url)

    console.log(`[pipeline] Step 4/4 — Uploading to Vercel Blob…`)
    const publicUrl = await uploadCarImage(carId, buffer)

    const duration = Date.now() - start
    console.log(`[pipeline] ✓ ${carId} — ${publicUrl} (${(duration / 1000).toFixed(1)}s)`)
    return { success: true, carId, publicUrl, duration }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error(`[pipeline] ✗ ${carId} — ${error}`)
    return { success: false, carId, error, duration: Date.now() - start }
  }
}

export async function processAllCars(carIds: string[]): Promise<PipelineResult[]> {
  const results: PipelineResult[] = []

  for (let i = 0; i < carIds.length; i++) {
    const result = await processCar(carIds[i])
    results.push(result)
    if (i < carIds.length - 1) await sleep(2000)
  }

  const ok = results.filter(r => r.success).length
  const fail = results.filter(r => !r.success).length
  console.log(`\n[pipeline] Summary: ${ok} success, ${fail} failed`)
  results.filter(r => !r.success).forEach(r => {
    console.log(`  ✗ ${r.carId}: ${r.error}`)
  })

  return results
}
