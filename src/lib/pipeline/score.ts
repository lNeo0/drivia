import Anthropic from '@anthropic-ai/sdk'
import type { CarImageCandidate, ScoredCandidate } from './types'

let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _client
}

const SCORING_PROMPT = `Tu es un expert en photographie automobile pour un site premium.
Analyse cette image de voiture et réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.

{
  "has_car": boolean,
  "is_correct_vehicle": boolean,
  "scores": {
    "angle": number,        // 0-40 : 40=3/4 avant gauche parfait, 25=face, 15=côté, 0=arrière
    "completeness": number, // 0-20 : 20=voiture entière visible avec marges, 0=voiture coupée
    "resolution": number,   // 0-10 : 10=haute résolution nette, 0=flou/pixelisé
    "background": number,   // 0-10 : 10=fond neutre/studio/route dégagée, 0=parking bondé/foule
    "style": number,        // 0-15 : 15=photo presse/constructeur, 0=photo amateur
    "lighting": number      // 0-5  : 5=bien exposée, 0=surexposée/sous-exposée
  },
  "malus": {
    "multiple_cars": number,     // -20 si plusieurs voitures visibles
    "tuning": number,            // -30 si tuning visible (jantes aftermarket, kit carrosserie, stickers)
    "perspective": number,       // -15 si angle bizarre (vue plongeante, contre-plongée extrême)
    "car_cut": number,           // -20 si voiture coupée par le bord de l'image
    "visual_noise": number,      // -10 si trop d'éléments parasites (panneaux, foule, bâtiments)
    "dirty_car": number,         // -10 si voiture sale ou endommagée
    "watermark": number          // -15 si watermark visible sur la voiture
  },
  "final_score": number,   // somme scores - somme malus (peut être négatif)
  "reasoning": string,     // 1 phrase précise expliquant le score
  "recommendation": "accept" | "reject"
}

Sois TRÈS sévère sur le tuning et les angles. Sois INDULGENT sur le fond si la voiture est bien cadrée.
Le seuil d'acceptation est 68. Mets "accept" uniquement si final_score >= 68.`

export async function scoreCandidate(candidate: CarImageCandidate): Promise<ScoredCandidate> {
  try {
    const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
    type SupportedMediaType = (typeof SUPPORTED_TYPES)[number]

    const imageResponse = await fetch(candidate.url, {
      headers: { 'User-Agent': 'Drivia/1.0 (https://github.com/lNeo0/drivia)' },
      signal: AbortSignal.timeout(15000),
    })
    if (!imageResponse.ok) throw new Error(`HTTP ${imageResponse.status}`)
    const ct = (imageResponse.headers.get('content-type') ?? '').toLowerCase().split(';')[0].trim()
    const mediaType: SupportedMediaType = SUPPORTED_TYPES.find(t => t === ct) ?? 'image/jpeg'
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(imageBuffer).toString('base64')

    const response = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          { type: 'text', text: SCORING_PROMPT },
        ],
      }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
    const text = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
    const parsed = JSON.parse(text)

    if (!parsed.has_car) {
      return { ...candidate, score: 0, reasoning: 'No car detected' }
    }

    const scoreSum = Object.values(parsed.scores as Record<string, number>).reduce((a, b) => a + b, 0)
    const malusSum = Object.values(parsed.malus as Record<string, number>).reduce((a, b) => a + b, 0)
    const finalScore = Math.max(0, scoreSum + malusSum)

    return {
      ...candidate,
      score: Math.round(finalScore),
      reasoning: parsed.reasoning,
    }
  } catch (err) {
    console.error('[score] Error:', err)
    return { ...candidate, score: 0, reasoning: 'Scoring failed' }
  }
}

export async function selectBestImage(
  candidates: CarImageCandidate[],
  minScore = 68
): Promise<ScoredCandidate | null> {
  const scored: ScoredCandidate[] = []

  for (let i = 0; i < candidates.length; i += 3) {
    const batch = candidates.slice(i, i + 3)
    const results = await Promise.all(batch.map(c => scoreCandidate(c)))
    scored.push(...results)
    if (i + 3 < candidates.length) {
      await new Promise(r => setTimeout(r, 1200))
    }
  }

  scored.sort((a, b) => b.score - a.score)

  console.log('[score] Results:')
  scored.forEach(c => console.log(
    `  ${c.score >= minScore ? '✅' : '❌'} ${c.score}/100 — ${c.reasoning?.slice(0, 80)}`
  ))

  const best = scored[0]
  if (!best || best.score < minScore) {
    const fallback = scored[0]
    if (fallback && fallback.score >= 40) {
      console.warn(`[score] ⚠️ No image above ${minScore}, using best available: ${fallback.score}/100`)
      return fallback
    }
    console.error(`[score] ❌ No usable image found`)
    return null
  }

  return best
}
