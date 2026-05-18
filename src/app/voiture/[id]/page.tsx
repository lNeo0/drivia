import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import MotorisationCards from '@/components/MotorisationCards'
import { getVoitureById, voitures } from '@/lib/data'
import { getReliabilityColor } from '@/lib/reliability'
import { getScoreAchat } from '@/lib/score'

export async function generateStaticParams() {
  return voitures.map((v) => ({ id: v.id }))
}

const starsMap: Record<number, string> = {
  5: '★★★★★', 4: '★★★★☆', 3: '★★★☆☆', 2: '★★☆☆☆', 1: '★☆☆☆☆',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-3
        text-muted font-body">
        {title}
      </p>
      {children}
    </section>
  )
}

export default async function VoiturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const voiture = getVoitureById(id)
  if (!voiture) notFound()

  const color = getReliabilityColor(voiture.fiabilite.note)
  const score = getScoreAchat(voiture)
  const puissances = voiture.motorisations.map((m) => m.puissance)
  const pMin = Math.min(...puissances)
  const pMax = Math.max(...puissances)

  return (
    <div className="min-h-screen bg-base text-primary">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href="/voitures"
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium mb-10
            font-body text-muted hover:text-secondary transition-colors duration-150"
        >
          <span style={{ color: 'var(--accent-gold)' }}>‹</span>
          Toutes les voitures
        </Link>

        {/* Header */}
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-3
            text-muted font-body">
            {voiture.segment} · {voiture.annees}
          </p>
          <h1 className="font-display font-semibold tracking-[-0.02em] leading-[1.05] text-primary"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
            {voiture.marque}{' '}
            <em className="text-gold not-italic">{voiture.modele}</em>
          </h1>
          <div className="mt-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-[0.8125rem] font-semibold font-body"
              style={{
                color: score.color,
                background: score.bg,
                border: `1px solid ${score.border}`,
              }}
            >
              <span className="text-[0.875rem] leading-none">{score.icon}</span>
              {score.label}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: 'Poids',         value: voiture.poids,                                 unit: 'kg'       },
            { label: 'Puissance',     value: pMin === pMax ? `${pMin}` : `${pMin}–${pMax}`, unit: 'ch'       },
            { label: 'Motorisations', value: voiture.motorisations.length,                  unit: 'versions' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="rounded-2xl p-5 text-center border border-rim bg-surface"
              style={{ boxShadow: 'var(--shadow-sm)' }}>
              <p className="font-display text-[2rem] font-bold tabular-nums text-gold">{value}</p>
              <p className="text-[0.6875rem] mt-1 font-body text-muted">{unit}</p>
              <p className="text-[0.6875rem] mt-1 font-body text-secondary">{label}</p>
            </div>
          ))}
        </div>

        {/* Fiabilité générale */}
        <Section title="Fiabilité générale">
          <div
            className="rounded-2xl p-6"
            style={{
              background: color.bg,
              border: `1px solid ${color.border}`,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-start gap-6 mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0
                  font-display text-2xl font-bold"
                style={{
                  color: color.text,
                  background: color.bg,
                  border: `1.5px solid ${color.border}`,
                }}
              >
                {voiture.fiabilite.note}
              </div>
              <div>
                <p className="text-[1.125rem] font-semibold font-body" style={{ color: color.text }}>
                  {color.fullLabel}
                </p>
                <p
                  className="text-[0.875rem] mt-0.5 tracking-wide"
                  style={{ color: color.text, opacity: 0.7 }}
                >
                  {starsMap[voiture.fiabilite.note]}
                </p>
              </div>
            </div>
            <p className="text-[0.9375rem] leading-relaxed font-body text-secondary">
              {voiture.fiabilite.avisGeneral}
            </p>
          </div>
        </Section>

        {/* Points sensibles */}
        <Section title="Points sensibles">
          <ul className="space-y-2.5">
            {voiture.fiabilite.pointsSensibles.map((point, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-[12px] border border-rim bg-surface">
                <span className="shrink-0 mt-0.5 text-warning">▲</span>
                <span className="text-[0.9375rem] leading-relaxed font-body text-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Pannes fréquentes */}
        <Section title="Pannes fréquentes">
          <ul className="space-y-2.5">
            {voiture.fiabilite.pannesFrequentes.map((panne, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-[12px] border border-rim bg-surface">
                <span className="shrink-0 mt-0.5 text-danger">✕</span>
                <span className="text-[0.9375rem] leading-relaxed font-body text-secondary">{panne}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Motorisations */}
        <Section title="Motorisations disponibles">
          <MotorisationCards motorisations={voiture.motorisations} voitureId={voiture.id} />
        </Section>

        {/* Checklist */}
        <Section title="Checklist de visite">
          <div className="rounded-2xl border border-rim bg-surface overflow-hidden"
            style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="px-6 py-4 border-b border-rim bg-elevated">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em]
                font-body text-muted">
                À vérifier lors de votre inspection avant achat
              </p>
            </div>
            <ul className="p-6 space-y-3">
              {voiture.checklist.map((item, i) => (
                <li key={i} className="flex gap-4 text-[0.9375rem]">
                  <span className="shrink-0 w-6 h-6 rounded-[6px] flex items-center justify-center
                    text-[0.75rem] font-semibold border border-rim-strong bg-elevated
                    font-body text-muted">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed font-body text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <div className="mt-12 pt-8 text-center border-t border-rim">
          <Link href="/voitures"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium font-body
              text-muted hover:text-secondary transition-colors duration-150">
            <span style={{ color: 'var(--accent-gold)' }}>‹</span>
            Retour à toutes les voitures
          </Link>
        </div>
      </div>
    </div>
  )
}
