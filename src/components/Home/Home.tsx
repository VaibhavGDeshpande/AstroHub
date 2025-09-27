'use client';

import { useEffect } from 'react';
import Header from '@/components/Home/Header';
import HeroSection from '@/components/Home/HeroSection';
import Cards from '@/components/Cards';
import Demo from '../example/example'; // Adjust path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Stars, Maximize2 } from 'lucide-react';

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
        } catch (error) {
          toast.error('Unable to enter fullscreen mode', {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
        }
      };

      const ToastContent = () => (
        <div className="flex items-center gap-3 p-2">
          <Stars className="w-6 h-6 text-blue-400 flex-shrink-0" />
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
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
        theme: "dark",
        className: "!bg-slate-800/95 !border !border-blue-500/20 !backdrop-blur-md",
        toastId: "fullscreen-toast", // Prevent duplicate toasts
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <HeroSection />
      <Demo/>
      <Cards />
      
      {/* Toast Container for react-toastify */}
      <ToastContainer
        position="top-center"
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-slate-800/95 border border-blue-500/20 backdrop-blur-md"
        style={{
          '--toastify-color-dark': 'rgba(30, 41, 59, 0.95)',
        } as React.CSSProperties}
      />
    </div>
  );
}