import { put } from '@vercel/blob'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

let _client: PrismaClient | null = null

function getClient(): PrismaClient {
  if (!_client) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
    _client = new PrismaClient({ adapter, log: ['error'] })
  }
  return _client
}

export async function uploadCarImage(carId: string, buffer: Buffer): Promise<string> {
  console.log(`  [storage] Uploading to Vercel Blob…`)
  const blob = await put(`car-images/${carId}.webp`, buffer, {
    access: 'public',
    contentType: 'image/webp',
  })

  console.log(`  [storage] Saving URL to DB…`)
  await getClient().carImage.upsert({
    where: { carId },
    update: {
      publicUrl: blob.url,
      width: 1600,
      height: 900,
      processedAt: new Date(),
    },
    create: {
      carId,
      publicUrl: blob.url,
      width: 1600,
      height: 900,
    },
  })

  return blob.url
}

export async function getStoredImageUrl(carId: string): Promise<string | null> {
  const record = await getClient().carImage.findUnique({ where: { carId } })
  return record?.publicUrl ?? null
}
