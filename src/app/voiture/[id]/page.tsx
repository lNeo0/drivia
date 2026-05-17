import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import MotorisationCards from '@/components/MotorisationCards'
import { getVoitureById, voitures } from '@/lib/data'

export async function generateStaticParams() {
  return voitures.map((v) => ({ id: v.id }))
}

const scoreConfig: Record<number, { label: string; bg: string; color: string }> = {
  5: { label: 'Excellente fiabilité', bg: 'var(--success)',  color: 'var(--success)'  },
  4: { label: 'Bonne fiabilité',      bg: 'var(--success)',  color: 'var(--success)'  },
  3: { label: 'Fiabilité moyenne',    bg: 'var(--warning)',  color: 'var(--warning)'  },
  2: { label: 'Fiabilité passable',   bg: 'var(--warning)',  color: 'var(--warning)'  },
  1: { label: 'Fiabilité fragile',    bg: 'var(--danger)',   color: 'var(--danger)'   },
}

const starsMap: Record<number, string> = {
  5: '★★★★★', 4: '★★★★☆', 3: '★★★☆☆', 2: '★★☆☆☆', 1: '★☆☆☆☆',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-2
        font-[family-name:var(--font-dm-sans)]"
        style={{ color: 'var(--text-muted)' }}>
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

  const score = scoreConfig[voiture.fiabilite.note]
  const puissances = voiture.motorisations.map((m) => m.puissance)
  const pMin = Math.min(...puissances)
  const pMax = Math.max(...puissances)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href="/recherche"
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium mb-10
            font-[family-name:var(--font-dm-sans)] transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          ← Toutes les voitures
        </Link>

        {/* Header */}
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-3
            font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--text-muted)' }}>
            {voiture.segment} · {voiture.annees}
          </p>
          <h1
            className="font-[family-name:var(--font-cormorant)] font-semibold
              tracking-[-0.02em] leading-[1.05]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            {voiture.marque}{' '}
            <em style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>{voiture.modele}</em>
          </h1>
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: 'Poids',         value: voiture.poids,                                              unit: 'kg'       },
            { label: 'Puissance',     value: pMin === pMax ? `${pMin}` : `${pMin}–${pMax}`,              unit: 'ch'       },
            { label: 'Motorisations', value: voiture.motorisations.length,                               unit: 'versions' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="rounded-[16px] p-5 text-center border"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
              <p className="font-[family-name:var(--font-cormorant)] text-[2rem] font-bold tabular-nums"
                style={{ color: 'var(--accent-gold)' }}>
                {value}
              </p>
              <p className="text-[0.6875rem] mt-1 font-[family-name:var(--font-dm-sans)]"
                style={{ color: 'var(--text-muted)' }}>
                {unit}
              </p>
              <p className="text-[0.6875rem] mt-1 font-[family-name:var(--font-dm-sans)]"
                style={{ color: 'var(--text-secondary)' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Fiabilité générale */}
        <Section title="Fiabilité générale">
          <div className="rounded-[16px] p-6 border"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-start gap-6 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                style={{ background: score.color }}>
                <span className="text-2xl font-bold text-white font-[family-name:var(--font-cormorant)]">
                  {voiture.fiabilite.note}
                </span>
              </div>
              <div>
                <p className="text-[1.125rem] font-semibold font-[family-name:var(--font-dm-sans)]"
                  style={{ color: score.color }}>
                  {score.label}
                </p>
                <p className="text-[0.875rem] mt-0.5 tracking-wide"
                  style={{ color: score.color, opacity: 0.6 }}>
                  {starsMap[voiture.fiabilite.note]}
                </p>
              </div>
            </div>
            <p className="text-[0.9375rem] leading-relaxed font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--text-secondary)' }}>
              {voiture.fiabilite.avisGeneral}
            </p>
          </div>
        </Section>

        {/* Points sensibles */}
        <Section title="Points sensibles">
          <ul className="space-y-2.5">
            {voiture.fiabilite.pointsSensibles.map((point, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-[12px] border"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
                <span className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }}>▲</span>
                <span className="text-[0.9375rem] leading-relaxed font-[family-name:var(--font-dm-sans)]"
                  style={{ color: 'var(--text-secondary)' }}>
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Pannes fréquentes */}
        <Section title="Pannes fréquentes">
          <ul className="space-y-2.5">
            {voiture.fiabilite.pannesFrequentes.map((panne, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-[12px] border"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
                <span className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }}>✕</span>
                <span className="text-[0.9375rem] leading-relaxed font-[family-name:var(--font-dm-sans)]"
                  style={{ color: 'var(--text-secondary)' }}>
                  {panne}
                </span>
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
          <div className="rounded-[16px] border overflow-hidden"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
            <div className="px-6 py-4 border-b"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em]
                font-[family-name:var(--font-dm-sans)]"
                style={{ color: 'var(--text-muted)' }}>
                À vérifier lors de votre inspection avant achat
              </p>
            </div>
            <ul className="p-6 space-y-3">
              {voiture.checklist.map((item, i) => (
                <li key={i} className="flex gap-4 text-[0.9375rem]">
                  <span
                    className="shrink-0 w-6 h-6 rounded-[6px] flex items-center justify-center
                      text-[0.75rem] font-semibold border font-[family-name:var(--font-dm-sans)]"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border-strong)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed font-[family-name:var(--font-dm-sans)]"
                    style={{ color: 'var(--text-secondary)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid var(--border-default)' }}>
          <Link href="/recherche"
            className="text-[0.875rem] font-medium font-[family-name:var(--font-dm-sans)]
              transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            ← Retour à toutes les voitures
          </Link>
        </div>
      </div>
    </div>
  )
}
