'use client';

import { useEffect } from 'react';
import Header from '@/components/Home/Header';
import HeroSection from '@/components/Home/HeroSection';
import Cards from '@/components/Cards';
import FactsSection from '../Facts/FactsSection';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Maximize2 } from 'lucide-react';
import Footer from './Footer';

export default function Home() {
  useEffect(() => {
    // Check if toast has been shown this session using sessionStorage
    const hasSeenToast = sessionStorage.getItem('hasSeenFullscreenToast');

    // Only show toast if not shown in this session
    if (!hasSeenToast) {
      const timer = setTimeout(() => {
        const enterFullscreen = async () => {
          try {
            await document.documentElement.requestFullscreen();
            toast.success('🌌 Welcome to the cosmic fullscreen experience!', {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
          } catch {
            toast.error('Unable to enter fullscreen mode', {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
          }
        };

        const ToastContent = () => (
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2">
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3">
                View this cosmic journey in fullscreen for the ultimate stargazing experience
              </div>
              <button
                onClick={enterFullscreen}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors w-full justify-center"
              >
                <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Go Fullscreen (F11)</span>
              </button>
            </div>
          </div>
        );

        toast(<ToastContent />, {
          position: window.innerWidth < 640 ? "top-center" : "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          closeButton: true,
          theme: "dark",
          className: "!bg-slate-800/95 !border !border-blue-500/20 !backdrop-blur-md",
          toastId: "fullscreen-toast",
        });

        // Mark that the toast has been shown this session
        sessionStorage.setItem('hasSeenFullscreenToast', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Custom CSS for scrollbar and responsive toast positioning */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        html,
        body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Ensure scrolling still works */
        html,
        body {
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Responsive toast container positioning */
        .Toastify__toast-container {
          width: auto !important;
          max-width: 95vw !important;
          padding: 0.5rem !important;
        }

        /* Mobile toast positioning */
        @media only screen and (max-width: 640px) {
          .Toastify__toast-container--bottom-center {
            bottom: 1rem !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: calc(100vw - 2rem) !important;
            max-width: 100% !important;
          }

          .Toastify__toast-container--top-center {
            top: 5rem !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: calc(100vw - 2rem) !important;
          }
        }

        /* Tablet toast positioning */
        @media only screen and (min-width: 641px) and (max-width: 768px) {
          .Toastify__toast-container {
            max-width: 90vw !important;
          }
        }

        /* Desktop toast positioning */
        @media only screen and (min-width: 769px) {
          .Toastify__toast-container {
            max-width: 500px !important;
          }

          .Toastify__toast-container--top-center {
            top: 5rem !important;
          }
        }

        /* Responsive toast body */
        .Toastify__toast {
          font-size: 0.875rem !important;
          padding: 0.75rem !important;
          min-height: auto !important;
          border-radius: 0.5rem !important;
        }

        @media only screen and (max-width: 640px) {
          .Toastify__toast {
            font-size: 0.8125rem !important;
            padding: 0.625rem !important;
            margin-bottom: 0 !important;
          }
        }

        /* Close button responsive sizing */
        .Toastify__close-button {
          opacity: 0.7 !important;
        }

        @media only screen and (max-width: 640px) {
          .Toastify__close-button {
            width: 1.25rem !important;
            height: 1.25rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900">
        <Header />
        <HeroSection />
        <FactsSection />
        <Cards />
        <Footer />
      </div>
    </>
  );
}
