// Associe (marque affichée, modèle affiché) → slug API utilisé comme clé dans CAR_MAPPING de route.ts
const MODEL_OVERRIDES: Record<string, string> = {
  'Série 3 F30': '3-series',
}

export function getCarImageUrl(marque: string, modele: string, anneeDebut: number): string {
  const make  = marque.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const model = MODEL_OVERRIDES[modele] ?? modele.split(' ')[0].toLowerCase()
  const year  = String(anneeDebut)

  const params = new URLSearchParams({ make, model, year })
  return `/api/car-image?${params}`
}
