import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import BoiteSelector from '@/components/BoiteSelector'
import { getVoitureEtMotorisation, getAllMotorisationParams } from '@/lib/data'

export async function generateStaticParams() {
  return getAllMotorisationParams()
}

const noteConfig: Record<number, { label: string; stars: string; bg: string; border: string; text: string }> = {
  5: { label: 'Excellente', stars: '★★★★★', bg: 'bg-orange-950/50', border: 'border-orange-900/30', text: 'text-accent' },
  4: { label: 'Bonne', stars: '★★★★☆', bg: 'bg-orange-950/50', border: 'border-orange-900/30', text: 'text-accent' },
  3: { label: 'Moyenne', stars: '★★★☆☆', bg: 'bg-amber-950/50', border: 'border-amber-900/30', text: 'text-amber-400' },
  2: { label: 'Fragile', stars: '★★☆☆☆', bg: 'bg-orange-950/50', border: 'border-orange-900/30', text: 'text-orange-500' },
  1: { label: 'Très fragile', stars: '★☆☆☆☆', bg: 'bg-red-950/50', border: 'border-red-900/30', text: 'text-red-500' },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-4 bg-accent rounded-full" />
        <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">{title}</h2>
      </div>
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
    <div className="min-h-screen bg-base text-zinc-100">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Fil d'ariane */}
        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-10">
          <Link href={`/voiture/${voiture.id}`} className="hover:text-accent transition-colors">
            {voiture.marque} {voiture.modele}
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-400">{motorisation.designation}</span>
        </nav>

        {/* En-tête */}
        <div>
          <p className="text-sm text-zinc-600 mb-2">{voiture.segment} · {voiture.annees}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {voiture.marque}{' '}
            <span className="font-normal text-accent">{voiture.modele}</span>{' '}
            <span className="text-accent">{motorisation.designation}</span>
          </h1>
        </div>

        {/* Specs + sélecteur */}
        <Section title="Specs techniques">
          <div className="rounded-2xl bg-surface border border-rim p-6">
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
              const f = noteConfig[motorisation.fiabilite.note]
              return (
                <div className={`rounded-2xl border ${f.border} ${f.bg} p-6 space-y-5`}>
                  <div className="flex items-center gap-6">
                    <span className={`text-7xl font-bold leading-none ${f.text}`}>
                      {motorisation.fiabilite.note}
                    </span>
                    <div>
                      <p className={`text-lg font-bold ${f.text}`}>{f.label} fiabilité</p>
                      <p className={`text-base mt-1 tracking-wide ${f.text} opacity-60`}>{f.stars}</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{motorisation.fiabilite.avis}</p>
                  {motorisation.fiabilite.problemesConnus.length > 0 && (
                    <ul className="space-y-3 pt-4 border-t border-zinc-800">
                      {motorisation.fiabilite.problemesConnus.map((p, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="shrink-0 mt-px text-red-500">✕</span>
                          <span className="text-zinc-300 leading-relaxed">{p}</span>
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
            <div className="rounded-2xl bg-surface border border-rim p-8 text-center">
              <p className="text-zinc-600 text-sm mb-3">
                Données détaillées non disponibles pour cette motorisation.
              </p>
              <Link
                href={`/voiture/${voiture.id}`}
                className="text-sm text-accent/70 hover:text-accent transition-colors"
              >
                Voir la fiabilité générale du modèle →
              </Link>
            </div>
          </Section>
        )}

        {/* Cotes marché */}
        {motorisation.cotes && motorisation.cotes.length > 0 && (
          <Section title="Cotes marché">
            <div className="rounded-2xl bg-surface border border-rim overflow-hidden">
              <div className="grid grid-cols-4 border-b border-rim">
                {['Tranche', 'Abordable', 'Correct', 'Bon état'].map((h, i) => (
                  <div
                    key={h}
                    className={`px-5 py-3.5 text-xs font-semibold text-zinc-600 uppercase tracking-wider ${i > 0 ? 'text-center' : ''}`}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {motorisation.cotes.map((c, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-4 border-b border-rim last:border-0 ${i % 2 === 1 ? 'bg-raised' : ''}`}
                >
                  <div className="px-5 py-4 text-sm text-zinc-400">{c.label}</div>
                  <div className="px-5 py-4 text-sm text-center text-zinc-600">
                    {c.prixBas.toLocaleString('fr-FR')} €
                  </div>
                  <div className="px-5 py-4 text-sm text-center font-semibold text-zinc-200">
                    {c.prixMoyen.toLocaleString('fr-FR')} €
                  </div>
                  <div className="px-5 py-4 text-sm text-center text-zinc-600">
                    {c.prixHaut.toLocaleString('fr-FR')} €
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-zinc-700">
              Cotes indicatives pour la France. Prix à titre de référence uniquement.
            </p>
          </Section>
        )}

        {/* Checklist */}
        <Section title="Checklist de visite">
          <div className="rounded-2xl bg-surface border border-rim overflow-hidden">
            {motorisation.checklistSpecifique && motorisation.checklistSpecifique.length > 0 && (
              <div className="bg-accent/5 border-b border-accent/15 p-6">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
                  Points critiques — spécifiques à ce moteur
                </p>
                <ul className="space-y-3">
                  {motorisation.checklistSpecifique.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-px">
                        <span className="text-accent text-xs font-bold leading-none">!</span>
                      </span>
                      <span className="text-zinc-200 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-6">
              <p className="text-xs text-zinc-600 mb-5">Points génériques de vérification</p>
              <ul className="space-y-3">
                {voiture.checklist.map((item, i) => (
                  <li key={i} className="flex gap-4 text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-raised border border-rim-strong
                      flex items-center justify-center text-zinc-600 text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="text-zinc-500 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="mt-14 pt-8 border-t border-rim flex items-center justify-between text-sm">
          <Link href={`/voiture/${voiture.id}`} className="text-zinc-600 hover:text-accent transition-colors">
            ← {voiture.marque} {voiture.modele}
          </Link>
          <Link href="/recherche" className="text-zinc-600 hover:text-accent transition-colors">
            Toutes les voitures
          </Link>
        </div>
      </div>
    </div>
  )
}
