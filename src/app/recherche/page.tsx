import NavBar from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import CarCard from '@/components/CarCard'
import { rechercherVoitures, voitures } from '@/lib/data'

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const resultats = rechercherVoitures(q)

  return (
    <div className="min-h-screen bg-base text-primary">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <SearchBar defaultValue={q} />
        </div>

        <p className="text-[0.875rem] mb-6 font-body text-secondary">
          {q ? (
            resultats.length > 0 ? (
              <>
                <span className="text-primary font-medium">{resultats.length}</span>{' '}
                résultat{resultats.length > 1 ? 's' : ''} pour &ldquo;{q}&rdquo;
              </>
            ) : (
              <>Aucun résultat pour &ldquo;{q}&rdquo;</>
            )
          ) : (
            <>
              <span className="text-primary font-medium">{voitures.length}</span>{' '}
              voitures disponibles
            </>
          )}
        </p>

        {resultats.length > 0 ? (
          <div className="flex flex-col gap-4">
            {resultats.map((v) => (
              <CarCard key={v.id} voiture={v} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-[1.125rem] mb-2 font-display font-semibold text-secondary">
              Aucune voiture trouvée.
            </p>
            <p className="text-[0.875rem] font-body text-muted">
              Essayez avec une marque comme &ldquo;Renault&rdquo; ou un modèle comme &ldquo;Golf&rdquo;.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
