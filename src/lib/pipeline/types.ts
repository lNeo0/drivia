export interface CarImageCandidate {
  url: string
  width: number
  height: number
  source: 'wikimedia' | 'fallback'
  license?: string
  description?: string
}

export interface ScoredCandidate extends CarImageCandidate {
  score: number
  reasoning: string
}

export interface PipelineResult {
  success: boolean
  carId: string
  publicUrl?: string
  error?: string
  duration?: number
}
