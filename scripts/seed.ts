import { config } from 'dotenv'
import path from 'node:path'

config({ path: path.resolve(process.cwd(), '.env') })
config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { voitures } from '../src/lib/data'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter, log: ['error'] })

async function main() {
  for (const voiture of voitures) {
    await prisma.car.upsert({
      where: { id: voiture.id },
      update: {
        name: `${voiture.marque} ${voiture.modele}`,
        make: voiture.marque,
        model: voiture.modele,
        year: voiture.anneeDebut,
        segment: voiture.segment,
      },
      create: {
        id: voiture.id,
        name: `${voiture.marque} ${voiture.modele}`,
        make: voiture.marque,
        model: voiture.modele,
        year: voiture.anneeDebut,
        segment: voiture.segment,
      },
    })

    for (const moto of voiture.motorisations) {
      const transmission = moto.boites[0].designation

      await prisma.motorisation.upsert({
        where: { id: `${voiture.id}-${moto.slug}` },
        update: {
          name: moto.designation,
          engine: moto.slug,
          power: moto.puissance,
          fuel: moto.type,
          transmission,
        },
        create: {
          id: `${voiture.id}-${moto.slug}`,
          carId: voiture.id,
          name: moto.designation,
          engine: moto.slug,
          power: moto.puissance,
          fuel: moto.type,
          transmission,
        },
      })
    }

    console.log(`✓ ${voiture.marque} ${voiture.modele} (${voiture.motorisations.length} motorisations)`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
