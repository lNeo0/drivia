import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import HeroImage from '@/components/HeroImage'
import BoiteSelector from '@/components/BoiteSelector'
import OptionsSection from '@/components/OptionsSection'
import ReprogSection from '@/components/ReprogSection'
import AnchorNav from '@/components/AnchorNav'
import type { AnchorItem } from '@/components/AnchorNav'
import ChecklistInteractive from '@/components/ChecklistInteractive'
import { getVoitureEtMotorisation, getAllMotorisationParams } from '@/lib/data'
import { getCarImageFromDb } from '@/lib/carImageDb'

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

function Section({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="mt-12"
      style={id ? { scrollMarginTop: '120px' } : undefined}
    >
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

  const imageUrl = await getCarImageFromDb(voiture.id)

  const defaultBoiteSlug =
    motorisation.boites.find((b) => b.slug === boiteSlug)?.slug ?? motorisation.boites[0].slug

  // Build anchor list — only include sections that exist in the page
  const anchors: AnchorItem[] = [
    { id: 'specs',     label: 'Specs' },
    { id: 'fiabilite', label: 'Fiabilité' },
    ...(motorisation.fiabilite?.problemesConnus.length
      ? [{ id: 'pannes', label: 'Pannes' }]
      : []),
    ...(motorisation.options?.length
      ? [{ id: 'options', label: 'Options' }]
      : []),
    ...(motorisation.potentielReprog
      ? [{ id: 'reprog', label: 'Reprog' }]
      : []),
    ...(motorisation.cotes?.length
      ? [{ id: 'cotes', label: 'Cotes' }]
      : []),
    { id: 'checklist', label: 'Checklist' },
  ]

  return (
    <div className="min-h-screen bg-base text-primary">
      <NavBar />
      <AnchorNav anchors={anchors} />

      {/* Hero */}
      <div className="relative h-[160px] md:h-[200px]">
        <HeroImage marque={voiture.marque} modele={voiture.modele} anneeDebut={voiture.anneeDebut} imageUrl={imageUrl ?? undefined} />
        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
          <div className="max-w-3xl mx-auto w-full px-6 pb-6 pointer-events-auto">
            <Link
              href={`/voiture/${voiture.id}`}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium mb-2
                font-body text-white/55 hover:text-white/85 transition-colors duration-150"
            >
              <span style={{ color: 'var(--accent-gold)' }}>‹</span>
              {voiture.marque} {voiture.modele}
            </Link>
            <h1 className="font-display font-semibold tracking-[-0.02em] leading-[1.05]"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#FFFFFF' }}>
              <em className="not-italic" style={{ color: 'var(--accent-gold)' }}>{voiture.modele}</em>{' '}
              <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>{motorisation.designation}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 pb-12">
        {/* Specs + sélecteur */}
        <Section id="specs" title="Specs techniques">
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

        {/* Fiabilité motorisation — score + avis uniquement */}
        {motorisation.fiabilite ? (
          <Section id="fiabilite" title="Fiabilité de cette motorisation">
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
                  <p className="text-[0.9375rem] leading-relaxed font-body text-secondary">
                    {motorisation.fiabilite.avis}
                  </p>
                </div>
              )
            })()}
          </Section>
        ) : (
          <Section id="fiabilite" title="Fiabilité de cette motorisation">
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

        {/* Problèmes connus — section distincte pour l'ancre */}
        {motorisation.fiabilite && motorisation.fiabilite.problemesConnus.length > 0 && (
          <Section id="pannes" title="Problèmes connus">
            <ul className="space-y-2.5">
              {motorisation.fiabilite.problemesConnus.map((p, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-[12px] border border-rim bg-surface">
                  <span className="shrink-0 mt-0.5 text-danger">✕</span>
                  <span className="text-[0.9375rem] leading-relaxed font-body text-secondary">{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Options */}
        {motorisation.options && motorisation.options.length > 0 && (
          <Section id="options" title="Options à vérifier">
            <OptionsSection options={motorisation.options} />
          </Section>
        )}

        {/* Potentiel de reprog */}
        {motorisation.potentielReprog && (
          <Section id="reprog" title="Potentiel de reprogrammation">
            <ReprogSection reprog={motorisation.potentielReprog} />
          </Section>
        )}

        {/* Cotes marché */}
        {motorisation.cotes && motorisation.cotes.length > 0 && (
          <Section id="cotes" title="Cotes marché">
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
        <Section id="checklist" title="Checklist de visite">
          <ChecklistInteractive
            voitureId={voiture.id}
            motorisationSlug={motorisationSlug}
            checklistSpecifique={motorisation.checklistSpecifique ?? []}
            checklist={voiture.checklist}
          />
        </Section>

        {/* Footer nav */}
        <div className="mt-12 pt-8 flex items-center justify-between text-[0.875rem]
          font-body border-t border-rim">
          <Link href={`/voiture/${voiture.id}`}
            className="inline-flex items-center gap-1.5 text-muted hover:text-secondary
              transition-colors duration-150">
            <span style={{ color: 'var(--accent-gold)' }}>‹</span>
            {voiture.marque} {voiture.modele}
          </Link>
          <Link href="/voitures"
            className="inline-flex items-center gap-1.5 text-muted hover:text-secondary
              transition-colors duration-150">
            Toutes les voitures
            <span style={{ color: 'var(--accent-gold)' }}>›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
