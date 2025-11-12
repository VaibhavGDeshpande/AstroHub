'use client'

import { useEffect, useState } from 'react'

export function useNightMode() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('night')
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    const update = () => {
      setEnabled(root.classList.contains('night'))
    }

    update()

    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'night-mode') update()
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return enabled
}
