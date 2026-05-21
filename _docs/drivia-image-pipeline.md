# Drivia — Pipeline Images Automatique
> Architecture complète + code TypeScript prêt à intégrer
> Session 5 — Mai 2026

---

## Vue d'ensemble du pipeline

```
[Car ID] 
  → [search.ts]     Wikimedia Commons → candidates[]
  → [score.ts]      Claude Vision → meilleure image
  → [normalize.ts]  Sharp + BG removal → WebP 1600×900 dark premium
  → [storage.ts]    Supabase Storage → URL publique permanente
  → [cache]         Next.js Image + headers → rendu instantané
```

---

## 1. Installation des dépendances

```bash
npm install sharp @imgly/background-removal axios
npm install -D @types/sharp

# Pour le script batch CLI
npm install -D tsx
```

---

## 2. src/lib/pipeline/types.ts

```typescript
export interface CarImageCandidate {
  url: string
  width: number
  height: number
  source: 'wikimedia' | 'duckduckgo' | 'fallback'
  license?: string
  description?: string
}

export interface ScoredCandidate extends CarImageCandidate {
  score: number
  reasoning: string
}

export interface ProcessedImage {
  carId: string
  publicUrl: string
  width: number
  height: number
  processedAt: string
}

export interface PipelineResult {
  success: boolean
  carId: string
  publicUrl?: string
  error?: string
  duration?: number
}
```

---

## 3. src/lib/pipeline/search.ts

```typescript
import axios from 'axios'
import { CarImageCandidate } from './types'

// Mapping make/model → termes de recherche Wikimedia optimisés
const SEARCH_TERMS: Record<string, string[]> = {
  'volkswagen-golf-7':  ['Volkswagen Golf VII', 'VW Golf 7 front'],
  'renault-clio-4':     ['Renault Clio IV', 'Renault Clio 4 front'],
  'peugeot-308-ii':     ['Peugeot 308 II', 'Peugeot 308 2014'],
  'toyota-yaris-3':     ['Toyota Yaris III', 'Toyota Yaris 2012 front'],
  'bmw-m3-e92':         ['BMW M3 E92', 'BMW M3 E92 front'],
  'bmw-serie-3-f30':    ['BMW 3 Series F30', 'BMW F30 front'],
  'dacia-sandero-ii':   ['Dacia Sandero II', 'Dacia Sandero 2013'],
  'ford-fiesta-7':      ['Ford Fiesta VII', 'Ford Fiesta 2018 front'],
  'citroen-c3-iii':     ['Citroën C3 III', 'Citroen C3 2017 front'],
}

async function searchWikimedia(query: string): Promise<CarImageCandidate[]> {
  const candidates: CarImageCandidate[] = []

  try {
    // 1. Recherche de pages contenant ce terme
    const searchResp = await axios.get('https://commons.wikimedia.org/w/api.php', {
      params: {
        action: 'query',
        generator: 'search',
        gsrnamespace: 6, // namespace File
        gsrsearch: `${query} front`,
        gsrlimit: 10,
        prop: 'imageinfo',
        iiprop: 'url|size|extmetadata',
        iiurlwidth: 1600,
        format: 'json',
        origin: '*',
      },
      timeout: 10000,
    })

    const pages = searchResp.data?.query?.pages || {}

    for (const page of Object.values(pages) as any[]) {
      const info = page.imageinfo?.[0]
      if (!info) continue

      const url = info.thumburl || info.url
      const width = info.thumbwidth || info.width
      const height = info.thumbheight || info.height
      const license = info.extmetadata?.LicenseShortName?.value || 'Unknown'

      // Filtres basiques : résolution minimum + pas de SVG/PNG logo
      if (width < 800 || height < 400) continue
      if (url.toLowerCase().includes('.svg')) continue
      
      candidates.push({
        url,
        width,
        height,
        source: 'wikimedia',
        license,
        description: page.title,
      })
    }
  } catch (err) {
    console.error(`[search] Wikimedia error for "${query}":`, err)
  }

  return candidates
}

export async function findCandidates(carId: string): Promise<CarImageCandidate[]> {
  const terms = SEARCH_TERMS[carId] || []
  if (terms.length === 0) {
    console.warn(`[search] No search terms defined for carId: ${carId}`)
    return []
  }

  const allCandidates: CarImageCandidate[] = []

  for (const term of terms) {
    const results = await searchWikimedia(term)
    allCandidates.push(...results)
    // Éviter d'être rate-limité
    await new Promise(r => setTimeout(r, 300))
  }

  // Déduplique par URL
  const seen = new Set<string>()
  return allCandidates.filter(c => {
    if (seen.has(c.url)) return false
    seen.add(c.url)
    return true
  })
}
```

---

## 4. src/lib/pipeline/score.ts

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { CarImageCandidate, ScoredCandidate } from './types'

const client = new Anthropic()

const SCORING_PROMPT = `Tu es un expert en photographie automobile.
Analyse cette image et réponds UNIQUEMENT en JSON valide avec ces champs :
{
  "has_car": boolean,           // L'image contient bien une voiture
  "angle_score": number,        // 0-100 : 100 = parfait 3/4 avant gauche
  "quality_score": number,      // 0-100 : résolution, netteté, éclairage
  "centering_score": number,    // 0-100 : voiture bien centrée et entière visible
  "clean_background": boolean,  // Fond neutre ou studio (pas de rue chargée)
  "reasoning": string           // 1 phrase d'explication
}
Critères angle : 3/4 avant = 90-100pts, face = 60pts, côté = 40pts, arrière = 10pts.`

export async function scoreCandidate(candidate: CarImageCandidate): Promise<ScoredCandidate> {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: candidate.url },
          },
          {
            type: 'text',
            text: SCORING_PROMPT,
          },
        ],
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

    if (!parsed.has_car) {
      return { ...candidate, score: 0, reasoning: 'No car detected' }
    }

    const score =
      parsed.angle_score * 0.40 +
      parsed.quality_score * 0.30 +
      parsed.centering_score * 0.20 +
      (parsed.clean_background ? 10 : 0)

    return {
      ...candidate,
      score: Math.round(score),
      reasoning: parsed.reasoning,
    }
  } catch (err) {
    console.error('[score] Claude API error:', err)
    return { ...candidate, score: 0, reasoning: 'Scoring failed' }
  }
}

export async function selectBestImage(
  candidates: CarImageCandidate[],
  minScore = 60
): Promise<ScoredCandidate | null> {
  // Score en parallèle par batch de 3 pour respecter les rate limits
  const scored: ScoredCandidate[] = []
  
  for (let i = 0; i < candidates.length; i += 3) {
    const batch = candidates.slice(i, i + 3)
    const results = await Promise.all(batch.map(c => scoreCandidate(c)))
    scored.push(...results)
    if (i + 3 < candidates.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  scored.sort((a, b) => b.score - a.score)
  
  console.log('[score] Results:')
  scored.forEach(c => console.log(`  ${c.score}/100 — ${c.url.slice(0, 60)}...`))

  const best = scored[0]
  if (!best || best.score < minScore) {
    console.warn(`[score] No candidate above threshold ${minScore}`)
    return null
  }

  return best
}
```

---

## 5. src/lib/pipeline/normalize.ts

```typescript
import sharp from 'sharp'
import { removeBackground } from '@imgly/background-removal-node'

// Fond dark premium Drivia
const BG_COLOR = { r: 13, g: 13, b: 13, alpha: 1 } // #0D0D0D

const OUTPUT_WIDTH = 1600
const OUTPUT_HEIGHT = 900
const PADDING_PERCENT = 0.10 // 10% de padding autour de la voiture

export async function normalizeCarImage(imageUrl: string): Promise<Buffer> {
  // 1. Téléchargement de l'image source
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)
  const arrayBuffer = await response.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  // 2. Suppression du fond via @imgly/background-removal
  // Tourne localement via WASM/ONNX — 100% gratuit, aucun appel API
  const blob = new Blob([inputBuffer])
  const outputBlob = await removeBackground(blob)
  const noBackgroundBuffer = Buffer.from(await outputBlob.arrayBuffer())

  // 3. Analyse bounding box de la voiture (zone non-transparente)
  const { data: rawData, info } = await sharp(noBackgroundBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const bbox = detectBoundingBox(rawData, info.width, info.height, info.channels)

  // 4. Crop sur la bounding box + padding
  const paddingX = Math.round((bbox.width) * PADDING_PERCENT)
  const paddingY = Math.round((bbox.height) * PADDING_PERCENT)

  const cropX = Math.max(0, bbox.left - paddingX)
  const cropY = Math.max(0, bbox.top - paddingY)
  const cropW = Math.min(info.width - cropX, bbox.width + paddingX * 2)
  const cropH = Math.min(info.height - cropY, bbox.height + paddingY * 2)

  const croppedCar = await sharp(noBackgroundBuffer)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .toBuffer()

  // 5. Calcul des dimensions pour fit dans 1600×900 sans déformer
  const carAspect = cropW / cropH
  const targetAspect = OUTPUT_WIDTH / OUTPUT_HEIGHT

  let fitWidth: number, fitHeight: number
  if (carAspect > targetAspect) {
    fitWidth = Math.round(OUTPUT_WIDTH * 0.85)
    fitHeight = Math.round(fitWidth / carAspect)
  } else {
    fitHeight = Math.round(OUTPUT_HEIGHT * 0.85)
    fitWidth = Math.round(fitHeight * carAspect)
  }

  // 6. Resize de la voiture découpée
  const resizedCar = await sharp(croppedCar)
    .resize(fitWidth, fitHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  // 7. Composite sur fond dark #0D0D0D avec centrage et légère position basse
  const offsetX = Math.round((OUTPUT_WIDTH - fitWidth) / 2)
  const offsetY = Math.round((OUTPUT_HEIGHT - fitHeight) / 2 + OUTPUT_HEIGHT * 0.03) // légèrement sous le centre

  const finalImage = await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: OUTPUT_HEIGHT,
      channels: 3,
      background: BG_COLOR,
    },
  })
    .composite([{ input: resizedCar, left: offsetX, top: offsetY }])
    .webp({ quality: 90, effort: 4 })
    .toBuffer()

  return finalImage
}

function detectBoundingBox(
  data: Buffer,
  width: number,
  height: number,
  channels: number
) {
  let minX = width, maxX = 0, minY = height, maxY = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels
      const alpha = channels === 4 ? data[idx + 3] : 255
      if (alpha > 10) { // seuil : pixel non-transparent
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}
```

---

## 6. src/lib/pipeline/storage.ts

```typescript
import { createClient } from '@supabase/supabase-js'
import { ProcessedImage } from './types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role pour écriture storage
)

const BUCKET = 'car-images'

export async function uploadCarImage(
  carId: string,
  imageBuffer: Buffer
): Promise<ProcessedImage> {
  const filename = `${carId}.webp`
  const path = `processed/${filename}`

  // Upload vers Supabase Storage (remplace si existe déjà)
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, imageBuffer, {
      contentType: 'image/webp',
      upsert: true,
      cacheControl: '31536000', // 1 an de cache
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)

  // Sauvegarde en base (table car_images)
  await supabase.from('car_images').upsert({
    car_id: carId,
    public_url: urlData.publicUrl,
    width: 1600,
    height: 900,
    processed_at: new Date().toISOString(),
  })

  return {
    carId,
    publicUrl: urlData.publicUrl,
    width: 1600,
    height: 900,
    processedAt: new Date().toISOString(),
  }
}

export async function getStoredImage(carId: string): Promise<string | null> {
  const { data } = await supabase
    .from('car_images')
    .select('public_url')
    .eq('car_id', carId)
    .single()

  return data?.public_url || null
}
```

---

## 7. src/lib/pipeline/pipeline.ts — Orchestrateur

```typescript
import { findCandidates } from './search'
import { selectBestImage } from './score'
import { normalizeCarImage } from './normalize'
import { uploadCarImage, getStoredImage } from './storage'
import { PipelineResult } from './types'

export async function processCar(
  carId: string,
  options = { forceReprocess: false }
): Promise<PipelineResult> {
  const start = Date.now()
  console.log(`\n🚗 Processing: ${carId}`)

  try {
    // 0. Vérifier si déjà traité
    if (!options.forceReprocess) {
      const existing = await getStoredImage(carId)
      if (existing) {
        console.log(`  ✅ Already processed: ${existing}`)
        return { success: true, carId, publicUrl: existing }
      }
    }

    // 1. Recherche
    console.log('  🔍 Searching candidates...')
    const candidates = await findCandidates(carId)
    console.log(`  Found ${candidates.length} candidates`)

    if (candidates.length === 0) {
      return { success: false, carId, error: 'No candidates found' }
    }

    // 2. Scoring IA
    console.log('  🤖 Scoring with Claude Vision...')
    const best = await selectBestImage(candidates)

    if (!best) {
      return { success: false, carId, error: 'No image passed quality threshold' }
    }

    console.log(`  ✅ Best candidate: ${best.score}/100 — ${best.reasoning}`)

    // 3. Normalisation
    console.log('  🎨 Normalizing image...')
    const processedBuffer = await normalizeCarImage(best.url)
    console.log(`  Processed: ${(processedBuffer.length / 1024).toFixed(0)}KB WebP`)

    // 4. Storage
    console.log('  ☁️  Uploading to Supabase...')
    const result = await uploadCarImage(carId, processedBuffer)

    const duration = Date.now() - start
    console.log(`  🏁 Done in ${(duration / 1000).toFixed(1)}s — ${result.publicUrl}`)

    return { success: true, carId, publicUrl: result.publicUrl, duration }

  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    console.error(`  ❌ Failed: ${error}`)
    return { success: false, carId, error, duration: Date.now() - start }
  }
}

export async function processAllCars(carIds: string[]): Promise<PipelineResult[]> {
  const results: PipelineResult[] = []

  for (const carId of carIds) {
    const result = await processCar(carId)
    results.push(result)
    // Pause entre chaque pour respecter les rate limits Wikimedia + Claude
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log('\n📊 Summary:')
  const ok = results.filter(r => r.success).length
  console.log(`  ✅ Success: ${ok}/${results.length}`)
  results.filter(r => !r.success).forEach(r =>
    console.log(`  ❌ ${r.carId}: ${r.error}`)
  )

  return results
}
```

---

## 8. scripts/process-all-cars.ts — Script CLI

```typescript
import { processAllCars } from '../src/lib/pipeline/pipeline'

const CAR_IDS = [
  'volkswagen-golf-7',
  'renault-clio-4',
  'peugeot-308-ii',
  'toyota-yaris-3',
  'bmw-m3-e92',
  'bmw-serie-3-f30',
  'dacia-sandero-ii',
  'ford-fiesta-7',
  'citroen-c3-iii',
]

async function main() {
  console.log('🚀 Drivia Image Pipeline — Batch Processing')
  console.log(`Processing ${CAR_IDS.length} cars...\n`)

  const results = await processAllCars(CAR_IDS)

  const failed = results.filter(r => !r.success)
  if (failed.length > 0) {
    console.log('\n⚠️  Failed cars (to retry manually):')
    failed.forEach(r => console.log(`  - ${r.carId}: ${r.error}`))
    process.exit(1)
  }

  console.log('\n✅ All cars processed successfully!')
  process.exit(0)
}

main().catch(console.error)
```

**Exécution :**
```bash
npx tsx scripts/process-all-cars.ts
```

---

## 9. Route API — /api/process-image/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { processCar } from '@/lib/pipeline/pipeline'

// Protéger avec un secret pour éviter les appels non autorisés
const PIPELINE_SECRET = process.env.PIPELINE_SECRET

export async function POST(req: NextRequest) {
  const { carId, secret, forceReprocess } = await req.json()

  if (secret !== PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await processCar(carId, { forceReprocess: !!forceReprocess })
  return NextResponse.json(result)
}
```

---

## 10. Mise à jour src/lib/carImage.ts

```typescript
// Priorité : image Supabase pré-traitée
// Fallback : Vehicle Imagery API (proxy actuel)
// Dernier recours : placeholder

export function getCarImageUrl(make: string, model: string, year: number): string {
  // Les images Supabase sont servies directement via leur URL publique
  // On les résout via un helper côté serveur
  // Côté client, on utilise le proxy existant comme fallback
  return `/api/car-image?make=${make}&model=${model}&year=${year}&angle=front-left`
}

// Nouveau : récupère l'URL Supabase si disponible
export async function getCarImageUrlFromDB(carId: string): Promise<string | null> {
  const res = await fetch(`/api/car-image-url?carId=${carId}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.url || null
}
```

---

## 11. SQL Supabase — Migration

```sql
-- Créer le bucket (via dashboard ou SQL)
-- insert into storage.buckets (id, name, public) values ('car-images', 'car-images', true);

-- Table pour tracker les images traitées
create table if not exists car_images (
  id uuid primary key default gen_random_uuid(),
  car_id text unique not null,
  public_url text not null,
  width integer default 1600,
  height integer default 900,
  processed_at timestamptz default now(),
  source_url text,
  score integer
);

-- Index pour lookup rapide
create index on car_images(car_id);

-- RLS : lecture publique, écriture service role uniquement
alter table car_images enable row level security;
create policy "Public read" on car_images for select using (true);
```

---

## 12. Variables d'environnement à ajouter dans .env.local

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Pipeline
PIPELINE_SECRET=ton-secret-random-ici

# Anthropic (pour le scoring Claude Vision)
ANTHROPIC_API_KEY=sk-ant-xxx...
```

---

## 13. Coûts estimés

| Composant | Coût |
|---|---|
| Wikimedia Commons | Gratuit |
| @imgly/background-removal | Gratuit (WASM local) |
| Sharp | Gratuit |
| Claude Vision scoring | ~$0.01/image (5-10 images scorées par voiture) = $0.09 pour 9 voitures |
| Supabase Storage | Gratuit jusqu'à 1GB |
| **Total pour 9 voitures** | **~$0.10** |
| **Total pour 1000 voitures** | **~$10** |

---

## 14. Ordre d'intégration recommandé

1. Créer les fichiers du pipeline (`types.ts`, `search.ts`, `score.ts`, etc.)
2. Créer la table SQL Supabase + bucket `car-images`
3. Tester avec 1 voiture : `npx tsx scripts/process-all-cars.ts`
4. Vérifier le rendu visuel
5. Ajuster `PADDING_PERCENT` et `offsetY` si besoin
6. Lancer le batch complet sur les 9 voitures
7. Mettre à jour `CarCard.tsx` et `HeroImage.tsx` pour prioriser l'URL Supabase

---

*Généré Session 5 — Mai 2026*
