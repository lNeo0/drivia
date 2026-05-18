'use client'

import { useState } from 'react'

export default function CardImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false)
  const showImage = Boolean(src) && !error

  if (!showImage) {
    return (
      <div
        style={{
          height: '120px',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="1.25"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M5 17H3a2 2 0 0 1-2-2v-4l2.5-5h13L19 11v4a2 2 0 0 1-2 2h-2" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
      </div>
    )
  }

  return (
    <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          display: 'block',
        }}
        onError={() => setError(true)}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #141414 0%, rgba(13,13,13,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
