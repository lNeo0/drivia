import NavBar from '@/components/NavBar'
import FilterPanel from '@/components/FilterPanel'
import { voitures } from '@/lib/data'

export default function VoituresPage() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-3
            font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--text-muted)' }}>
            Catalogue
          </p>
          <h1
            className="font-semibold tracking-[-0.02em] leading-[1.05]"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
            }}
          >
            Toutes les voitures
          </h1>
        </div>

        <FilterPanel
          voitures={voitures}
          layout="grid"
          defaultSort="fiabilite-desc"
        />
      </div>
    </div>
  )
}
