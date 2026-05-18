'use client'

import { useState } from 'react'

export default function HeroImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false)
  const showImage = Boolean(src) && !error

  return (
    <>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'var(--bg-elevated)' }} />
      )}
      {showImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #0D0D0D 85%)' }}
        />
      )}
    </>
  )
}
