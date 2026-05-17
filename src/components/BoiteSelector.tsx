'use client'

import { useState } from 'react'
import type { Boite } from '@/types'

const boiteTypeLabel: Record<string, string> = {
  manuelle:    'Manuelle',
  dsg:         'DSG',
  edc:         'EDC',
  automatique: 'Automatique',
  cvt:         'CVT',
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
  boites, defaultSlug, puissance, couple, consommationBase, consommationReelle,
}: Props) {
  const defaultIdx = Math.max(0, boites.findIndex((b) => b.slug === defaultSlug))
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx)

  const selectedBoite = boites[selectedIdx]
  const conso = selectedBoite.consommationOfficielle ?? consommationBase

  const specs = [
    { label: 'Puissance',      value: `${puissance}`,                  unit: 'ch',    available: true },
    { label: 'Couple',         value: couple ? `${couple}` : null,     unit: 'Nm',    available: !!couple },
    { label: 'Conso. off.',    value: conso.toFixed(1),                 unit: 'L/100', available: true },
    { label: 'Conso. réelle',  value: consommationReelle?.toFixed(1) ?? null, unit: 'L/100', available: !!consommationReelle },
  ]

  return (
    <div className="space-y-6">
      {/* Gearbox selector */}
      {boites.length > 1 ? (
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-3
            font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--text-muted)' }}>
            Boîte de vitesses
          </p>
          <div className="inline-flex gap-1 p-1 rounded-[10px]"
            style={{ background: 'var(--bg-elevated)' }}>
            {boites.map((b, idx) => (
              <button
                key={b.slug}
                onClick={() => setSelectedIdx(idx)}
                className="h-[38px] px-5 rounded-[7px] text-[0.875rem] font-semibold
                  cursor-pointer transition-all duration-150
                  font-[family-name:var(--font-dm-sans)]"
                style={idx === selectedIdx ? {
                  background: 'var(--accent-gold)',
                  color: '#0D0D0D',
                } : {
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (idx !== selectedIdx) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (idx !== selectedIdx) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                  }
                }}
              >
                {b.designation}
                <span className="ml-1.5 font-normal text-[0.75rem] opacity-60">
                  {boiteTypeLabel[b.type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-[0.875rem] font-[family-name:var(--font-dm-sans)]">
          <span style={{ color: 'var(--text-secondary)' }}>Boîte</span>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {boites[0].designation}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>({boiteTypeLabel[boites[0].type]})</span>
        </div>
      )}

      {/* Specs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {specs.map(({ label, value, unit, available }) => (
          <div key={label} className="rounded-[12px] p-5 text-center"
            style={{ background: 'var(--bg-elevated)' }}>
            <p className="font-[family-name:var(--font-cormorant)] text-[2rem] font-bold
              leading-none tabular-nums"
              style={{ color: available && value ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              {available && value ? value : '—'}
            </p>
            <p className="text-[0.6875rem] mt-1.5 font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--text-muted)' }}>
              {unit}
            </p>
            <p className="text-[0.6875rem] mt-1 leading-tight font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--text-secondary)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
