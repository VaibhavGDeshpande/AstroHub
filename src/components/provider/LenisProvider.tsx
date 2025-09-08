'use client'
import { FC, ReactNode, useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: ReactNode
}

export const LenisProvider: FC<LenisProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //   direction: 'vertical',
    //   gestureDirection: 'vertical',
    //   smooth: true,
    //   mouseMultiplier: 1,
    //   smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  return <>{children}</>
}
