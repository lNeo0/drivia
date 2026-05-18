'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { rechercherVoitures } from '@/lib/data'
import { getReliabilityColor } from '@/lib/reliability'
import type { Voiture } from '@/types'

type Props = {
  defaultValue?: string
  large?: boolean
}

function SearchIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <circle cx="8.5" cy="8.5" r="5" />
      <line x1="12.5" y1="12.5" x2="16" y2="16" />
    </svg>
  )
}

export default function SearchBar({ defaultValue = '', large = false }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Voiture[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      const results = rechercherVoitures(v).slice(0, 5)
      setSuggestions(results)
      setShowDropdown(results.length > 0)
    }, 200)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowDropdown(false)
    const q = value.trim()
    router.push(`/recherche${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setShowDropdown(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full gap-3">
        <div className="relative flex-1">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--accent-gold)' }}
          >
            <SearchIcon size={large ? 18 : 16} />
          </span>
          <input
            type="search"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Marque, modèle… ex : Golf, Clio, BMW"
            className="w-full rounded-[12px] font-[family-name:var(--font-dm-sans)]
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              transition-all duration-150"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              paddingLeft: large ? '3rem' : '2.5rem',
              paddingRight: large ? '1.25rem' : '1rem',
              paddingTop: large ? '1rem' : '0.75rem',
              paddingBottom: large ? '1rem' : '0.75rem',
              fontSize: large ? '1rem' : '0.875rem',
              height: large ? '56px' : 'auto',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-gold)'
              e.target.style.boxShadow = '0 0 0 3px var(--accent-gold-glow)'
              if (suggestions.length > 0) setShowDropdown(true)
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-strong)'
              e.target.style.boxShadow = 'none'
            }}
          />

          {showDropdown && (
            <div
              className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {suggestions.map((v) => {
                const c = getReliabilityColor(v.fiabilite.note)
                return (
                  <button
                    key={v.id}
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left
                      transition-colors duration-100
                      font-[family-name:var(--font-dm-sans)]"
                    style={{ borderBottom: '1px solid var(--border-default)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setShowDropdown(false)
                      router.push(`/voiture/${v.id}`)
                    }}
                  >
                    <span
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        text-[0.7rem] font-bold font-[family-name:var(--font-cormorant)]"
                      style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}
                    >
                      {v.fiabilite.note}
                    </span>
                    <span className="text-[0.875rem] text-[var(--text-primary)]">
                      <span className="font-medium">{v.marque}</span>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>{v.modele}</span>
                    </span>
                    <span className="ml-auto text-[0.75rem] shrink-0"
                      style={{ color: 'var(--text-muted)' }}>
                      {v.annees}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-[10px] font-semibold uppercase tracking-[0.05em]
            cursor-pointer active:scale-95
            font-[family-name:var(--font-dm-sans)]
            transition-all duration-150"
          style={{
            background: '#C9A84C',
            color: '#0D0D0D',
            fontSize: large ? '0.875rem' : '0.8125rem',
            padding: large ? '0 2rem' : '0 1.25rem',
            height: large ? '56px' : 'auto',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#E8C97A'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#C9A84C'
          }}
        >
          Rechercher
        </button>
      </form>
    </div>
  )
}
