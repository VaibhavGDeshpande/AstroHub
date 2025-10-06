'use client';
import { useEffect, useState, useRef } from 'react';
import { Orbitron, Inter } from 'next/font/google';

// Configure fonts with optimization
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
  const [videoStopped, setVideoStopped] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [, setRequiresInteraction] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && !videoPlayed) {
      const video = videoRef.current;

      // Set video properties
      video.currentTime = 0;
      video.playbackRate = 4.5;

      // Handle video ended event
      const handleVideoEnded = () => {
        console.log('Video finished playing');
        setVideoStopped(true);
        setVideoPlayed(true);

        // Show text content with smooth transition
        setTimeout(() => {
          setIsVisible(true);
        }, 200);
      };

      // Handle autoplay restriction errors
      const handlePlayError = (error: unknown) => {
        console.log('Video autoplay failed:', error);
        setRequiresInteraction(true);
      };

      // Handle video load errors
      const handleVideoError = () => {
        console.error('Video failed to load');
        setVideoStopped(true);
        setVideoPlayed(true);
        setIsVisible(true);
      };

      // Add event listeners
      video.addEventListener('ended', handleVideoEnded);
      video.addEventListener('error', handleVideoError);

      // Attempt to autoplay video
      video.play().catch(handlePlayError);

      return () => {
        video.removeEventListener('ended', handleVideoEnded);
        video.removeEventListener('error', handleVideoError);
      };
    }
  }, [videoPlayed]);


  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            videoStopped ? 'opacity-100' : 'opacity-100'
          }`}
          muted
          playsInline
          preload="metadata"
          style={{
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <source src="/assets/eclipse - Trim.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            videoStopped
              ? 'bg-gradient-to-r from-black/90 via-black/60 to-black/30'
              : 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
          }`}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <div className="space-y-6">
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 transition-all duration-1000 ease-out ${
                videoStopped && isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <span
                className={`block text-white ${orbitron.className} astro-hub-text transition-all duration-1000 ease-out ${
                  videoStopped && isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                AstroHub
              </span>
            </h1>

            <div
              className={`space-y-3 ml-4 transition-all duration-1000 ease-out ${
                videoStopped && isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <p
                className={`text-lg md:text-xl lg:text-2xl text-cyan-100 leading-relaxed font-light ${inter.className} subtitle-text`}
              >
                Your gateway to the cosmos
              </p>
              <p
                className={`text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl ${inter.className} description-text transition-all duration-1000 ease-out ${
                  videoStopped && isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                Explore the universe with astronomical tools, NASA imagery,
                and interactive sky maps. Discover cosmic phenomena from your
                screen.
              </p>
            </div>

            {/* Key Features Tags */}
            <div
              className={`flex flex-wrap gap-2 mt-6 ml-4 transition-all duration-1000 ease-out ${
                videoStopped && isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-400/30 hover:bg-blue-500/30 transition-colors duration-300">
                NASA APIs
              </span>
              <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-400/30 hover:bg-purple-500/30 transition-colors duration-300">
                Sky Maps
              </span>
              <span className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs font-medium backdrop-blur-sm border border-green-400/30 hover:bg-green-500/30 transition-colors duration-300">
                Planets
              </span>
              <span className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium backdrop-blur-sm border border-orange-400/30 hover:bg-orange-500/30 transition-colors duration-300">
                Mars Rovers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
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
