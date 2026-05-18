'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { rechercherVoitures } from '@/lib/data'
import { getReliabilityColor } from '@/lib/reliability'
import type { Voiture } from '@/types'

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <circle cx="8.5" cy="8.5" r="5" />
      <line x1="12.5" y1="12.5" x2="16" y2="16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  )
}

function SuggestionItem({
  v,
  compact,
  onSelect,
}: {
  v: Voiture
  compact?: boolean
  onSelect: (id: string) => void
}) {
  const c = getReliabilityColor(v.fiabilite.note)
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 text-left transition-colors duration-100
        font-[family-name:var(--font-dm-sans)]"
      style={{
        padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
        borderBottom: '1px solid var(--border-default)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
      onMouseDown={(e) => {
        e.preventDefault()
        onSelect(v.id)
      }}
      onClick={() => onSelect(v.id)}
    >
      <span
        className="shrink-0 rounded-full flex items-center justify-center
          font-bold font-[family-name:var(--font-cormorant)]"
        style={{
          width: compact ? '28px' : '36px',
          height: compact ? '28px' : '36px',
          fontSize: compact ? '0.65rem' : '0.75rem',
          color: c.text,
          background: c.bg,
          border: `1px solid ${c.border}`,
        }}
      >
        {v.fiabilite.note}
      </span>
      <span
        className="font-medium"
        style={{
          fontSize: compact ? '0.8125rem' : '0.9375rem',
          color: 'var(--text-primary)',
        }}
      >
        {v.marque}{' '}
        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{v.modele}</span>
      </span>
      <span className="ml-auto shrink-0"
        style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        {v.annees}
      </span>
    </button>
  )
}

export default function NavSearch() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<Voiture[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [focused, setFocused] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [mobileOpen])

  function runSearch(v: string) {
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
    setMobileOpen(false)
    const q = value.trim()
    router.push(`/recherche${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  function handleSelect(id: string) {
    setShowDropdown(false)
    setMobileOpen(false)
    setValue('')
    setSuggestions([])
    router.push(`/voiture/${id}`)
  }

  function closeMobile() {
    setMobileOpen(false)
    setValue('')
    setSuggestions([])
    setShowDropdown(false)
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div
        ref={desktopRef}
        className="relative hidden md:block"
        style={{
          width: focused ? '300px' : '200px',
          transition: 'width 200ms ease',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              <SearchIcon size={14} />
            </span>
            <input
              type="search"
              value={value}
              onChange={(e) => runSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setShowDropdown(false); e.currentTarget.blur() } }}
              onFocus={() => {
                setFocused(true)
                if (suggestions.length > 0) setShowDropdown(true)
              }}
              onBlur={(e) => {
                if (!desktopRef.current?.contains(e.relatedTarget as Node)) {
                  setFocused(false)
                }
              }}
              placeholder="Rechercher…"
              className="w-full rounded-[8px] text-[0.8125rem]
                font-[family-name:var(--font-dm-sans)]
                placeholder:text-[var(--text-muted)]
                transition-colors duration-150"
              style={{
                background: 'var(--bg-subtle)',
                border: focused ? '1px solid var(--accent-gold)' : '1px solid transparent',
                boxShadow: focused ? '0 0 0 2px var(--accent-gold-glow)' : 'none',
                color: 'var(--text-primary)',
                paddingLeft: '2rem',
                paddingRight: '0.75rem',
                height: '34px',
              }}
            />
          </div>
        </form>

        {showDropdown && (
          <div
            className="absolute left-0 right-0 top-full mt-1 z-50 overflow-hidden"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {suggestions.map((v) => (
              <SuggestionItem key={v.id} v={v} compact onSelect={handleSelect} />
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile icon ── */}
      <button
        type="button"
        className="flex md:hidden items-center justify-center w-8 h-8 rounded-[8px]
          transition-colors duration-150"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        onClick={() => setMobileOpen(true)}
        aria-label="Rechercher"
      >
        <SearchIcon size={18} />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'var(--bg-base)' }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border-default)' }}
          >
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <SearchIcon size={16} />
                </span>
                <input
                  ref={mobileInputRef}
                  type="search"
                  value={value}
                  onChange={(e) => runSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') closeMobile() }}
                  placeholder="Marque, modèle…"
                  className="w-full rounded-[10px]
                    font-[family-name:var(--font-dm-sans)]
                    placeholder:text-[var(--text-muted)]"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    height: '44px',
                  }}
                />
              </div>
            </form>
            <button
              type="button"
              onClick={closeMobile}
              className="shrink-0 p-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <CloseIcon />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              {suggestions.map((v) => (
                <SuggestionItem key={v.id} v={v} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
