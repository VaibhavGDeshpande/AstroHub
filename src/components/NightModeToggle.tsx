'use client'

import { useEffect, useState } from 'react'

export default function NightModeToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('night-mode')
      const isOn = stored === '1' || stored === 'true'
      if (isOn) {
        document.documentElement.classList.add('night')
        setEnabled(true)
      }
    } catch {
      // ignore
    }
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const nowOn = !root.classList.contains('night')
    root.classList.toggle('night')
    setEnabled(nowOn)
    try {
      if (nowOn) localStorage.setItem('night-mode', '1')
      else localStorage.removeItem('night-mode')
    } catch {
      // ignore
    }
  }

  return (
    <>
      <button
        id="night-light-filter"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Disable Night Vision' : 'Enable Night Vision'}
        className={`fixed bottom-20 right-4 z-[2147483648]
                    w-12 h-12 rounded-full
                    shadow-lg backdrop-blur
                    flex items-center justify-center
                    border transition-colors
                    focus:outline-none focus:ring-2 focus:ring-white/70
                    ${enabled ? 'bg-red-900/70 border-red-200/80' : 'bg-black/60 border-white/80 hover:bg-black/70'}`}
        title="Night Vision (N)"
      >
        {/* Inline SVG goggles icon */}
        <svg
          width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"
          className="fill-current text-white"
        >
          {/* Strap */}
          <path d="M2 10c0-1.66 1.34-3 3-3h14c1.66 0 3 1.34 3 3v2c0 1.66-1.34 3-3 3h-1.2a3.8 3.8 0 0 1-3.6-2.6l-.2-.6h-2l-.2.6A3.8 3.8 0 0 1 7.2 15H6c-1.66 0-3-1.34-3-3v-2z"/>
          {/* Left lens */}
          <rect x="5" y="9" width="6.5" height="4.5" rx="2.2" />
          {/* Right lens */}
          <rect x="12.5" y="9" width="6.5" height="4.5" rx="2.2" />
          {/* Nose bridge hint */}
          <rect x="11.6" y="10.3" width="0.8" height="2.2" rx="0.4" />
        </svg>
      </button>

      {/* Overlay container (styled in your globals) */}
      <div id="night-overlay" aria-hidden="true" />
    </>
  )
}
