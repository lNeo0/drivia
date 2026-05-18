import type { Voiture } from '@/types'

export type ScoreAchat = {
  label: string
  icon: string
  color: string
  bg: string
  border: string
  isCollector?: boolean
}

const COLLECTOR_IDS = new Set(['bmw-m3-e92'])

const HIGH_POP_SEGMENTS = new Set(['Citadine', 'Compacte'])
const MED_POP_SEGMENTS  = new Set(['Berline', 'SUV compact', 'SUV', 'Monospace'])

function segmentPopularity(segment: string): number {
  if (HIGH_POP_SEGMENTS.has(segment)) return 20
  if (MED_POP_SEGMENTS.has(segment))  return 10
  return 5
}

export function getScoreAchat(voiture: Voiture): ScoreAchat {
  if (COLLECTOR_IDS.has(voiture.id)) {
    return {
      label: 'Collector',
      icon: '★',
      color: '#C9A84C',
      bg: 'rgba(201,168,76,0.12)',
      border: 'rgba(201,168,76,0.3)',
      isCollector: true,
    }
  }

  const fiabiliteScore = voiture.fiabilite.note * 12         // max 60
  const motorisationScore = Math.min(voiture.motorisations.length * 5, 20) // max 20
  const populariteScore = segmentPopularity(voiture.segment) // max 20
  const total = fiabiliteScore + motorisationScore + populariteScore       // max 100

  if (total >= 70) {
    return {
      label: 'Bon achat',
      icon: '✓',
      color: '#4CAF7A',
      bg: 'rgba(76,175,122,0.10)',
      border: 'rgba(76,175,122,0.25)',
    }
  }
  if (total >= 45) {
    return {
      label: 'À étudier',
      icon: '⚡',
      color: '#C9A84C',
      bg: 'rgba(201,168,76,0.10)',
      border: 'rgba(201,168,76,0.25)',
    }
  }
  return {
    label: 'Achat risqué',
    icon: '⚠',
    color: '#D48C3A',
    bg: 'rgba(212,140,58,0.10)',
    border: 'rgba(212,140,58,0.25)',
  }
}
