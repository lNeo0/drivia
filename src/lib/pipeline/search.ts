import type { CarImageCandidate } from './types'

const SEARCH_TERMS: Record<string, string[]> = {
  'volkswagen-golf-7': ['Volkswagen Golf VII hatchback 2013', 'VW Golf 7 GTI front three quarter', 'Volkswagen Golf Mk7 exterior front'],
  'renault-clio-4':    ['Renault Clio IV hatchback 2013', 'Renault Clio 4 front exterior', 'Renault Clio 2013 front three quarter'],
  'peugeot-308-2':     ['Peugeot 308 II front', 'Peugeot 308 2014 front'],
  'toyota-yaris-3':    ['Toyota Yaris III front', 'Toyota Yaris 2012 front left'],
  'bmw-m3-e92':        ['BMW M3 E92 front', 'BMW M3 E92 front left'],
  'bmw-serie3-f30':    ['BMW 3 Series F30 front', 'BMW F30 front left'],
  'dacia-sandero-2':   ['Dacia Sandero II front', 'Dacia Sandero 2013 front'],
  'ford-fiesta-7':     ['Ford Fiesta VII front', 'Ford Fiesta 2018 front left'],
  'citroen-c3-3':      ['Citroën C3 III front', 'Citroen C3 2017 front left'],
}

interface WikimediaPage {
  imageinfo?: Array<{
    url?: string
    thumburl?: string
    width?: number
    height?: number
    extmetadata?: {
      LicenseShortName?: { value: string }
      ImageDescription?: { value: string }
    }
  }>
}

async function searchWikimedia(query: string): Promise<CarImageCandidate[]> {
  const params = new URLSearchParams({
    action:         'query',
    generator:      'search',
    gsrnamespace:   '6',
    gsrsearch:      query,
    gsrlimit:       '10',
    prop:           'imageinfo',
    iiprop:         'url|size|extmetadata',
    iiurlwidth:     '1600',
    format:         'json',
    origin:         '*',
  })
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Drivia/1.0 (https://github.com/lNeo0/drivia)' },
  })
  if (!res.ok) return []

  const data = await res.json()
  const pages: WikimediaPage[] = Object.values(data?.query?.pages ?? {})

  const candidates: CarImageCandidate[] = []
  for (const page of pages) {
    const info = page.imageinfo?.[0]
    if (!info) continue

    const imageUrl = info.thumburl ?? info.url
    if (!imageUrl) continue
    if (imageUrl.endsWith('.svg') || imageUrl.endsWith('.SVG')) continue

    const width = info.width ?? 0
    const height = info.height ?? 0
    if (width < 800 || height < 400) continue

    candidates.push({
      url: imageUrl,
      width,
      height,
      source: 'wikimedia',
      license: info.extmetadata?.LicenseShortName?.value,
      description: info.extmetadata?.ImageDescription?.value?.replace(/<[^>]+>/g, '').slice(0, 200),
    })
  }
  return candidates
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function findCandidates(carId: string): Promise<CarImageCandidate[]> {
  const queries = SEARCH_TERMS[carId] ?? []
  if (!queries.length) {
    console.log(`  [search] No search terms for ${carId}`)
    return []
  }

  const seen = new Set<string>()
  const all: CarImageCandidate[] = []

  for (const query of queries) {
    console.log(`  [search] Querying Wikimedia: "${query}"`)
    const results = await searchWikimedia(query)
    for (const c of results) {
      if (!seen.has(c.url)) {
        seen.add(c.url)
        all.push(c)
      }
    }
    await sleep(300)
  }

  console.log(`  [search] Found ${all.length} unique candidates for ${carId}`)
  return all
}
