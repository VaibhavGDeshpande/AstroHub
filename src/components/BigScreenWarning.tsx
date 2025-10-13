'use client'
import { useState, useEffect, useCallback } from 'react';
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const ScreenSizeWarningModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const handleClose = useCallback(() => {
    setShowModal(false);
    // Store user preference in localStorage to not show again this session
    sessionStorage.setItem('modalDismissed', 'true');
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const modalDismissed = sessionStorage.getItem('modalDismissed');
      
      if (width < 768) {
        setScreenSize('mobile');
        // Only show modal if not previously dismissed
        if (!modalDismissed) {
          setShowModal(true);
        }
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet');
        setShowModal(false);
      } else {
        setScreenSize('desktop');
        setShowModal(false);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Keyboard accessibility - ESC key to close
  useEffect(() => {
    if (!showModal) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, handleClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop with Space Effects */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-lg"
        onClick={handleBackdropClick}
      >
        {/* Minimal Space Background Effects for Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Reduced nebula effects */}
          <div 
            className="absolute top-5 left-10 w-32 h-32 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl animate-pulse" 
            style={{ animationDuration: '8s' }} 
          />
          <div 
            className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-xl animate-pulse" 
            style={{ animationDuration: '12s', animationDelay: '2s' }} 
          />
          
          {/* Minimal cosmic waves */}
          <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/5 to-transparent animate-wave-move" />
        </div>
      </div>

      {/* Mobile-Optimized Modal Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="relative w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl border border-blue-400/20 opacity-50 animate-pulse" />
          
          {/* Close button - Enhanced for accessibility */}
          {/* <button
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-red-400 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <XMarkIcon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
          </button> */}

          {/* Compact Content */}
          <div className="p-6 sm:p-8 text-center relative z-10">
            {/* Compact Warning Icon */}
            <div className="relative mx-auto mb-4 w-16 h-16">
              {/* Single orbital ring */}
              <div 
                className="absolute inset-0 border-2 border-yellow-400/30 rounded-full animate-spin" 
                style={{ animationDuration: '6s' }} 
              />
              
              {/* Central warning icon */}
              <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-400/30">
                <div className="text-white text-2xl font-bold animate-pulse">⚠</div>
              </div>
            </div>

            {/* Title */}
            <h2 
              id="modal-title"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3"
            >
              Better on Desktop
            </h2>

            {/* Device-specific message */}
            <div id="modal-description" className="space-y-3 mb-6">
              {screenSize === 'mobile' && (
                <>
                  <DevicePhoneMobileIcon className="w-10 h-10 mx-auto text-blue-400" />
                  <p className="text-base text-slate-300">
                    You&apos;re on <span className="text-blue-400 font-semibold">mobile</span>
                  </p>
                </>
              )}
              
              {screenSize === 'tablet' && (
                <>
                  <div className="w-10 h-10 mx-auto text-purple-400 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <p className="text-base text-slate-300">
                    You&apos;re on <span className="text-purple-400 font-semibold">tablet</span>
                  </p>
                </>
              )}

              <p className="text-sm text-slate-400 leading-relaxed px-2">
                <span className="text-cyan-400 font-medium">Desktop/laptop</span> offers better experience for 3D models & HD space images.
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700/30">
              <div className="flex items-center justify-center mb-3">
                <ComputerDesktopIcon className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-green-400 font-semibold text-base">Recommended</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1.5 text-left max-w-xs mx-auto">
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  HD NASA imagery
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  3D Models Exploration
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  Better performance
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="space-y-3">
              <button
                onClick={handleClose}
                className="w-full group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-95"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative flex items-center justify-center space-x-2 z-10">
                  <span>Continue Anyway</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">🚀</span>
                </span>
              </button>

              <p className="text-xs text-slate-500">
                No desktop? Explore the cosmos anyway!
              </p>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-60" />
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

        kbd {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ScreenSizeWarningModal;
