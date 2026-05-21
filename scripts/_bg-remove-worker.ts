import { config } from 'dotenv'
import path from 'node:path'
config({ path: path.resolve(process.cwd(), '.env') })
config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

import { removeBackground } from '@imgly/background-removal-node'

const url = process.argv[2]
if (!url) {
  process.stderr.write('Usage: tsx _bg-remove-worker.ts <imageUrl>\n')
  process.exit(1)
}

const res = await fetch(url, {
  headers: { 'User-Agent': 'Drivia/1.0' },
})
if (!res.ok) {
  process.stderr.write(`HTTP ${res.status}\n`)
  process.exit(1)
}

const contentType = res.headers.get('content-type')?.split(';')[0].trim() || 'image/jpeg'
const arrayBuffer = await res.arrayBuffer()
const blob = new Blob([arrayBuffer], { type: contentType })

const result = await removeBackground(blob, {
  model: 'small',
  output: { format: 'image/png' },
})

const resultBuffer = Buffer.from(await result.arrayBuffer())
process.stdout.write(resultBuffer.toString('base64'))
