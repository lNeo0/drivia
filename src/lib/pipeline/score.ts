import Anthropic from '@anthropic-ai/sdk'
import type { CarImageCandidate, ScoredCandidate } from './types'

let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _client
}

const SYSTEM_PROMPT = `Tu es un expert en photographie automobile. Analyse cette image et réponds UNIQUEMENT en JSON valide :
{
  "has_car": boolean,
  "angle_score": number,
  "quality_score": number,
  "centering_score": number,
  "clean_background": boolean,
  "reasoning": string
}
angle_score: 0-100, 100 = parfait 3/4 avant gauche.
quality_score: 0-100, netteté, lumière, résolution.
centering_score: 0-100, voiture bien centrée dans le cadre.
clean_background: fond uni ou peu chargé.`

interface VisionScore {
  has_car: boolean
  angle_score: number
  quality_score: number
  centering_score: number
  clean_background: boolean
  reasoning: string
}

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type SupportedMediaType = (typeof SUPPORTED_TYPES)[number]

async function fetchAsBase64(url: string): Promise<{ data: string; mediaType: SupportedMediaType } | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Drivia/1.0 (https://github.com/lNeo0/drivia)' },
    })
    if (!res.ok) return null
    const ct = (res.headers.get('content-type') ?? '').toLowerCase().split(';')[0].trim()
    const mediaType = SUPPORTED_TYPES.find(t => t === ct) ?? 'image/jpeg'
    const arrayBuffer = await res.arrayBuffer()
    const data = Buffer.from(arrayBuffer).toString('base64')
    return { data, mediaType }
  } catch {
    return null
  }
}

async function scoreCandidate(candidate: CarImageCandidate): Promise<ScoredCandidate | null> {
  try {
    const img = await fetchAsBase64(candidate.url)
    if (!img) return null

    const message = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: img.mediaType, data: img.data },
            },
            {
              type: 'text',
              text: 'Analyse cette photo de voiture.',
            },
          ],
        },
      ],
    })

    const text = message.content.find(b => b.type === 'text')?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed: VisionScore = JSON.parse(jsonMatch[0])
    if (!parsed.has_car) return null

    const score =
      parsed.angle_score * 0.4 +
      parsed.quality_score * 0.3 +
      parsed.centering_score * 0.2 +
      (parsed.clean_background ? 10 : 0)

    return { ...candidate, score, reasoning: parsed.reasoning }
  } catch (err) {
    console.warn(`  [score] Failed for ${candidate.url.slice(0, 80)}: ${err}`)
    return null
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function selectBestImage(candidates: CarImageCandidate[]): Promise<ScoredCandidate | null> {
  if (!candidates.length) return null

  const scored: ScoredCandidate[] = []
  const BATCH = 3

  for (let i = 0; i < candidates.length; i += BATCH) {
    const batch = candidates.slice(i, i + BATCH)
    console.log(`  [score] Scoring batch ${Math.floor(i / BATCH) + 1} (${batch.length} images)`)

    const results = await Promise.all(batch.map(c => scoreCandidate(c)))
    for (const r of results) {
      if (r) scored.push(r)
    }

    if (i + BATCH < candidates.length) await sleep(1000)
  }

  const valid = scored.filter(c => c.score >= 60)
  if (!valid.length) {
    console.log(`  [score] No candidate reached score >= 60`)
    return null
  }

  valid.sort((a, b) => b.score - a.score)
  const best = valid[0]
  console.log(`  [score] Best: score=${best.score.toFixed(1)} — ${best.reasoning.slice(0, 100)}`)
  return best
}
