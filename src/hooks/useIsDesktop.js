'use client'
import { useState, useEffect } from 'react'

export function useIsDesktop() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const fn = () => setWide(window.innerWidth >= 768)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return wide
}
