'use client';
import { useEffect, useState, useRef } from 'react';
import { Orbitron, Inter } from 'next/font/google';
import { ChevronDown } from 'lucide-react';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsVisible(true);

    const video = videoRef.current;
    if (!video) return;

    const handlePlayError = (error: unknown) => {
      console.log('Autoplay prevented:', error);
    };

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(handlePlayError);
    }
  }, []);

  return (
    <section className="relative h-[100dvh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background Video - EARTH */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2"
          autoPlay
          muted
          loop
          playsInline
          preload="auto" 
          style={{
            objectFit: 'cover',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Only loading Earth now. The browser will no longer download Mars. */}
          <source src="/assets/earth.mp4" type="video/mp4" />

          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <div className="space-y-4 sm:space-y-6">
            <h1
              className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            >
              <span
                className={`block text-white ${orbitron.className} astro-hub-text transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                style={{ transitionDelay: '200ms' }}
              >
                AstroHub
              </span>
            </h1>

            <div
              className={`space-y-2 sm:space-y-3 ml-2 sm:ml-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '600ms' }}
            >
              <p
                className={`text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 leading-relaxed font-light ${inter.className} subtitle-text`}
              >
                Your gateway to the cosmos
              </p>
              <p
                className={`text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl ${inter.className} description-text`}
              >
                Explore the universe with astronomical tools, NASA imagery,
                and interactive sky maps. Discover cosmic phenomena from your
                screen.
              </p>
            </div>

            {/* Key Features Tags */}
            {/* <div
              className={`flex flex-wrap gap-2 mt-4 sm:mt-6 ml-2 sm:ml-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '1000ms' }}
            >
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-400/30 hover:bg-blue-500/30 transition-colors duration-300">
              <Link href="/nasa-data">
                NASA APIs
                </Link>
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-400/30 hover:bg-purple-500/30 transition-colors duration-300">
              <Link href="/3d-models">
                3D Models
                </Link>
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs font-medium backdrop-blur-sm border border-green-400/30 hover:bg-green-500/30 transition-colors duration-300">
              <Link href="/space-observations">
                Space Observations
                </Link>
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium backdrop-blur-sm border border-orange-400/30 hover:bg-orange-500/30 transition-colors duration-300">
              <Link href="/space-updates">
                Space Updates
                </Link>
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className={`absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 ease-out cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '1200ms' }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] sm:text-xs text-cyan-200/70 uppercase tracking-[0.2em] font-medium drop-shadow-md">Scroll to reveal</span>
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-bounce drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
      </div>

      <style jsx>{`
        .astro-hub-text {
          font-weight: 900;
          letter-spacing: 0.05em;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3),
            0 0 60px rgba(129, 212, 250, 0.2);
        }

        .subtitle-text {
          font-weight: 300;
          letter-spacing: 0.02em;
          text-shadow: 0 0 20px rgba(129, 212, 250, 0.3);
        }

        .description-text {
          font-weight: 400;
          line-height: 1.7;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .astro-hub-text {
            letter-spacing: 0.03em;
          }

          .subtitle-text {
            font-size: 1.25rem;
          }

          .description-text {
            font-size: 0.95rem;
            line-height: 1.6;
          }
        }

        @media (max-width: 480px) {
          .description-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
