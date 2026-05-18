import Link from 'next/link'
import type { Voiture } from '@/types'
import { getReliabilityColor } from '@/lib/reliability'
import { getScoreAchat } from '@/lib/score'
import CardImage from '@/components/CardImage'

type Props = { voiture: Voiture }

export default function CarCard({ voiture }: Props) {
  const color = getReliabilityColor(voiture.fiabilite.note)
  const score = getScoreAchat(voiture)
  const puissances = voiture.motorisations.map((m) => m.puissance)
  const pMin = Math.min(...puissances)
  const pMax = Math.max(...puissances)
  const puissance = pMin === pMax ? `${pMin}` : `${pMin}–${pMax}`

  return (
    <Link
      href={`/voiture/${voiture.id}`}
      className="group block rounded-2xl overflow-hidden card-hover
        bg-surface border border-rim"
    >
      {/* Image banner 120px */}
      <CardImage src={voiture.image} alt={`${voiture.marque} ${voiture.modele}`} />

      {/* Body */}
      <div style={{ padding: '20px' }}>

        {/* Header: name left / reliability right */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em]
              text-muted mb-1 font-body">
              {voiture.marque}
            </p>
            <h2 className="font-display text-[1.25rem] font-semibold
              text-primary leading-tight
              group-hover:text-gold transition-colors duration-150">
              {voiture.modele}
            </h2>
            <p className="text-[0.8rem] text-secondary mt-0.5 font-body">
              {voiture.segment} · {voiture.annees}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-1">
            <div
              className="w-[48px] h-[48px] rounded-full flex items-center justify-center
                font-display text-[1.125rem] font-bold"
              style={{
                color: color.text,
                background: color.bg,
                border: `1.5px solid ${color.border}`,
              }}
            >
              {voiture.fiabilite.note}
            </div>
            <span
              className="text-[0.6rem] uppercase tracking-[0.08em] font-semibold font-body"
              style={{ color: color.text }}
            >
              {color.label}
            </span>
          </div>
        </div>

        {/* Specs — separated by a top border */}
        <div
          className="flex items-center gap-3 text-[0.8rem] text-secondary font-body mt-4 pt-4"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <span>
            <span className="text-primary font-medium">{puissance}</span> ch
          </span>
          <span className="text-rim-strong">·</span>
          <span>
            <span className="text-primary font-medium">{voiture.poids}</span> kg
          </span>
          <span className="text-rim-strong">·</span>
          <span>{voiture.motorisations.length} motorisations</span>
        </div>

        {/* Footer: score badge + CTA */}
        <div className="flex items-center justify-between gap-3 mt-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
              text-[0.6875rem] font-semibold font-body"
            style={{
              color: score.color,
              background: score.bg,
              border: `1px solid ${score.border}`,
            }}
          >
            <span className="text-[0.75rem] leading-none">{score.icon}</span>
            {score.label}
          </span>

          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px]
              font-body font-semibold uppercase
              text-[#C9A84C] border border-[#7A5E2A]
              group-hover:bg-[#C9A84C] group-hover:text-[#0D0D0D] group-hover:border-[#C9A84C]
              transition-all duration-150"
            style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}
          >
            Voir la fiche
            <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </span>
        </div>

      </div>
    </Link>
  )
}
