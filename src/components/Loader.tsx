// components/LoaderWrapper.jsx
'use client'
import { useState, useEffect, type ReactNode } from 'react'

// Space Loader Component with animations and visual effects
function SpaceLoaderContent() {
  return (
    <div className="min-h-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Space Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced nebula-like glow effects */}
        <div className="absolute top-10 left-20 w-96 h-96 bg-gradient-radial from-purple-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute top-32 right-32 w-80 h-80 bg-gradient-radial from-blue-500/15 via-blue-500/8 to-transparent rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent rounded-full blur-xl animate-pulse" 
             style={{ animationDuration: '16s', animationDelay: '4s' }} />
        
        {/* Cosmic energy waves */}
        <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-wave-move" />
        <div className="cosmic-wave-2 absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-400/8 to-transparent animate-wave-move-reverse" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-float-particle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-blue-300/80 rounded-full animate-float-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-300/60 rounded-full animate-float-particle" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-cyan-300/80 rounded-full animate-float-particle" style={{ animationDelay: '6s' }} />
      </div>

      {/* Loader Content */}
      <div className="text-center p-8 relative z-10">
        {/* Solar System Loader - Corrected Physics */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Central Sun */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full animate-pulse shadow-lg shadow-orange-400/50" 
               style={{ animationDuration: '3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full blur-sm animate-pulse opacity-60" 
                 style={{ animationDuration: '4s' }} />
          </div>
          
          {/* Orbit Rings - Accurate spacing */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/15 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-white/8 rounded-full" />
          
          {/* Mercury - Fastest orbit (10px radius) */}
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-lg shadow-gray-500/30 animate-mercury-orbit" />
          
          {/* Venus - Second fastest (14px radius) */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-br from-orange-300 to-yellow-500 rounded-full shadow-lg shadow-yellow-500/30 animate-venus-orbit" />
          
          {/* Earth - Reference speed (18px radius) */}
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-green-500 rounded-full shadow-lg shadow-blue-500/30 animate-earth-orbit" />
          
          {/* Mars - Slower than Earth (22px radius) */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/30 animate-mars-orbit" />
          
          {/* Asteroid belt particles */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-gray-300 rounded-full animate-asteroid-1" />
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-gray-400 rounded-full animate-asteroid-2" />
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-gray-200 rounded-full animate-asteroid-3" />
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-float">
            AstroHub
          </h2>
          <p className="text-lg text-slate-300 animate-pulse" style={{ animationDuration: '2.5s' }}>
            Initializing Space Data Portal...
          </p>
        </div>
      </div>

      {/* Accurate CSS Animations with Proper Orbital Physics */}
      <style jsx>{`
        @keyframes wave-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes wave-move-reverse {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(10px, -10px) scale(1.2); opacity: 1; }
          50% { transform: translate(-5px, -20px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(-10px, -5px) scale(1.1); opacity: 0.8; }
        }

        /* Accurate orbital mechanics - Mercury (88 Earth days) */
        @keyframes mercury-orbit {
          0% { 
            transform: translate(-0.75px, -0.75px) rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% { 
            transform: translate(-0.75px, -0.75px) rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }

        /* Venus (225 Earth days) */
        @keyframes venus-orbit {
          0% { 
            transform: translate(-1px, -1px) rotate(0deg) translateX(56px) rotate(0deg);
          }
          100% { 
            transform: translate(-1px, -1px) rotate(360deg) translateX(56px) rotate(-360deg);
          }
        }

        /* Earth (365 Earth days - reference) */
        @keyframes earth-orbit {
          0% { 
            transform: translate(-1.25px, -1.25px) rotate(0deg) translateX(72px) rotate(0deg);
          }
          100% { 
            transform: translate(-1.25px, -1.25px) rotate(360deg) translateX(72px) rotate(-360deg);
          }
        }

        /* Mars (687 Earth days) */
        @keyframes mars-orbit {
          0% { 
            transform: translate(-1px, -1px) rotate(0deg) translateX(88px) rotate(0deg);
          }
          100% { 
            transform: translate(-1px, -1px) rotate(360deg) translateX(88px) rotate(-360deg);
          }
        }

        /* Asteroid belt particles */
        @keyframes asteroid-1 {
          0% { 
            transform: translate(-0.25px, -0.25px) rotate(0deg) translateX(80px) rotate(0deg);
          }
          100% { 
            transform: translate(-0.25px, -0.25px) rotate(360deg) translateX(80px) rotate(-360deg);
          }
        }

        @keyframes asteroid-2 {
          0% { 
            transform: translate(-0.25px, -0.25px) rotate(120deg) translateX(80px) rotate(0deg);
          }
          100% { 
            transform: translate(-0.25px, -0.25px) rotate(480deg) translateX(80px) rotate(-360deg);
          }
        }

        @keyframes asteroid-3 {
          0% { 
            transform: translate(-0.25px, -0.25px) rotate(240deg) translateX(80px) rotate(0deg);
          }
          100% { 
            transform: translate(-0.25px, -0.25px) rotate(600deg) translateX(80px) rotate(-360deg);
          }
        }

        .animate-wave-move {
          animation: wave-move 40s linear infinite;
        }

        .animate-wave-move-reverse {
          animation: wave-move-reverse 50s linear infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 15s ease-in-out infinite;
        }

        /* Realistic orbital speeds based on actual planetary periods */
        .animate-mercury-orbit {
          animation: mercury-orbit 4s linear infinite;
        }

        .animate-venus-orbit {
          animation: venus-orbit 7s linear infinite;
        }

        .animate-earth-orbit {
          animation: earth-orbit 10s linear infinite;
        }

        .animate-mars-orbit {
          animation: mars-orbit 18s linear infinite;
        }

        .animate-asteroid-1 {
          animation: asteroid-1 15s linear infinite;
        }

        .animate-asteroid-2 {
          animation: asteroid-2 15s linear infinite;
        }

        .animate-asteroid-3 {
          animation: asteroid-3 15s linear infinite;
        }
      `}</style>
    </div>
  )
}

// Combined unified loader component
export default function LoaderWrapper({ 
  children,
  isVisible,
  onComplete,
  minDuration = 2000
}: { 
  children?: ReactNode
  isVisible?: boolean
  onComplete?: () => void
  minDuration?: number
}) {
  const [showLoader, setShowLoader] = useState(isVisible ?? true)

  useEffect(() => {
    if (isVisible !== undefined) {
      setShowLoader(isVisible)
    }
  }, [isVisible])

  useEffect(() => {
    if (!showLoader && isVisible === undefined) return

    const start = Date.now()

    // Auto-hide timer for standalone usage (when isVisible is undefined)
    let autoHideTimer: NodeJS.Timeout | undefined
    if (isVisible === undefined) {
      autoHideTimer = setTimeout(() => {
        setShowLoader(false)
      }, minDuration)
    }

    // Callback timer for controlled usage (when isVisible is provided)
    let callbackTimer: NodeJS.Timeout | undefined
    if (!showLoader && onComplete) {
      const remaining = Math.max(0, minDuration - (Date.now() - start))
      callbackTimer = setTimeout(() => {
        onComplete()
      }, remaining)
    }

    return () => {
      if (autoHideTimer) clearTimeout(autoHideTimer)
      if (callbackTimer) clearTimeout(callbackTimer)
    }
  }, [showLoader, isVisible, onComplete, minDuration])

  if (showLoader) {
    return <SpaceLoaderContent />
  }

  return <>{children}</>
}

// Export SpaceLoader as a separate component for backward compatibility
export function SpaceLoader({
  isVisible,
  onComplete,
  minDuration = 0,
}: {
  isVisible: boolean
  onComplete?: () => void
  minDuration?: number
}) {
  return (
    <LoaderWrapper 
      isVisible={isVisible} 
      onComplete={onComplete} 
      minDuration={minDuration}
    />
  )
}
