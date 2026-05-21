'use client'

import { useState } from 'react'
import { getCarImageUrl } from '@/lib/carImage'

interface HeroImageProps {
  marque: string
  modele: string
  anneeDebut: number
  imageUrl?: string
  alt?: string
}

export default function HeroImage({ marque, modele, anneeDebut, imageUrl, alt }: HeroImageProps) {
  const [error, setError] = useState(false)
  const src = imageUrl ?? getCarImageUrl(marque, modele, anneeDebut)

  return (
    <>
      {!error ? (
        <img
          src={src}
          alt={alt ?? `${marque} ${modele}`}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'var(--bg-elevated)' }} />
      )}
      {!error && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #0D0D0D 85%)' }}
        />
      )}
    </>
  )
}
