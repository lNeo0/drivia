import { NextRequest, NextResponse } from 'next/server'
import { processCar } from '@/lib/pipeline/pipeline'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { carId, secret, forceReprocess } = body as {
    carId?: string
    secret?: string
    forceReprocess?: boolean
  }

  if (!secret || secret !== process.env.PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!carId || typeof carId !== 'string') {
    return NextResponse.json({ error: 'carId required' }, { status: 400 })
  }

  const result = await processCar(carId, forceReprocess ?? false)
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
