'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type Props = {
  voitureId: string
  motorisationSlug: string
  checklistSpecifique: string[]
  checklist: string[]
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,6.5 5,9.5 10,2.5" />
    </svg>
  )
}

function CheckItem({
  id, text, isChecked, isCritical, index, onToggle,
}: {
  id: string
  text: string
  isChecked: boolean
  isCritical: boolean
  index?: number
  onToggle: (id: string) => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-start gap-3 text-left rounded-[10px] py-2.5 px-2
          cursor-pointer select-none font-[family-name:var(--font-dm-sans)]"
        style={{
          background: isChecked ? 'var(--bg-subtle)' : 'transparent',
          boxShadow: isCritical
            ? isChecked
              ? 'inset 3px 0 0 var(--border-default)'
              : 'inset 3px 0 0 var(--accent-gold)'
            : 'none',
          transition: 'background 200ms ease, box-shadow 200ms ease',
        }}
      >
        {/* Icon */}
        {isCritical ? (
          <span
            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-[3px]"
            style={{
              background: isChecked ? 'var(--accent-gold)' : 'var(--accent-gold-dim)',
              color: isChecked ? '#0D0D0D' : 'var(--accent-gold)',
              transition: 'background 200ms ease, color 200ms ease',
            }}
          >
            {isChecked ? <CheckIcon /> : (
              <span className="text-[0.625rem] font-bold leading-none">!</span>
            )}
          </span>
        ) : (
          <span
            className="shrink-0 w-6 h-6 rounded-[6px] flex items-center justify-center mt-[3px]
              text-[0.75rem] font-semibold"
            style={{
              background: isChecked ? 'var(--accent-gold)' : 'var(--bg-elevated)',
              border: `1px solid ${isChecked ? 'transparent' : 'var(--border-strong)'}`,
              color: isChecked ? '#0D0D0D' : 'var(--text-muted)',
              transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
            }}
          >
            {isChecked ? <CheckIcon /> : index}
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isCritical && (
            <div
              className="text-[0.6rem] font-bold uppercase tracking-[0.12em] mb-0.5
                font-[family-name:var(--font-dm-sans)]"
              style={{
                color: isChecked ? 'var(--text-muted)' : 'var(--accent-gold)',
                transition: 'color 200ms ease',
              }}
            >
              Critique
            </div>
          )}
          <span
            className="text-[0.9375rem] leading-relaxed font-[family-name:var(--font-dm-sans)]"
            style={{
              color: isChecked ? 'var(--text-muted)' : 'var(--text-secondary)',
              textDecoration: isChecked ? 'line-through var(--border-strong)' : 'none',
              transition: 'color 200ms ease',
            }}
          >
            {text}
          </span>
        </div>
      </button>
    </li>
  )
}

export default function ChecklistInteractive({
  voitureId,
  motorisationSlug,
  checklistSpecifique,
  checklist,
}: Props) {
  const storageKey = `drivia-checklist-${voitureId}-${motorisationSlug}`

  const [checked, setChecked] = useState<Set<string>>(new Set())

  // Stable refs so the native event listener always sees current state
  const checkedRef = useRef<Set<string>>(checked)
  checkedRef.current = checked

  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setChecked(new Set(JSON.parse(saved) as string[]))
    } catch {}
  }, [storageKey])

  const resetChecklist = useCallback(() => {
    setChecked(new Set())
    try { localStorage.removeItem(storageKey) } catch {}
  }, [storageKey])

  const resetRef = useRef(resetChecklist)
  resetRef.current = resetChecklist

  // Intercept boite changes from BoiteSelector (cancelable CustomEvent on window)
  useEffect(() => {
    function onBeforeBoiteChange(e: Event) {
      if (checkedRef.current.size === 0) return
      const ok = window.confirm(
        'Changer de boîte de vitesses réinitialisera la checklist.\nContinuer ?'
      )
      if (!ok) e.preventDefault()
      else resetRef.current()
    }
    window.addEventListener('drivia:before-boite-change', onBeforeBoiteChange)
    return () => window.removeEventListener('drivia:before-boite-change', onBeforeBoiteChange)
  }, [])

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  const criticalItems = checklistSpecifique
  const totalItems = criticalItems.length + checklist.length
  const checkedCount = checked.size
  const allDone = totalItems > 0 && checkedCount === totalItems
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0

  return (
    <div className="rounded-2xl border border-rim bg-surface overflow-hidden">

      {/* ── Progress header ── */}
      <div className="px-6 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center justify-between mb-3">
          {allDone ? (
            <span className="text-[0.875rem] font-semibold font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--success)' }}>
              ✓ Inspection complète
            </span>
          ) : (
            <span className="text-[0.8125rem] font-[family-name:var(--font-dm-sans)]"
              style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {checkedCount}
              </span>
              {' / '}{totalItems} points vérifiés
            </span>
          )}
        </div>
        {/* Progress bar */}
        <div className="h-[4px] rounded-full overflow-hidden"
          style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: allDone ? 'var(--success)' : 'var(--accent-gold)',
              transition: 'width 300ms ease, background 300ms ease',
            }}
          />
        </div>
      </div>

      {/* ── Critical items ── */}
      {criticalItems.length > 0 && (
        <div className="p-6 bg-gold-dim"
          style={{ borderBottom: '1px solid var(--accent-gold-dim)' }}>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-4
            font-[family-name:var(--font-dm-sans)]"
            style={{ color: 'var(--accent-gold)' }}>
            Points critiques — spécifiques à ce moteur
          </p>
          <ul className="space-y-1">
            {criticalItems.map((item, i) => (
              <CheckItem
                key={`c-${i}`}
                id={`c-${i}`}
                text={item}
                isChecked={checked.has(`c-${i}`)}
                isCritical
                onToggle={toggle}
              />
            ))}
          </ul>
        </div>
      )}

      {/* ── Generic items ── */}
      <div className="p-6">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-5
          font-[family-name:var(--font-dm-sans)]"
          style={{ color: 'var(--text-muted)' }}>
          Points génériques de vérification
        </p>
        <ul className="space-y-1">
          {checklist.map((item, i) => (
            <CheckItem
              key={`g-${i}`}
              id={`g-${i}`}
              text={item}
              isChecked={checked.has(`g-${i}`)}
              isCritical={false}
              index={i + 1}
              onToggle={toggle}
            />
          ))}
        </ul>
      </div>

      {/* ── Reset button ── */}
      {checkedCount > 0 && (
        <div className="px-6 pb-5 pt-3 flex justify-end"
          style={{ borderTop: '1px solid var(--border-default)' }}>
          <button
            type="button"
            onClick={resetChecklist}
            className="text-[0.75rem] font-medium font-[family-name:var(--font-dm-sans)]
              transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  )
}
