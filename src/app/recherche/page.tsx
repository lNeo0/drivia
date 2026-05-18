import NavBar from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import FilterPanel from '@/components/FilterPanel'
import { voitures } from '@/lib/data'

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams

  return (
    <div className="min-h-screen bg-base text-primary">
      <NavBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <SearchBar defaultValue={q} />
        </div>

        <FilterPanel
          voitures={voitures}
          defaultQuery={q}
          layout="list"
          defaultSort="pertinence"
        />
      </div>
    </div>
  )
}
