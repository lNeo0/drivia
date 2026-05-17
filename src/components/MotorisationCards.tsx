'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Motorisation } from '@/types'

const typeBadge: Record<string, { bg: string; text: string; label: string }> = {
  essence:    { bg: 'bg-orange-500',  text: 'text-white', label: 'Essence' },
  diesel:     { bg: 'bg-blue-800',    text: 'text-white', label: 'Diesel' },
  hybride:    { bg: 'bg-green-700',   text: 'text-white', label: 'Hybride' },
  electrique: { bg: 'bg-purple-700',  text: 'text-white', label: 'Électrique' },
  gpl:        { bg: 'bg-violet-700',  text: 'text-white', label: 'GPL' },
}

const boiteLabel: Record<string, string> = {
  manuelle:    'Manuelle',
  dsg:         'DSG',
  edc:         'EDC',
  automatique: 'Auto',
  cvt:         'CVT',
}

function MotorisationCard({ m, voitureId }: { m: Motorisation; voitureId: string }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selectedBoite = m.boites[selectedIdx]
  const conso = selectedBoite.consommationOfficielle ?? m.consommationOfficielle
  const badge = typeBadge[m.type] ?? { bg: 'bg-zinc-700', text: 'text-white', label: m.type }
  const hasDetail = !!(m.fiabilite || m.cotes)

  return (
    <div
      className="rounded-[16px] flex flex-col gap-5 p-5
        border transition-all duration-200"
      style={{
        background: 'var(--bg-elevated)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-strong)'
        el.style.background = 'var(--bg-subtle)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-default)'
        el.style.background = 'var(--bg-elevated)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className={`inline-flex items-center text-[0.6875rem] font-semibold
            uppercase tracking-[0.1em] px-2 py-0.5 rounded-[6px]
            font-[family-name:var(--font-dm-sans)] ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <h3 className="text-[1rem] font-semibold text-[var(--text-primary)]
            font-[family-name:var(--font-dm-sans)] leading-snug">
            {m.designation}
          </h3>
        </div>
        {hasDetail && (
          <span className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]
            px-2 py-0.5 rounded-[6px] font-[family-name:var(--font-dm-sans)]"
            style={{ background: 'var(--accent-gold-dim)', color: 'var(--accent-gold)' }}>
            Fiche complète
          </span>
        )}
      </div>

      {/* Specs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: m.puissance, unit: 'ch',    label: 'Puissance', available: true },
          { value: m.couple,    unit: 'Nm',    label: 'Couple',    available: !!m.couple },
          { value: conso.toFixed(1), unit: 'L/100', label: 'Conso.', available: true },
        ].map(({ value, unit, label, available }) => (
          <div key={label} className="rounded-[10px] p-3 text-center"
            style={{ background: 'var(--bg-base)' }}>
            <p className="font-[family-name:var(--font-cormorant)] text-[1.5rem] font-bold leading-none"
              style={{ color: available ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              {available ? value : '—'}
            </p>
            <p className="text-[0.6875rem] mt-1.5 font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--text-muted)' }}>
              {unit}
            </p>
          </div>
        ))}
      </div>

      {/* Gearbox selector */}
      {m.boites.length > 1 ? (
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2
            font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--text-muted)' }}>
            Boîte de vitesses
          </p>
          <div className="flex gap-2 p-1 rounded-[10px]" style={{ background: 'var(--bg-base)' }}>
            {m.boites.map((b, idx) => (
              <button
                key={b.slug}
                onClick={() => setSelectedIdx(idx)}
                className="flex-1 text-[0.8125rem] font-semibold py-2 px-3 rounded-[7px]
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
                <span className="ml-1 font-normal text-[0.6875rem] opacity-70">
                  {boiteLabel[b.type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[0.8125rem] font-[family-name:var(--font-dm-sans)]"
          style={{ color: 'var(--text-secondary)' }}>
          Boîte ·{' '}
          <span style={{ color: 'var(--text-primary)' }} className="font-medium">
            {m.boites[0].designation} {boiteLabel[m.boites[0].type]}
          </span>
        </p>
      )}

      {/* CTA */}
      <Link
        href={`/voiture/${voitureId}/${m.slug}?boite=${selectedBoite.slug}`}
        className="mt-auto flex items-center justify-center gap-2 rounded-[10px]
          py-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.05em]
          border font-[family-name:var(--font-dm-sans)]
          transition-all duration-150"
        style={{
          borderColor: 'var(--border-strong)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--accent-gold)'
          el.style.color = '#0D0D0D'
          el.style.borderColor = 'var(--accent-gold)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'transparent'
          el.style.color = 'var(--text-secondary)'
          el.style.borderColor = 'var(--border-strong)'
        }}
      >
        Voir la fiche détaillée →
      </Link>
    </div>
  )
}

type Props = { motorisations: Motorisation[]; voitureId: string }

export default function MotorisationCards({ motorisations, voitureId }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {motorisations.map((m) => (
        <MotorisationCard key={m.slug} m={m} voitureId={voitureId} />
      ))}
    </div>
  )
}
