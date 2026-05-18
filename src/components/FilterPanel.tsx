'use client'

import { useState, useMemo } from 'react'
import CarCard from '@/components/CarCard'
import type { Voiture } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

type Sort = 'pertinence' | 'fiabilite-desc' | 'poids-asc' | 'puissance-desc'

type Props = {
  voitures: Voiture[]
  defaultQuery?: string
  layout?: 'list' | 'grid'
  defaultSort?: Sort
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  essence:    'Essence',
  diesel:     'Diesel',
  hybride:    'Hybride',
  electrique: 'Électrique',
}

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'pertinence',      label: 'Pertinence'    },
  { value: 'fiabilite-desc',  label: 'Fiabilité ↓'   },
  { value: 'poids-asc',       label: 'Poids ↑'       },
  { value: 'puissance-desc',  label: 'Puissance ↓'   },
]

const NOTE_OPTIONS = [
  { value: 3, label: '≥3 Moyenne'   },
  { value: 4, label: '≥4 Bonne'     },
  { value: 5, label: '5 Excellente' },
]

function normalise(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const ALIASES: Record<string, string> = {
  vw: 'volkswagen', reno: 'renault', bm: 'bmw', daf: 'dacia',
}

function filterByQuery(list: Voiture[], query: string): Voiture[] {
  const q = normalise(query).trim()
  if (!q) return list
  const parts = q.split(/\s+/).map(p => ALIASES[p] ?? p)
  return list.filter(v => {
    const hay = [v.marque, v.modele, v.segment].map(normalise).join(' ')
    return parts.every(p => hay.includes(p))
  })
}

function sortVoitures(list: Voiture[], sort: Sort): Voiture[] {
  const arr = [...list]
  switch (sort) {
    case 'fiabilite-desc':
      return arr.sort((a, b) => b.fiabilite.note - a.fiabilite.note)
    case 'poids-asc':
      return arr.sort((a, b) => a.poids - b.poids)
    case 'puissance-desc':
      return arr.sort((a, b) => {
        const maxA = Math.max(...a.motorisations.map(m => m.puissance))
        const maxB = Math.max(...b.motorisations.map(m => m.puissance))
        return maxB - maxA
      })
    default:
      return arr
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Pill({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 h-[30px] px-3.5 rounded-full text-[0.8125rem] font-medium
        whitespace-nowrap transition-all duration-150 cursor-pointer
        font-[family-name:var(--font-dm-sans)]"
      style={active ? {
        background: 'var(--accent-gold)',
        color: '#0D0D0D',
        border: '1px solid transparent',
      } : {
        background: 'var(--bg-elevated)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      {children}
    </button>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="shrink-0 w-[4rem] text-right text-[0.6875rem] font-semibold
          uppercase tracking-[0.07em] font-[family-name:var(--font-dm-sans)]"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5">
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FilterPanel({
  voitures,
  defaultQuery = '',
  layout = 'list',
  defaultSort = 'pertinence',
}: Props) {
  const [segment, setSegment] = useState('')
  const [type, setType]       = useState('')
  const [minNote, setMinNote] = useState(0)
  const [sort, setSort]       = useState<Sort>(defaultSort)

  // Derive unique segments and types from the data
  const segments = useMemo(
    () => [...new Set(voitures.map(v => v.segment))].sort(),
    [voitures],
  )
  const types = useMemo(
    () => [...new Set(voitures.flatMap(v => v.motorisations.map(m => m.type)))].sort(),
    [voitures],
  )

  // Apply filters
  const filtered = useMemo(() => {
    let result = filterByQuery(voitures, defaultQuery)
    if (segment)  result = result.filter(v => v.segment === segment)
    if (type)     result = result.filter(v => v.motorisations.some(m => m.type === type))
    if (minNote)  result = result.filter(v => v.fiabilite.note >= minNote)
    return sortVoitures(result, sort)
  }, [voitures, defaultQuery, segment, type, minNote, sort])

  const hasActiveFilters = segment !== '' || type !== '' || minNote !== 0

  function resetFilters() {
    setSegment('')
    setType('')
    setMinNote(0)
    setSort(defaultSort)
  }

  return (
    <div>
      {/* ── Filter pills ── */}
      <div
        className="rounded-2xl p-4 mb-6 space-y-3"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
        }}
      >
        <FilterRow label="Segment">
          <Pill active={segment === ''} onClick={() => setSegment('')}>Toutes</Pill>
          {segments.map(s => (
            <Pill key={s} active={segment === s} onClick={() => setSegment(s)}>
              {s}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Moteur">
          <Pill active={type === ''} onClick={() => setType('')}>Tous</Pill>
          {types.map(t => (
            <Pill key={t} active={type === t} onClick={() => setType(t)}>
              {TYPE_LABELS[t] ?? t}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Note">
          <Pill active={minNote === 0} onClick={() => setMinNote(0)}>Tous</Pill>
          {NOTE_OPTIONS.map(({ value, label }) => (
            <Pill key={value} active={minNote === value} onClick={() => setMinNote(value)}>
              {label}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Tri">
          {SORT_OPTIONS.map(({ value, label }) => (
            <Pill key={value} active={sort === value} onClick={() => setSort(value)}>
              {label}
            </Pill>
          ))}
        </FilterRow>
      </div>

      {/* ── Result count ── */}
      <p
        className="text-[0.875rem] mb-6 font-[family-name:var(--font-dm-sans)]"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {filtered.length}
        </span>
        {' '}voiture{filtered.length !== 1 ? 's' : ''}
        {defaultQuery && (
          <> pour &ldquo;<span style={{ color: 'var(--text-primary)' }}>{defaultQuery}</span>&rdquo;</>
        )}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-3 text-[0.8125rem] font-medium transition-colors duration-150
              font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--accent-gold)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Réinitialiser
          </button>
        )}
      </p>

      {/* ── Results ── */}
      {filtered.length > 0 ? (
        layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(v => <CarCard key={v.id} voiture={v} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(v => <CarCard key={v.id} voiture={v} />)}
          </div>
        )
      ) : (
        <div className="text-center py-24">
          <p
            className="text-[1.125rem] mb-2 font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--text-secondary)' }}
          >
            Aucune voiture ne correspond à ces critères.
          </p>
          <p
            className="text-[0.875rem] mb-6 font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--text-muted)' }}
          >
            Essayez de modifier ou réinitialiser les filtres.
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="h-[38px] px-6 rounded-[10px] text-[0.875rem] font-semibold
                transition-all duration-150 font-[family-name:var(--font-dm-sans)]"
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-gold)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
              }}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  )
}
