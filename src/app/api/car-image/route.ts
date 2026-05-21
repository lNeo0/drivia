import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.VEHICLE_IMAGERY_API_KEY!
const BASE = 'https://api.vehicleimagery.com/api'

async function viGet(path: string) {
  const url = `${BASE}${path}`
  console.log('[car-image] GET', url)
  const res = await fetch(url, {
    headers: { 'x-api-key': API_KEY },
    next: { revalidate: 86400 },
  })
  console.log('[car-image] status', res.status, res.statusText)
  const text = await res.text()
  console.log('[car-image] body', text.slice(0, 500))
  if (!res.ok) return null
  try { return JSON.parse(text) } catch { return null }
}

// API slugs (lowercase) séparés des labels d'affichage
const CAR_MAPPING: Record<string, { make: string; model: string; year: number }> = {
  'bmw|3-series|2013': { make: 'bmw', model: '3', year: 2013 },
}

const VIEW_PREFERENCE = ['front_left', 'front', 'side_left', 'side', 'rear_left', 'rear']

function bestView(views: Record<string, boolean | string>): string | null {
  for (const v of VIEW_PREFERENCE) {
    if (views[v] === true) return v
  }
  return Object.keys(views).find(k => views[k] === true) ?? null
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const make  = searchParams.get('make')  ?? ''
  const model = searchParams.get('model') ?? ''
  const year  = searchParams.get('year')  ?? ''

  const key = `${make}|${model}|${year}`
  const mapping = CAR_MAPPING[key]
  if (!mapping) return NextResponse.json({ error: 'Unknown car' }, { status: 404 })

  const { make: apiMake, model: apiModel, year: apiYear } = mapping

  // 1. Variants
  const variantsData = await viGet(`/${apiMake}/${apiModel}/${apiYear}`)
  if (!variantsData) return NextResponse.json({ error: 'No variants' }, { status: 404 })
  const variant: string | undefined = variantsData[0]?.variants?.[0]
  if (!variant) return NextResponse.json({ error: 'No variant' }, { status: 404 })

  // 2. Trims
  const trimsData = await viGet(`/${apiMake}/${apiModel}/${apiYear}/${encodeURIComponent(variant)}`)
  if (!trimsData) return NextResponse.json({ error: 'No trims' }, { status: 404 })
  const trim: string | undefined = trimsData[0]?.trims?.[0]
  if (!trim) return NextResponse.json({ error: 'No trim' }, { status: 404 })

  // 3. Views — l'API retourne un objet {view_name: true|"not_allowed"}
  const viewsData = await viGet(`/${apiMake}/${apiModel}/${apiYear}/${encodeURIComponent(variant)}/${encodeURIComponent(trim)}`)
  if (!viewsData) return NextResponse.json({ error: 'No views' }, { status: 404 })
  const viewsObj: Record<string, boolean | string> = viewsData[0]?.views ?? {}
  const preferredView = bestView(viewsObj)
  if (!preferredView) return NextResponse.json({ error: 'No view' }, { status: 404 })

  // 4. Image
  const imgData = await viGet(`/${apiMake}/${apiModel}/${apiYear}/${encodeURIComponent(variant)}/${encodeURIComponent(trim)}/${encodeURIComponent(preferredView)}`)
  if (!imgData) return NextResponse.json({ error: 'No image' }, { status: 404 })

  const imageUrl: string | undefined = Array.isArray(imgData)
    ? imgData[0]?.image_url
    : imgData?.image_url

  if (!imageUrl) return NextResponse.json({ error: 'No image_url' }, { status: 404 })

  return NextResponse.redirect(imageUrl, 302)
}
