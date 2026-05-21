export type TypeMotorisation = 'essence' | 'diesel' | 'hybride' | 'electrique'
export type TypeBoite = 'manuelle' | 'dsg' | 'edc' | 'automatique' | 'cvt'
export type ImportanceOption = 'indispensable' | 'interessante' | 'inutile'
export type TypeMoteur = 'turbo' | 'atmospherique' | 'hybride' | 'electrique'

export type Option = {
  nom: string
  description: string
  importance: ImportanceOption
  avis: string
}

export type StageReprog = {
  nom: string
  puissanceGain: number
  coupleGain: number
  puissanceFinal: number
  coupleFinal: number
  cout: string
  avis: string
}

export type PotentielReprog = {
  typeMoteur: TypeMoteur
  avisGeneral: string
  stages: StageReprog[]
  recommandation: 'oui' | 'non' | 'selon_usage'
  raisonRecommandation: string
}

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
  options?: Option[]
  potentielReprog?: PotentielReprog
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
  anneeDebut: number
  segment: string
  poids: number
  motorisations: Motorisation[]
  fiabilite: Fiabilite
  checklist: string[]
}
