import { prisma } from '@/lib/db'

export async function getCarImageFromDb(carId: string): Promise<string | null> {
  try {
    const image = await prisma.carImage.findUnique({
      where: { carId },
      select: { publicUrl: true },
    })
    return image?.publicUrl ?? null
  } catch {
    return null
  }
}

export async function getAllCarImagesFromDb(): Promise<Record<string, string>> {
  try {
    const images = await prisma.carImage.findMany({
      select: { carId: true, publicUrl: true },
    })
    return Object.fromEntries(images.map((img) => [img.carId, img.publicUrl]))
  } catch {
    return {}
  }
}
