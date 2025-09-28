// components/ScreenSizeWarningModal.tsx
'use client'
import { useState, useEffect } from 'react';
import { XMarkIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const ScreenSizeWarningModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setScreenSize('mobile');
        setShowModal(true);
      } else if (width < 1024 && width >768) {
        setScreenSize('tablet');
        setShowModal(false);
      } else {
        setScreenSize('desktop');
        setShowModal(false);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleContinue = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop with Space Effects */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-lg">
        {/* Minimal Space Background Effects for Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Reduced nebula effects */}
          <div className="absolute top-5 left-10 w-32 h-32 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl animate-pulse" 
               style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-xl animate-pulse" 
               style={{ animationDuration: '12s', animationDelay: '2s' }} />
          
          {/* Minimal cosmic waves */}
          <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/5 to-transparent animate-wave-move" />
        </div>
      </div>

      {/* Mobile-Optimized Modal Content */}
      <div className="relative flex items-center justify-center min-h-screen p-3">
        <div className="relative w-full max-w-sm bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-blue-500/10 overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-xl border border-blue-400/20 opacity-50 animate-pulse" />
          
          {/* Close button */}
          <button
            onClick={handleContinue}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white hover:text-red-400 transition-all duration-300 group"
          >
            <XMarkIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </button>

          {/* Compact Content */}
          <div className="p-4 text-center relative z-10">
            {/* Compact Warning Icon */}
            <div className="relative mx-auto mb-3 w-12 h-12">
              {/* Single orbital ring */}
              <div className="absolute inset-0 border border-yellow-400/30 rounded-full animate-spin" style={{ animationDuration: '6s' }} />
              
              {/* Central warning icon */}
              <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md shadow-orange-400/30">
                <div className="text-white text-lg font-bold animate-pulse">⚠</div>
              </div>
            </div>

            {/* Compact Title */}
            <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              Better on Desktop
            </h2>

            {/* Device-specific compact message */}
            <div className="space-y-2 mb-4">
              {screenSize === 'mobile' && (
                <>
                  <DevicePhoneMobileIcon className="w-8 h-8 mx-auto text-blue-400" />
                  <p className="text-sm text-slate-300">
                    You&apos;re on <span className="text-blue-400 font-medium">mobile</span>
                  </p>
                </>
              )}
              
              {screenSize === 'tablet' && (
                <>
                  <div className="w-8 h-8 mx-auto text-purple-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-slate-300">
                    You&apos;re on <span className="text-purple-400 font-medium">tablet</span>
                  </p>
                </>
              )}

              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-cyan-400 font-medium">Desktop/laptop</span> offers better experience for 3D models & HD space images.
              </p>
            </div>

            {/* Compact Recommendation */}
            <div className="bg-slate-900/40 rounded-lg p-3 mb-4 border border-slate-700/20">
              <div className="flex items-center justify-center mb-2">
                <ComputerDesktopIcon className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400 font-medium text-sm">Recommended</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• HD NASA imagery</li>
                <li>• 3D Moon/Mars exploration</li>
                <li>• Better performance</li>
              </ul>
            </div>

            {/* Compact Action Button */}
            <div className="space-y-2">
              <button
                onClick={handleContinue}
                className="w-full group relative px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 text-sm"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative flex items-center justify-center space-x-1 z-10">
                  <span>Continue Anyway</span>
                  <span className="text-xs">🚀</span>
                </span>
              </button>

              <p className="text-xs text-slate-500">
                No desktop? Explore the cosmos anyway!
              </p>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-50" />
        </div>
      </div>

      {/* Simplified CSS Animations for Mobile */}
      <style jsx>{`
        @keyframes wave-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-wave-move {
          animation: wave-move 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScreenSizeWarningModal;
