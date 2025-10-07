'use client';

import { useEffect } from 'react';
import Header from '@/components/Home/Header';
import HeroSection from '@/components/Home/HeroSection';
import Cards from '@/components/Cards';
import FactsSection from '../Facts/FactsSection';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Maximize2 } from 'lucide-react';
import Footer from './Footer';

export default function Home() {
  useEffect(() => {
    // Show fullscreen toast after component mounts
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
        pauseOnHover: false,
        closeButton: true,
        theme: "dark",
        className: "!bg-slate-800/95 !border !border-blue-500/20 !backdrop-blur-md",
        toastId: "fullscreen-toast", 
      });
    }, 1000);

    return () => clearTimeout(timer);
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
        
        /* Fix toast container positioning and prevent movement on hover */
        .Toastify__toast-container {
          position: fixed !important;
          top: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
          max-width: 500px !important;
          z-index: 9999 !important;
        }
        
        .Toastify__toast-container--top-center {
          top: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        
        /* Prevent toast movement on hover */
        .Toastify__toast {
          position: relative !important;
          transform: none !important;
          transition: none !important;
          margin-bottom: 0.5rem !important;
        }
        
        .Toastify__toast:hover {
          transform: none !important;
        }
        
        /* Disable any hover animations */
        .Toastify__toast--default:hover,
        .Toastify__toast--info:hover,
        .Toastify__toast--success:hover,
        .Toastify__toast--warning:hover,
        .Toastify__toast--error:hover {
          transform: none !important;
          box-shadow: none !important;
        }
        
        /* Custom toast styling */
        .Toastify__toast {
          background: rgba(30, 41, 59, 0.95) !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 8px !important;
          color: white !important;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900">
        <Header />
        <HeroSection />
        <FactsSection/>
        <Cards />
        <Footer/>
        
        {/* Toast Container for react-toastify */}
        <ToastContainer
          position="top-center"
          newestOnTop={false}
          closeOnClick={false}
          pauseOnHover={false} 
          pauseOnFocusLoss={false} 
          draggable={false} 
          theme="dark"
          limit={1} 
          toastClassName="bg-slate-800/95 border border-blue-500/20 backdrop-blur-md"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            maxWidth: '500px',
            zIndex: 9999
          }}
        />
      </div>
    </>
  );
}
