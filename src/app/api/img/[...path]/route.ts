import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const prefix = '/api/img/'
  const wikimediaPath = pathname.slice(prefix.length)
  const url = `https://upload.wikimedia.org/${wikimediaPath}`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Drivia/1.0 (https://github.com/lNeo0/drivia)',
      },
    })

    if (!response.ok) {
      return new NextResponse(null, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
