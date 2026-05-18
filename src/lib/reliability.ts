export type ReliabilityColors = {
  text: string
  bg: string
  border: string
  label: string
  fullLabel: string
}

const configs: Record<number, ReliabilityColors> = {
  5: {
    text: '#4CAF7A',
    bg: 'rgba(76,175,122,0.12)',
    border: 'rgba(76,175,122,0.2)',
    label: 'Excellente',
    fullLabel: 'Excellente fiabilité',
  },
  4: {
    text: '#C9A84C',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.2)',
    label: 'Bonne',
    fullLabel: 'Bonne fiabilité',
  },
  3: {
    text: '#D48C3A',
    bg: 'rgba(212,140,58,0.12)',
    border: 'rgba(212,140,58,0.2)',
    label: 'Moyenne',
    fullLabel: 'Fiabilité moyenne',
  },
  2: {
    text: '#C0442E',
    bg: 'rgba(192,68,46,0.12)',
    border: 'rgba(192,68,46,0.2)',
    label: 'Passable',
    fullLabel: 'Fiabilité passable',
  },
  1: {
    text: '#C0442E',
    bg: 'rgba(192,68,46,0.12)',
    border: 'rgba(192,68,46,0.2)',
    label: 'Fragile',
    fullLabel: 'Fiabilité fragile',
  },
}

export function getReliabilityColor(note: number): ReliabilityColors {
  return configs[note] ?? configs[1]
}
