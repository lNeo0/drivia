'use client'

import { useEffect, useRef, useState } from 'react'

export type AnchorItem = { id: string; label: string }

type Props = { anchors: AnchorItem[] }

export default function AnchorNav({ anchors }: Props) {
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState<string>(anchors[0]?.id ?? '')
  const [progress, setProgress] = useState(0)
  const [progressVisible, setProgressVisible] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show bar after 150px scroll + progress tracking
  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY
      setVisible(scrollY > 150)

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0
      setProgress(pct)

      if (pct > 0) {
        setProgressVisible(true)
        // Desktop: hide after 2s of inactivity. Mobile: always visible.
        if (window.innerWidth >= 768) {
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
          hideTimerRef.current = setTimeout(() => setProgressVisible(false), 2000)
        }
      } else {
        setProgressVisible(false)
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  // IntersectionObserver: track which section is in the reading zone
  useEffect(() => {
    const ids = anchors.map(a => a.id)
    const visibleIds = new Set<string>()
    const observers: IntersectionObserver[] = []

    const updateActive = () => {
      const first = ids.find(id => visibleIds.has(id))
      if (first) setActiveId(first)
    }

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visibleIds.add(id)
          else visibleIds.delete(id)
          updateActive()
        },
        { rootMargin: '-10% 0px -50% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [anchors])

  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    // Offset = NavBar (64px) + AnchorNav (44px) + spacing (16px)
    const top = el.getBoundingClientRect().top + window.scrollY - 124
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveId(id)
  }

  return (
    <>
      {/* Anchor nav bar */}
      <div
        className="fixed left-0 right-0 z-40 h-[44px]"
        style={{
          top: '64px',
          background: 'rgba(13,13,13,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #2A2A2A',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 200ms ease, transform 200ms ease',
          pointerEvents: visible ? 'auto' : 'none',
        } as React.CSSProperties}
      >
        <nav className="max-w-3xl mx-auto px-6 flex items-center h-full
          overflow-x-auto no-scrollbar">
          {anchors.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={e => scrollToSection(e, id)}
                className="shrink-0 h-full flex items-center px-3 font-body
                  font-medium whitespace-nowrap border-b-2
                  transition-all duration-150"
                style={{
                  fontSize: '0.72rem',
                  color: isActive ? '#C9A84C' : '#6B5F52',
                  borderBottomColor: isActive ? '#C9A84C' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.color = '#A89880'
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.color = '#6B5F52'
                }}
              >
                {label}
              </a>
            )
          })}
        </nav>
      </div>

      {/* Reading progress bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 h-[3px]"
        style={{
          background: '#1C1C1C',
          opacity: progressVisible ? 1 : 0,
          transition: 'opacity 500ms ease',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#C9A84C',
            transition: 'width 80ms linear',
          }}
        />
      </div>
    </>
  )
}
