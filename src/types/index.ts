export type TypeMotorisation = 'essence' | 'diesel' | 'hybride' | 'electrique'
export type TypeBoite = 'manuelle' | 'dsg' | 'edc' | 'automatique' | 'cvt'

export type Boite = {
  slug: string
  designation: string
  type: TypeBoite
  consommationOfficielle?: number
}

export type CoteMarche = {
  label: string
  prixBas: number
  prixMoyen: number
  prixHaut: number
}

export type FiabiliteMotorisation = {
  note: number
  avis: string
  problemesConnus: string[]
}

export type Motorisation = {
  slug: string
  designation: string
  type: TypeMotorisation
  puissance: number
  couple?: number
  consommationOfficielle: number
  consommationReelle?: number
  boites: Boite[]
  fiabilite?: FiabiliteMotorisation
  cotes?: CoteMarche[]
  checklistSpecifique?: string[]
}

export type Fiabilite = {
  note: number
  avisGeneral: string
  pointsSensibles: string[]
  pannesFrequentes: string[]
}

export type Voiture = {
  id: string
  marque: string
  modele: string
  annees: string
  segment: string
  poids: number
  motorisations: Motorisation[]
  fiabilite: Fiabilite
  checklist: string[]
}
