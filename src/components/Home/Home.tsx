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
          <div className="flex items-center gap-3 p-2">
            <div className="flex-1">
              <div className="text-sm text-gray-300 mb-3">
                View this cosmic journey in fullscreen for the ultimate stargazing experience
              </div>
              <button
                onClick={enterFullscreen}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors w-full justify-center"
              >
                <Maximize2 className="w-4 h-4" />
                Go Fullscreen (F11)
              </button>
            </div>
          </div>
        );

        toast(<ToastContent />, {
          position: "top-center",
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
      {/* Custom CSS to hide scrollbar and fix toast positioning */}
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
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900">
        <Header />
        <HeroSection />
        <FactsSection/>
        <Cards />
        <Footer/>
      </div>
    </>
  );
}
