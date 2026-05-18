import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = `https://upload.wikimedia.org/${path.join('/')}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Drivia/1.0 (https://github.com/lNeo0/drivia)',
    },
  })

  if (!response.ok) {
    return new NextResponse(null, { status: response.status })
  }

  const contentType = response.headers.get('content-type') ?? 'image/jpeg'
  const buffer = await response.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
