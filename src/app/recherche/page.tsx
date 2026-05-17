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
    <div className="min-h-screen bg-base text-zinc-100">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <SearchBar defaultValue={q} />
        </div>

        <p className="text-sm text-zinc-600 mb-6">
          {q ? (
            resultats.length > 0 ? (
              <>
                <span className="text-zinc-300 font-medium">{resultats.length}</span>{' '}
                résultat{resultats.length > 1 ? 's' : ''} pour &ldquo;{q}&rdquo;
              </>
            ) : (
              <>Aucun résultat pour &ldquo;{q}&rdquo;</>
            )
          ) : (
            <>
              <span className="text-zinc-300 font-medium">{voitures.length}</span> voitures disponibles
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
            <p className="text-zinc-500 text-lg mb-2">Aucune voiture trouvée.</p>
            <p className="text-zinc-700 text-sm">
              Essayez avec une marque comme &ldquo;Renault&rdquo; ou un modèle comme &ldquo;Golf&rdquo;.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
