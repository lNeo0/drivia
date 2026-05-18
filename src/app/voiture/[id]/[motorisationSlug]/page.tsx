import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import BoiteSelector from '@/components/BoiteSelector'
import OptionsSection from '@/components/OptionsSection'
import ReprogSection from '@/components/ReprogSection'
import { getVoitureEtMotorisation, getAllMotorisationParams } from '@/lib/data'

export async function generateStaticParams() {
  return getAllMotorisationParams()
}

const scoreConfig: Record<number, { label: string; colorClass: string }> = {
  5: { label: 'Excellente', colorClass: 'text-success' },
  4: { label: 'Bonne',      colorClass: 'text-success' },
  3: { label: 'Moyenne',    colorClass: 'text-warning' },
  2: { label: 'Fragile',    colorClass: 'text-warning' },
  1: { label: 'Très fragile', colorClass: 'text-danger' },
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
    <div className="min-h-screen bg-base text-primary">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.8125rem] mb-10 font-body">
          <Link href={`/voiture/${voiture.id}`}
            className="text-secondary hover:text-gold transition-colors duration-150">
            {voiture.marque} {voiture.modele}
          </Link>
          <span className="text-gold">›</span>
          <span className="text-muted">{motorisation.designation}</span>
        </nav>

        {/* Header */}
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-3
            text-muted font-body">
            {voiture.segment} · {voiture.annees}
          </p>
          <h1 className="font-display font-semibold tracking-[-0.02em] leading-[1.05] text-primary"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {voiture.marque}{' '}
            <em className="text-gold not-italic">{voiture.modele}</em>{' '}
            <span className="text-secondary font-normal">{motorisation.designation}</span>
          </h1>
        </div>

        {/* Specs + sélecteur */}
        <Section title="Specs techniques">
          <div className="rounded-2xl p-6 border border-rim bg-surface"
            style={{ boxShadow: 'var(--shadow-sm)' }}>
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
                <div className="rounded-2xl p-6 border border-rim bg-surface"
                  style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-center gap-6 mb-5">
                    <span className={`font-display font-bold leading-none tabular-nums
                      ${f.colorClass}`}
                      style={{ fontSize: '4.5rem' }}>
                      {motorisation.fiabilite.note}
                    </span>
                    <div>
                      <p className={`text-[1.125rem] font-semibold font-body ${f.colorClass}`}>
                        {f.label} fiabilité
                      </p>
                      <p className={`text-[0.875rem] mt-1 tracking-wide opacity-50 ${f.colorClass}`}>
                        {starsMap[motorisation.fiabilite.note]}
                      </p>
                    </div>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed mb-5 font-body text-secondary">
                    {motorisation.fiabilite.avis}
                  </p>
                  {motorisation.fiabilite.problemesConnus.length > 0 && (
                    <ul className="space-y-3 pt-5 border-t border-rim">
                      {motorisation.fiabilite.problemesConnus.map((p, i) => (
                        <li key={i} className="flex gap-3 text-[0.9375rem]">
                          <span className="shrink-0 mt-0.5 text-danger">✕</span>
                          <span className="leading-relaxed font-body text-secondary">{p}</span>
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
            <div className="rounded-2xl p-8 text-center border border-rim bg-surface">
              <p className="text-[0.9375rem] mb-3 font-body text-muted">
                Données détaillées non disponibles pour cette motorisation.
              </p>
              <Link href={`/voiture/${voiture.id}`}
                className="text-[0.875rem] font-body text-gold hover:text-gold-light
                  transition-colors duration-150">
                Voir la fiabilité générale du modèle →
              </Link>
            </div>
          </Section>
        )}

        {/* Options */}
        {motorisation.options && motorisation.options.length > 0 && (
          <Section title="Options à vérifier">
            <OptionsSection options={motorisation.options} />
          </Section>
        )}

        {/* Potentiel de reprog */}
        {motorisation.potentielReprog && (
          <Section title="Potentiel de reprogrammation">
            <ReprogSection reprog={motorisation.potentielReprog} />
          </Section>
        )}

        {/* Cotes marché */}
        {motorisation.cotes && motorisation.cotes.length > 0 && (
          <Section title="Cotes marché">
            <div className="rounded-2xl border border-rim overflow-hidden">
              <div className="grid grid-cols-4 border-b border-rim-strong bg-elevated">
                {['Tranche', 'Abordable', 'Correct', 'Bon état'].map((h, i) => (
                  <div key={h}
                    className={`px-5 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em]
                      font-body text-muted ${i > 0 ? 'text-center' : ''}`}>
                    {h}
                  </div>
                ))}
              </div>
              {motorisation.cotes.map((c, i) => (
                <div key={i}
                  className={`grid grid-cols-4 border-b border-rim last:border-0
                    hover:bg-subtle transition-colors duration-100
                    ${i % 2 === 1 ? 'bg-elevated' : 'bg-surface'}`}>
                  <div className="px-5 py-4 text-[0.875rem] font-body text-secondary">{c.label}</div>
                  <div className="px-5 py-4 text-center font-display text-[0.9375rem]
                    tabular-nums text-danger">
                    {c.prixBas.toLocaleString('fr-FR')} €
                  </div>
                  <div className="px-5 py-4 text-center font-display text-[0.9375rem]
                    font-semibold tabular-nums text-warning">
                    {c.prixMoyen.toLocaleString('fr-FR')} €
                  </div>
                  <div className="px-5 py-4 text-center font-display text-[0.9375rem]
                    tabular-nums text-success">
                    {c.prixHaut.toLocaleString('fr-FR')} €
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[0.75rem] font-body text-muted">
              Cotes indicatives pour la France. Prix à titre de référence uniquement.
            </p>
          </Section>
        )}

        {/* Checklist */}
        <Section title="Checklist de visite">
          <div className="rounded-2xl border border-rim bg-surface overflow-hidden">
            {motorisation.checklistSpecifique && motorisation.checklistSpecifique.length > 0 && (
              <div className="p-6 border-b bg-gold-dim"
                style={{ borderColor: 'var(--accent-gold-dim)' }}>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-4
                  font-body text-gold">
                  Points critiques — spécifiques à ce moteur
                </p>
                <ul className="space-y-3">
                  {motorisation.checklistSpecifique.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[0.9375rem]">
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                        mt-0.5 text-[0.6875rem] font-bold bg-gold-dim text-gold">
                        !
                      </span>
                      <span className="leading-relaxed font-body text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-6">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-5
                font-body text-muted">
                Points génériques de vérification
              </p>
              <ul className="space-y-3">
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
          </div>
        </Section>

        {/* Footer nav */}
        <div className="mt-12 pt-8 flex items-center justify-between text-[0.875rem]
          font-body border-t border-rim">
          <Link href={`/voiture/${voiture.id}`}
            className="text-muted hover:text-gold transition-colors duration-150">
            ← {voiture.marque} {voiture.modele}
          </Link>
          <Link href="/recherche"
            className="text-muted hover:text-gold transition-colors duration-150">
            Toutes les voitures →
          </Link>
        </div>
      </div>
    </div>
  )
}
