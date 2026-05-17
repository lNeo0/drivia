import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import BoiteSelector from '@/components/BoiteSelector'
import { getVoitureEtMotorisation, getAllMotorisationParams } from '@/lib/data'

export async function generateStaticParams() {
  return getAllMotorisationParams()
}

const scoreConfig: Record<number, { label: string; color: string }> = {
  5: { label: 'Excellente', color: 'var(--success)' },
  4: { label: 'Bonne',      color: 'var(--success)' },
  3: { label: 'Moyenne',    color: 'var(--warning)' },
  2: { label: 'Fragile',    color: 'var(--warning)' },
  1: { label: 'Très fragile', color: 'var(--danger)' },
}

const starsMap: Record<number, string> = {
  5: '★★★★★', 4: '★★★★☆', 3: '★★★☆☆', 2: '★★☆☆☆', 1: '★☆☆☆☆',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-3
        font-[family-name:var(--font-dm-sans)]"
        style={{ color: 'var(--text-muted)' }}>
        {title}
      </p>
      {children}
    </section>
  )
}

export default async function MotorisationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; motorisationSlug: string }>
  searchParams: Promise<{ boite?: string }>
}) {
  const { id, motorisationSlug } = await params
  const { boite: boiteSlug = '' } = await searchParams

  const { voiture, motorisation } = getVoitureEtMotorisation(id, motorisationSlug)
  if (!voiture || !motorisation) notFound()

  const defaultBoiteSlug =
    motorisation.boites.find((b) => b.slug === boiteSlug)?.slug ?? motorisation.boites[0].slug

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.8125rem] mb-10
          font-[family-name:var(--font-dm-sans)]"
          style={{ color: 'var(--text-muted)' }}>
          <Link href={`/voiture/${voiture.id}`}
            className="transition-colors duration-150 hover:text-[var(--accent-gold)]"
            style={{ color: 'var(--text-secondary)' }}>
            {voiture.marque} {voiture.modele}
          </Link>
          <span style={{ color: 'var(--accent-gold)' }}>›</span>
          <span>{motorisation.designation}</span>
        </nav>

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
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)' }}
          >
            {voiture.marque}{' '}
            <em style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>{voiture.modele}</em>{' '}
            <span style={{ color: 'var(--text-secondary)', fontStyle: 'normal', fontWeight: 400 }}>
              {motorisation.designation}
            </span>
          </h1>
        </div>

        {/* Specs + sélecteur */}
        <Section title="Specs techniques">
          <div className="rounded-[16px] p-6 border"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
            <BoiteSelector
              boites={motorisation.boites}
              defaultSlug={defaultBoiteSlug}
              puissance={motorisation.puissance}
              couple={motorisation.couple}
              consommationBase={motorisation.consommationOfficielle}
              consommationReelle={motorisation.consommationReelle}
            />
          </div>
        </Section>

        {/* Fiabilité motorisation */}
        {motorisation.fiabilite ? (
          <Section title="Fiabilité de cette motorisation">
            {(() => {
              const f = scoreConfig[motorisation.fiabilite.note]
              return (
                <div className="rounded-[16px] p-6 border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-center gap-6 mb-5">
                    <span
                      className="font-[family-name:var(--font-cormorant)] font-bold leading-none tabular-nums"
                      style={{ fontSize: '4.5rem', color: f.color }}
                    >
                      {motorisation.fiabilite.note}
                    </span>
                    <div>
                      <p className="text-[1.125rem] font-semibold font-[family-name:var(--font-dm-sans)]"
                        style={{ color: f.color }}>
                        {f.label} fiabilité
                      </p>
                      <p className="text-[0.875rem] mt-1 tracking-wide"
                        style={{ color: f.color, opacity: 0.5 }}>
                        {starsMap[motorisation.fiabilite.note]}
                      </p>
                    </div>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed mb-5 font-[family-name:var(--font-dm-sans)]"
                    style={{ color: 'var(--text-secondary)' }}>
                    {motorisation.fiabilite.avis}
                  </p>
                  {motorisation.fiabilite.problemesConnus.length > 0 && (
                    <ul className="space-y-3 pt-5"
                      style={{ borderTop: '1px solid var(--border-default)' }}>
                      {motorisation.fiabilite.problemesConnus.map((p, i) => (
                        <li key={i} className="flex gap-3 text-[0.9375rem]">
                          <span className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }}>✕</span>
                          <span className="leading-relaxed font-[family-name:var(--font-dm-sans)]"
                            style={{ color: 'var(--text-secondary)' }}>
                            {p}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })()}
          </Section>
        ) : (
          <Section title="Fiabilité de cette motorisation">
            <div className="rounded-[16px] p-8 text-center border"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
              <p className="text-[0.9375rem] mb-3 font-[family-name:var(--font-dm-sans)]"
                style={{ color: 'var(--text-muted)' }}>
                Données détaillées non disponibles pour cette motorisation.
              </p>
              <Link href={`/voiture/${voiture.id}`}
                className="text-[0.875rem] transition-colors duration-150
                  font-[family-name:var(--font-dm-sans)]"
                style={{ color: 'var(--accent-gold)' }}>
                Voir la fiabilité générale du modèle →
              </Link>
            </div>
          </Section>
        )}

        {/* Cotes marché */}
        {motorisation.cotes && motorisation.cotes.length > 0 && (
          <Section title="Cotes marché">
            <div className="rounded-[16px] border overflow-hidden"
              style={{ borderColor: 'var(--border-default)' }}>
              {/* Table header */}
              <div className="grid grid-cols-4 border-b"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-strong)' }}>
                {['Tranche', 'Abordable', 'Correct', 'Bon état'].map((h, i) => (
                  <div key={h}
                    className={`px-5 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em]
                      font-[family-name:var(--font-dm-sans)] ${i > 0 ? 'text-center' : ''}`}
                    style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </div>
                ))}
              </div>
              {motorisation.cotes.map((c, i) => (
                <div key={i}
                  className="grid grid-cols-4 border-b last:border-0 transition-colors duration-100"
                  style={{
                    background: i % 2 === 1 ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    borderColor: 'var(--border-default)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 1 ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
                >
                  <div className="px-5 py-4 text-[0.875rem] font-[family-name:var(--font-dm-sans)]"
                    style={{ color: 'var(--text-secondary)' }}>
                    {c.label}
                  </div>
                  <div className="px-5 py-4 text-center font-[family-name:var(--font-cormorant)]
                    text-[0.9375rem] tabular-nums"
                    style={{ color: 'var(--danger)' }}>
                    {c.prixBas.toLocaleString('fr-FR')} €
                  </div>
                  <div className="px-5 py-4 text-center font-[family-name:var(--font-cormorant)]
                    text-[0.9375rem] font-semibold tabular-nums"
                    style={{ color: 'var(--warning)' }}>
                    {c.prixMoyen.toLocaleString('fr-FR')} €
                  </div>
                  <div className="px-5 py-4 text-center font-[family-name:var(--font-cormorant)]
                    text-[0.9375rem] tabular-nums"
                    style={{ color: 'var(--success)' }}>
                    {c.prixHaut.toLocaleString('fr-FR')} €
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[0.75rem] font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--text-muted)' }}>
              Cotes indicatives pour la France. Prix à titre de référence uniquement.
            </p>
          </Section>
        )}

        {/* Checklist */}
        <Section title="Checklist de visite">
          <div className="rounded-[16px] border overflow-hidden"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
            {motorisation.checklistSpecifique && motorisation.checklistSpecifique.length > 0 && (
              <div className="p-6 border-b"
                style={{ background: 'var(--accent-gold-glow)', borderColor: 'var(--accent-gold-dim)' }}>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-4
                  font-[family-name:var(--font-dm-sans)]"
                  style={{ color: 'var(--accent-gold)' }}>
                  Points critiques — spécifiques à ce moteur
                </p>
                <ul className="space-y-3">
                  {motorisation.checklistSpecifique.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[0.9375rem]">
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                          text-[0.6875rem] font-bold"
                        style={{ background: 'var(--accent-gold-dim)', color: 'var(--accent-gold)' }}
                      >
                        !
                      </span>
                      <span className="leading-relaxed font-[family-name:var(--font-dm-sans)]"
                        style={{ color: 'var(--text-secondary)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-6">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-5
                font-[family-name:var(--font-dm-sans)]"
                style={{ color: 'var(--text-muted)' }}>
                Points génériques de vérification
              </p>
              <ul className="space-y-3">
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
          </div>
        </Section>

        {/* Footer nav */}
        <div className="mt-12 pt-8 flex items-center justify-between text-[0.875rem]
          font-[family-name:var(--font-dm-sans)]"
          style={{ borderTop: '1px solid var(--border-default)' }}>
          <Link href={`/voiture/${voiture.id}`}
            className="transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            ← {voiture.marque} {voiture.modele}
          </Link>
          <Link href="/recherche"
            className="transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            Toutes les voitures →
          </Link>
        </div>
      </div>
    </div>
  )
}
