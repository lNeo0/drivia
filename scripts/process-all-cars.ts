import { config } from 'dotenv'
import path from 'node:path'

config({ path: path.resolve(process.cwd(), '.env') })
config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

import { processAllCars } from '../src/lib/pipeline/pipeline'

const CAR_IDS = [
  'volkswagen-golf-7',
  'renault-clio-4',
  'peugeot-308-2',
  'toyota-yaris-3',
  'bmw-m3-e92',
  'bmw-serie3-f30',
  'dacia-sandero-2',
  'ford-fiesta-7',
  'citroen-c3-3',
]

async function main() {
  const results = await processAllCars(CAR_IDS)
  const anyFailed = results.some(r => !r.success)
  process.exit(anyFailed ? 1 : 0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
