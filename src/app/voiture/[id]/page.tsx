import { notFound } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import MotorisationCards from '@/components/MotorisationCards'
import { getVoitureById, voitures } from '@/lib/data'

export async function generateStaticParams() {
  return voitures.map((v) => ({ id: v.id }))
}

const noteConfig: Record<number, { label: string; stars: string; bg: string; border: string; text: string }> = {
  5: { label: 'Excellente fiabilité', stars: '★★★★★', bg: 'bg-orange-950/50', border: 'border-orange-900/30', text: 'text-accent' },
  4: { label: 'Bonne fiabilité', stars: '★★★★☆', bg: 'bg-orange-950/50', border: 'border-orange-900/30', text: 'text-accent' },
  3: { label: 'Fiabilité moyenne', stars: '★★★☆☆', bg: 'bg-amber-950/50', border: 'border-amber-900/30', text: 'text-amber-400' },
  2: { label: 'Fiabilité passable', stars: '★★☆☆☆', bg: 'bg-orange-950/50', border: 'border-orange-900/30', text: 'text-orange-500' },
  1: { label: 'Fiabilité fragile', stars: '★☆☆☆☆', bg: 'bg-red-950/50', border: 'border-red-900/30', text: 'text-red-500' },
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

export default async function VoiturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const voiture = getVoitureById(id)
  if (!voiture) notFound()

  const note = noteConfig[voiture.fiabilite.note]
  const puissances = voiture.motorisations.map((m) => m.puissance)
  const pMin = Math.min(...puissances)
  const pMax = Math.max(...puissances)

  return (
    <div className="min-h-screen bg-base text-zinc-100">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href="/recherche"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-accent transition-colors mb-10"
        >
          ← Toutes les voitures
        </Link>

        {/* En-tête */}
        <div>
          <p className="text-sm text-zinc-600 mb-2">{voiture.segment} · {voiture.annees}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {voiture.marque}{' '}
            <span className="font-normal text-accent">{voiture.modele}</span>
          </h1>
        </div>

        {/* Stats rapides */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: 'Poids', value: voiture.poids, unit: 'kg' },
            { label: 'Puissance', value: pMin === pMax ? `${pMin}` : `${pMin}–${pMax}`, unit: 'ch' },
            { label: 'Motorisations', value: voiture.motorisations.length, unit: 'versions' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="rounded-2xl bg-surface border border-rim p-5 text-center">
              <p className="text-2xl font-bold text-zinc-100">{value}</p>
              <p className="text-xs text-zinc-600 mt-1">{unit}</p>
              <p className="text-xs text-zinc-700 mt-1.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Fiabilité */}
        <Section title="Fiabilité générale">
          <div className={`rounded-2xl border ${note.border} ${note.bg} p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className={`text-lg font-bold ${note.text}`}>{note.label}</p>
                <p className={`text-base mt-1 tracking-wide ${note.text} opacity-60`}>{note.stars}</p>
              </div>
              <span className={`text-6xl font-bold ${note.text} opacity-10 leading-none`}>
                {voiture.fiabilite.note}
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{voiture.fiabilite.avisGeneral}</p>
          </div>
        </Section>

        {/* Points sensibles */}
        <Section title="Points sensibles">
          <ul className="space-y-2.5">
            {voiture.fiabilite.pointsSensibles.map((point, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-xl bg-surface border border-rim">
                <span className="shrink-0 mt-px text-amber-500">▲</span>
                <span className="text-zinc-300 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Pannes fréquentes */}
        <Section title="Pannes fréquentes">
          <ul className="space-y-2.5">
            {voiture.fiabilite.pannesFrequentes.map((panne, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-xl bg-surface border border-rim">
                <span className="shrink-0 mt-px text-red-500">✕</span>
                <span className="text-zinc-300 text-sm leading-relaxed">{panne}</span>
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
          <div className="rounded-2xl bg-surface border border-rim p-6">
            <p className="text-xs text-zinc-600 mb-6">À vérifier lors de votre inspection avant achat</p>
            <ul className="space-y-3">
              {voiture.checklist.map((item, i) => (
                <li key={i} className="flex gap-4 text-sm">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-raised border border-rim-strong
                    flex items-center justify-center text-zinc-600 text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="text-zinc-400 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <div className="mt-14 pt-8 border-t border-rim text-center">
          <Link href="/recherche" className="text-sm text-zinc-600 hover:text-accent transition-colors">
            ← Retour à toutes les voitures
          </Link>
        </div>
      </div>
    </div>
  )
}
