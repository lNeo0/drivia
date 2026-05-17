'use client'

import { useState } from 'react'
import type { Boite } from '@/types'

const boiteTypeLabel: Record<string, string> = {
  manuelle: 'Manuelle',
  dsg: 'DSG',
  edc: 'EDC',
  automatique: 'Automatique',
  cvt: 'CVT',
}

type Props = {
  boites: Boite[]
  defaultSlug: string
  puissance: number
  couple: number | undefined
  consommationBase: number
  consommationReelle: number | undefined
}

export default function BoiteSelector({
  boites,
  defaultSlug,
  puissance,
  couple,
  consommationBase,
  consommationReelle,
}: Props) {
  const defaultIdx = Math.max(0, boites.findIndex((b) => b.slug === defaultSlug))
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx)

  const selectedBoite = boites[selectedIdx]
  const conso = selectedBoite.consommationOfficielle ?? consommationBase

  const specs = [
    { label: 'Puissance', value: `${puissance}`, unit: 'ch', available: true },
    { label: 'Couple', value: couple ? `${couple}` : null, unit: 'Nm', available: !!couple },
    { label: 'Conso. officielle', value: conso.toFixed(1), unit: 'L/100', available: true },
    { label: 'Conso. réelle est.', value: consommationReelle?.toFixed(1) ?? null, unit: 'L/100', available: !!consommationReelle },
  ]

  return (
    <div className="space-y-6">
      {/* Sélecteur */}
      {boites.length > 1 ? (
        <div>
          <p className="text-xs text-zinc-600 mb-3">Boîte de vitesses</p>
          <div className="flex gap-2 flex-wrap">
            {boites.map((b, idx) => (
              <button
                key={b.slug}
                onClick={() => setSelectedIdx(idx)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
                  ${idx === selectedIdx
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-raised text-zinc-500 hover:text-zinc-200'
                  }`}
              >
                {b.designation}
                <span className={`ml-1.5 font-normal text-xs ${idx === selectedIdx ? 'text-white/60' : 'text-zinc-700'}`}>
                  {boiteTypeLabel[b.type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-600">Boîte</span>
          <span className="font-semibold text-zinc-300">{boites[0].designation}</span>
          <span className="text-zinc-600">({boiteTypeLabel[boites[0].type]})</span>
        </div>
      )}

      {/* Grille de specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {specs.map(({ label, value, unit, available }) => (
          <div key={label} className="bg-raised rounded-2xl p-5 text-center">
            <p className={`text-3xl font-bold tracking-tight ${available ? 'text-zinc-100' : 'text-zinc-700'}`}>
              {available && value ? value : '—'}
            </p>
            <p className="text-xs text-zinc-500 mt-1.5">{unit}</p>
            <p className="text-[11px] text-zinc-600 mt-1 leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
