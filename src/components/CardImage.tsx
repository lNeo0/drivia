'use client'

import { useState } from 'react'

export default function CardImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false)
  const showImage = Boolean(src) && !error

  if (!showImage) {
    return (
      <div
        className="aspect-video flex items-center justify-center"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <svg
          width="40" height="40" viewBox="0 0 24 24" fill="none"
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
    <div className="relative aspect-video overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setError(true)}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #141414 0%, transparent 60%)' }}
      />
    </div>
  )
}
