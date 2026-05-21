import NavBar from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import CarCard from '@/components/CarCard'
import { voitures } from '@/lib/data'
import { getAllCarImagesFromDb } from '@/lib/carImageDb'

const marquesMises = ['Volkswagen', 'Renault', 'Toyota', 'BMW', 'Dacia', 'Ford']

export default async function HomePage() {
  const vedettes = voitures.filter((v) => v.fiabilite.note >= 4).slice(0, 3)
  const imageUrls = await getAllCarImagesFromDb()

  return (
    <div className="min-h-screen bg-base text-primary">
      <NavBar />

      {/* Hero */}
      <section className="relative max-w-2xl mx-auto px-6 pt-28 pb-24 text-center">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 800px 500px at 50% 0%, var(--accent-gold-glow), transparent)',
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8
            border border-gold-dim bg-gold-dim font-body">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-gold">
              Guide achat voiture d'occasion
            </span>
          </div>

          <h1 className="font-display font-semibold tracking-[-0.02em] leading-[1.05] mb-6
            text-primary"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            Achetez malin,{' '}
            <em className="text-gold not-italic">conduisez confiant</em>
          </h1>

          <p className="text-[1.0625rem] leading-relaxed mb-12 max-w-md mx-auto
            text-secondary font-body">
            Fiabilité, pannes fréquentes, cotes du marché et checklist de visite — pour chaque modèle.
          </p>

          <SearchBar large />

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {marquesMises.map((marque) => (
              <a
                key={marque}
                href={`/recherche?q=${encodeURIComponent(marque)}`}
                className="text-[0.8125rem] px-4 py-1.5 rounded-full border border-rim
                  font-body font-medium text-secondary bg-surface
                  hover:border-gold-dim hover:bg-subtle hover:text-gold
                  transition-all duration-150"
              >
                {marque}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section vedettes */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <div className="mb-8">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-2
            text-muted font-body">
            Sélection
          </p>
          <h2 className="font-display font-semibold tracking-[-0.01em] text-primary"
            style={{ fontSize: '2.25rem' }}>
            Meilleures fiabilités
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {vedettes.map((v) => (
            <CarCard key={v.id} voiture={v} imageUrl={imageUrls[v.id]} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/recherche"
            className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium
              font-body text-secondary hover:text-gold transition-colors duration-150"
          >
            Voir toutes les voitures →
          </a>
        </div>
      </section>
    </div>
  )
}
