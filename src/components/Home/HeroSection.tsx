// components/HeroSection.tsx
'use client'
import { useEffect, useState, useRef } from 'react';

const HeroSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [videoStopped, setVideoStopped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Video control logic
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Reset video to start from beginning
      video.currentTime = 0;
      
      // Increase video playback speed
      video.playbackRate = 2.5; // 1.5x speed - adjust as needed (1.2x, 1.5x, 2x, etc.)
      
      // Play the video
      video.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });

      // Add event listener to stop at 14.30 seconds
      const handleTimeUpdate = () => {
        if (video.currentTime >= 14.30) {
          video.pause();
          // Trigger text animations after video stops
          setTimeout(() => {
            setVideoStopped(true);
            setIsVisible(true);
          }, 500); // Small delay after video stops before text appears
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      // Cleanup function
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          >
            <source src="/assets/eclipse.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for better text readability on left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content - Left Aligned - Only visible after video stops */}
        <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 transition-all duration-1000 ease-out ${
                videoStopped && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                <span className={`block text-white astro-hub-text transition-all duration-1000 ease-out ${
                  videoStopped && isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`} style={{ transitionDelay: '200ms' }}>
                  AstroHub
                </span>
              </h1>

              {/* Subtitle/Description */}
              <div className={`space-y-3 ml-4 transition-all duration-1000 ease-out ${
                videoStopped && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '600ms' }}>
                <p className="text-lg md:text-xl lg:text-2xl text-cyan-100 leading-relaxed font-light subtitle-text">
                  Your gateway to the cosmos
                </p>
                <p className={`text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl description-text transition-all duration-1000 ease-out ${
                  videoStopped && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`} style={{ transitionDelay: '800ms' }}>
                  Explore the universe with astronomical tools, NASA imagery, 
                  and interactive sky maps. Discover cosmic phenomena from your screen.
                </p>
              </div>

              {/* Key Features Tags */}
              <div className={`flex flex-wrap gap-2 mt-6 ml-4 transition-all duration-1000 ease-out ${
                videoStopped && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ transitionDelay: '1000ms' }}>
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
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            letter-spacing: 0.05em;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.3),
                         0 0 60px rgba(129, 212, 250, 0.2);
          }

          .subtitle-text {
            font-family: 'Inter', sans-serif;
            font-weight: 300;
            letter-spacing: 0.02em;
            text-shadow: 0 0 20px rgba(129, 212, 250, 0.3);
          }

          .description-text {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            line-height: 1.7;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          /* Responsive typography adjustments */
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
    </>
  );
};

export default HeroSection;
