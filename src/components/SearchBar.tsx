'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    router.push(`/recherche${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  return (
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
          onChange={(e) => setValue(e.target.value)}
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
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-strong)'
            e.target.style.boxShadow = 'none'
          }}
        />
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
  )
}
