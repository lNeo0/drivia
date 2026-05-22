import { config } from 'dotenv'
import path from 'node:path'

config({ path: path.resolve(process.cwd(), '.env') })
config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

import { processCar } from '../src/lib/pipeline/pipeline'

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
  console.log('🚀 Drivia Image Pipeline — Reprocessing ALL cars')
  console.log(`📸 ${CAR_IDS.length} cars to process with remove.bg\n`)

  const results = []

  for (const carId of CAR_IDS) {
    console.log(`\n${'─'.repeat(50)}`)
    const result = await processCar(carId, true)
    results.push(result)

    if (result.success) {
      console.log(`✅ ${carId} — OK`)
    } else {
      console.log(`❌ ${carId} — FAILED: ${result.error}`)
    }

    if (CAR_IDS.indexOf(carId) < CAR_IDS.length - 1) {
      console.log('  ⏳ Waiting 3s...')
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log('📊 FINAL RESULTS:')
  const ok = results.filter(r => r.success)
  const ko = results.filter(r => !r.success)
  console.log(`  ✅ Success: ${ok.length}/${results.length}`)
  if (ko.length > 0) {
    console.log(`  ❌ Failed:`)
    ko.forEach(r => console.log(`     - ${r.carId}: ${r.error}`))
  }

  ok.forEach(r => console.log(`  🖼️  ${r.carId}: ${r.publicUrl}`))

  process.exit(ko.length > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
