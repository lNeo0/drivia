import sharp from 'sharp'

const BG_COLOR = { r: 13, g: 13, b: 13, alpha: 1 }
const OUTPUT_WIDTH = 1600
const OUTPUT_HEIGHT = 900
const PADDING_PERCENT = 0.08

async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
  const form = new FormData()
  form.append('image_file', blob, 'car.jpg')
  form.append('size', 'auto')
  form.append('format', 'png')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.REMOVE_BG_API_KEY!,
    },
    body: form,
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`remove.bg error ${response.status}: ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const result = Buffer.from(arrayBuffer)

  if (result.length < 1000) {
    throw new Error('remove.bg returned suspiciously small file')
  }

  console.log(`  [normalize] remove.bg OK — ${(result.length / 1024).toFixed(0)}KB PNG`)
  return result
}

export async function normalizeCarImage(imageUrl: string): Promise<Buffer> {
  console.log(`  [normalize] Downloading...`)
  const response = await fetch(imageUrl, { signal: AbortSignal.timeout(20000) })
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
  const inputBuffer = Buffer.from(await response.arrayBuffer())
  console.log(`  [normalize] Downloaded ${(inputBuffer.length / 1024).toFixed(0)}KB`)

  const resizedForBg = await sharp(inputBuffer)
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92 })
    .toBuffer()

  console.log(`  [normalize] Calling remove.bg...`)
  const transparentBuffer = await removeBackground(resizedForBg)

  const { data, info } = await sharp(transparentBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true })

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0
  const channels = info.channels

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * channels + 3]
      if (alpha > 20) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const carWidth = maxX - minX
  const carHeight = maxY - minY

  if (carWidth < 50 || carHeight < 50) {
    throw new Error('Car bounding box too small — remove.bg may have failed')
  }

  console.log(`  [normalize] Car bbox: ${carWidth}×${carHeight}px`)

  const paddingX = Math.round(OUTPUT_WIDTH * PADDING_PERCENT)
  const paddingY = Math.round(OUTPUT_HEIGHT * PADDING_PERCENT)
  const targetCarWidth = OUTPUT_WIDTH - paddingX * 2
  const targetCarHeight = OUTPUT_HEIGHT - paddingY * 2

  const scaleX = targetCarWidth / carWidth
  const scaleY = targetCarHeight / carHeight
  const scale = Math.min(scaleX, scaleY)

  const scaledCarWidth = Math.round(carWidth * scale)
  const scaledCarHeight = Math.round(carHeight * scale)

  const offsetX = Math.round((OUTPUT_WIDTH - scaledCarWidth) / 2)
  const offsetY = Math.round((OUTPUT_HEIGHT - scaledCarHeight) / 2) + Math.round(OUTPUT_HEIGHT * 0.02)

  const carCropped = await sharp(transparentBuffer)
    .extract({
      left: Math.max(0, minX - 5),
      top: Math.max(0, minY - 5),
      width: Math.min(carWidth + 10, info.width - minX),
      height: Math.min(carHeight + 10, info.height - minY),
    })
    .resize(scaledCarWidth, scaledCarHeight, { fit: 'fill' })
    .toBuffer()

  const finalImage = await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: OUTPUT_HEIGHT,
      channels: 3,
      background: BG_COLOR,
    },
  })
    .composite([
      {
        input: carCropped,
        left: offsetX,
        top: Math.max(0, offsetY),
        blend: 'over',
      },
    ])
    .webp({ quality: 92, effort: 4 })
    .toBuffer()

  console.log(`  [normalize] Final WebP: ${(finalImage.length / 1024).toFixed(0)}KB`)
  return finalImage
}
