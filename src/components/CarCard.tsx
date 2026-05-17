import Link from 'next/link'
import type { Voiture } from '@/types'

type Props = { voiture: Voiture }

const scoreConfig: Record<number, { label: string; color: string }> = {
  5: { label: 'Excellente', color: 'var(--success)' },
  4: { label: 'Bonne',      color: 'var(--success)' },
  3: { label: 'Moyenne',    color: 'var(--warning)' },
  2: { label: 'Passable',   color: 'var(--warning)' },
  1: { label: 'Fragile',    color: 'var(--danger)'  },
}

export default function CarCard({ voiture }: Props) {
  const score = scoreConfig[voiture.fiabilite.note]
  const puissances = voiture.motorisations.map((m) => m.puissance)
  const pMin = Math.min(...puissances)
  const pMax = Math.max(...puissances)
  const puissance = pMin === pMax ? `${pMin}` : `${pMin}–${pMax}`

  return (
    <Link
      href={`/voiture/${voiture.id}`}
      className="group block rounded-2xl overflow-hidden
        bg-[var(--bg-surface)] border border-[var(--border-default)]
        transition-[transform,box-shadow] duration-200 ease-out
        hover:-translate-y-[3px]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md), 0 0 0 1px var(--border-strong)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em]
              text-[var(--text-muted)] mb-1.5 font-[family-name:var(--font-dm-sans)]">
              {voiture.marque}
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-[1.375rem] font-semibold
              text-[var(--text-primary)] leading-tight
              group-hover:text-[var(--accent-gold)] transition-colors duration-150">
              {voiture.modele}
            </h2>
            <p className="text-[0.8125rem] text-[var(--text-secondary)] mt-1
              font-[family-name:var(--font-dm-sans)]">
              {voiture.segment} · {voiture.annees}
            </p>
          </div>

          {/* Score badge */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center
                text-[0.8125rem] font-bold text-white font-[family-name:var(--font-dm-sans)]"
              style={{ backgroundColor: score.color }}
            >
              {voiture.fiabilite.note}
            </div>
            <span className="text-[0.625rem] uppercase tracking-[0.08em] font-semibold
              font-[family-name:var(--font-dm-sans)]"
              style={{ color: score.color }}>
              {score.label}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="sep-fade mb-4" />

        {/* Specs */}
        <div className="flex items-center gap-4 text-[0.8125rem] text-[var(--text-secondary)]
          font-[family-name:var(--font-dm-sans)] mb-4">
          <span>
            <span className="text-[var(--text-primary)] font-medium">{puissance}</span> ch
          </span>
          <span className="text-[var(--border-strong)]">·</span>
          <span>
            <span className="text-[var(--text-primary)] font-medium">{voiture.poids}</span> kg
          </span>
          <span className="text-[var(--border-strong)]">·</span>
          <span>{voiture.motorisations.length} motorisations</span>
        </div>

        <p className="text-[0.875rem] text-[var(--text-secondary)] line-clamp-2 leading-relaxed
          font-[family-name:var(--font-dm-sans)] mb-5">
          {voiture.fiabilite.avisGeneral}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px]
              border border-[var(--border-strong)] text-[0.8125rem] font-semibold
              uppercase tracking-[0.05em] text-[var(--text-secondary)]
              group-hover:bg-[var(--accent-gold)] group-hover:text-[#0D0D0D]
              group-hover:border-[var(--accent-gold)]
              transition-all duration-150 font-[family-name:var(--font-dm-sans)]"
          >
            Voir la fiche
            <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
