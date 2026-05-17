import NavBar from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import CarCard from '@/components/CarCard'
import { voitures } from '@/lib/data'

const marquesMises = ['Volkswagen', 'Renault', 'Toyota', 'BMW', 'Dacia', 'Ford']

export default function HomePage() {
  const vedettes = voitures.filter((v) => v.fiabilite.note >= 4).slice(0, 3)

  return (
    <div className="min-h-screen bg-base text-zinc-100">
      <NavBar />

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/15 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-xs font-medium text-accent tracking-wide">Guide achat voiture d'occasion</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Achetez malin,{' '}
          <span className="text-accent">conduisez confiant</span>
        </h1>

        <p className="text-lg text-zinc-500 leading-relaxed mb-12 max-w-md mx-auto">
          Fiabilité, pannes fréquentes, cotes du marché et checklist de visite — pour chaque modèle.
        </p>

        <SearchBar large />

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {marquesMises.map((marque) => (
            <a
              key={marque}
              href={`/recherche?q=${encodeURIComponent(marque)}`}
              className="text-sm px-4 py-1.5 rounded-full bg-surface border border-rim text-zinc-500
                hover:border-accent/30 hover:text-accent transition-all duration-200"
            >
              {marque}
            </a>
          ))}
        </div>
      </section>

      {/* Meilleures fiabilités */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-4 bg-accent rounded-full" />
          <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
            Meilleures fiabilités
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {vedettes.map((v) => (
            <CarCard key={v.id} voiture={v} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/recherche"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-accent transition-colors"
          >
            Voir toutes les voitures <span>→</span>
          </a>
        </div>
      </section>
    </div>
  )
}
