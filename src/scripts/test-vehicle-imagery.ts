import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const API_KEY = process.env.VEHICLE_IMAGERY_API_KEY ?? ''
const BASE = 'https://api.vehicleimagery.com/api'

async function get(p: string) {
  const res = await fetch(`${BASE}${p}`, { headers: { 'x-api-key': API_KEY } })
  const text = await res.text()
  let json: unknown
  try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, json, text }
}

interface ViItem { variants?: string[]; trims?: string[]; views?: Record<string, boolean | string>; image_url?: string }

function firstItem(json: unknown): ViItem | null {
  if (Array.isArray(json) && json.length > 0) return json[0] as ViItem
  if (json && typeof json === 'object') return json as ViItem
  return null
}

// Sélectionne la meilleure vue disponible (true = disponible, string "not_allowed" = non dispo)
function bestView(views: Record<string, boolean | string>): string | null {
  const preference = ['front_left', 'front-left', 'front', 'side_left', 'side-left', 'side', 'rear_left', 'rear']
  for (const pref of preference) {
    if (views[pref] === true) return pref
  }
  // Prend la première vue disponible
  for (const [k, v] of Object.entries(views)) {
    if (v === true) return k
  }
  return null
}

async function traceChain(make: string, model: string, year: number) {
  console.log(`\n--- ${make}/${model}/${year} ---`)
  const r1 = await get(`/${make}/${model}/${year}`)
  if (r1.status !== 200) { console.log(`Variants: HTTP ${r1.status}  ${r1.text.slice(0, 100)}`); return }

  const item1 = firstItem(r1.json)
  const variants = item1?.variants ?? []
  console.log(`Variants: ${JSON.stringify(variants)}`)

  for (const variant of variants.slice(0, 1)) {
    const r2 = await get(`/${make}/${model}/${year}/${encodeURIComponent(variant)}`)
    if (r2.status !== 200) { console.log(`Trims [${variant}]: HTTP ${r2.status}`); continue }
    const trims = firstItem(r2.json)?.trims ?? []
    console.log(`Trims [${variant}]: ${JSON.stringify(trims)}`)

    for (const trim of trims.slice(0, 1)) {
      const r3 = await get(`/${make}/${model}/${year}/${encodeURIComponent(variant)}/${encodeURIComponent(trim)}`)
      if (r3.status !== 200) { console.log(`Views [${trim}]: HTTP ${r3.status}`); continue }
      const views = firstItem(r3.json)?.views ?? {}
      const availViews = Object.entries(views).filter(([, v]) => v === true).map(([k]) => k)
      console.log(`Views [${variant}/${trim}]: disponibles = ${JSON.stringify(availViews)}`)
      console.log(`Views [${variant}/${trim}]: TOUTES = ${JSON.stringify(views)}`)

      const view = bestView(views)
      if (!view) { console.log('Aucune vue disponible'); continue }

      const r4 = await get(`/${make}/${model}/${year}/${encodeURIComponent(variant)}/${encodeURIComponent(trim)}/${encodeURIComponent(view)}`)
      const imgUrl = firstItem(r4.json)?.image_url
      console.log(`Image [${view}]: HTTP ${r4.status}  url=${imgUrl ?? r4.text.slice(0, 100)}`)
    }
  }
}

async function scanYears(make: string, model: string, start: number, end: number) {
  const hits: number[] = []
  for (const year of Array.from({length: end - start + 1}, (_, i) => start + i)) {
    const r = await get(`/${make}/${model}/${year}`)
    if (r.status === 200) hits.push(year)
  }
  return hits
}

async function main() {
  console.log(`API_KEY: ${API_KEY ? API_KEY.slice(0, 8) + '...' : 'MANQUANTE'}`)
  if (!API_KEY) process.exit(1)

  // BMW 3 — chaîne complète (on sait que ça marche)
  await traceChain('bmw', '3', 2013)

  // Scan des années pour chaque voiture
  const cars = [
    { make: 'volkswagen', model: 'golf'    },
    { make: 'renault',    model: 'clio'    },
    { make: 'peugeot',    model: '308'     },
    { make: 'toyota',     model: 'yaris'   },
    { make: 'bmw',        model: 'm3'      },
    { make: 'dacia',      model: 'sandero' },
    { make: 'ford',       model: 'fiesta'  },
    { make: 'citroen',    model: 'c3'      },
  ]

  console.log('\n=== SCAN DES ANNÉES (2005–2022) ===')
  for (const { make, model } of cars) {
    const hits = await scanYears(make, model, 2005, 2022)
    console.log(`  ${make}/${model}: ${hits.length > 0 ? hits.join(', ') : 'AUCUNE ANNÉE'}`)
    if (hits.length > 0) await traceChain(make, model, hits[0])
  }
}

main()
