// components/HeroSection.tsx
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, GlobeAltIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  // Removed unused mouse tracking
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);

    // no-op

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const stats = [
    { label: 'APIs Available', value: '8+', icon: SparklesIcon },
    { label: 'Space Images', value: '1M+', icon: GlobeAltIcon },
    { label: 'Data Sources', value: '24/7', icon: RocketLaunchIcon },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-black/95 backdrop-blur-lg">
      {/* Enhanced Space Effects Background (No Comets) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced nebula-like glow effects */}
        <div className="absolute top-10 left-20 w-96 h-96 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s' }} />
        <div className="absolute top-32 right-32 w-80 h-80 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent rounded-full blur-xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '4s' }} />
        
        {/* Cosmic energy waves */}
        <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/8 to-transparent animate-wave-move" />
        <div className="cosmic-wave-2 absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-400/6 to-transparent animate-wave-move-reverse" />
        
        {/* Enhanced particle streams */}
        {/* <div className="particle-stream absolute top-10 left-16 w-1 h-24 bg-gradient-to-b from-blue-300/50 to-transparent animate-stream" />
        <div className="particle-stream absolute top-20 right-24 w-0.5 h-20 bg-gradient-to-b from-purple-300/40 to-transparent animate-stream-delayed" />
        <div className="particle-stream absolute top-8 left-1/3 w-0.5 h-28 bg-gradient-to-b from-cyan-300/35 to-transparent animate-stream-slow" />
        <div className="particle-stream absolute top-16 right-1/4 w-0.5 h-16 bg-gradient-to-b from-pink-300/30 to-transparent animate-stream-fast" /> */}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-6">
        <div className="space-y-8">
          {/* Main Title with Enhanced Animation */}
          <div className="space-y-4">
            <h1 className={`text-6xl md:text-8xl font-bold text-white mb-6 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <span className={`block transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`} style={{ transitionDelay: '200ms' }}>
                NASA
              </span>
              <span className={`block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-float transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`} style={{ transitionDelay: '400ms' }}>
                Explorer
              </span>
            </h1>
          </div>

          {/* Subtitle with Staggered Animation */}
          <div className={`space-y-4 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '600ms' }}>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover the wonders of space through NASA&apos;s vast data universe.
            </p>
            <p className={`text-lg text-slate-400 max-w-2xl mx-auto transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ transitionDelay: '800ms' }}>
              Access real-time astronomy data, Mars rover images, Earth imagery, and explore the cosmos like never before.
            </p>
          </div>

          {/* Enhanced Call-to-Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1000ms' }}>
            <Link
              href="#explore"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            >
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <span className="relative flex items-center space-x-2 z-10">
                <RocketLaunchIcon className="h-5 w-5 group-hover:animate-bounce transition-transform duration-300" />
                <span className="group-hover:animate-pulse">Start Exploring</span>
              </span>
            </Link>
            
            <Link
              href="/documentation"
              className="group relative px-8 py-4 border border-slate-600 rounded-full text-white overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-blue-400 hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/20"
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-100 transition-all duration-500" />
              
              <span className="relative flex items-center space-x-2 z-10">
                <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>View Documentation</span>
              </span>
            </Link>
          </div>

          {/* Enhanced Stats Section */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1200ms' }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-500 hover:bg-slate-800/50 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${1400 + (index * 100)}ms` }}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex flex-col items-center space-y-2 z-10">
                  <stat.icon className="h-8 w-8 text-blue-400 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                  <div className="text-2xl font-bold text-white group-hover:animate-pulse">{stat.value}</div>
                  <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Live Time Display */}
          <div className={`mt-12 mb-10 p-4 bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-lg max-w-md mx-auto relative overflow-hidden transition-all duration-1000 ease-out hover:border-blue-500/50 hover:bg-slate-900/60 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '1800ms' }}>
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-lg border border-blue-400/30 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 ">
              <div className="text-sm text-slate-400 mb-1">Mission Time (UTC)</div>
              <div className="font-mono text-lg text-blue-400 animate-pulse">
                {currentTime.toISOString().replace('T', ' ').slice(0, 19)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations (No Comet Effects) */}
      <style jsx>{`
        @keyframes wave-move {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes wave-move-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes stream {
          0% {
            opacity: 0;
            transform: translateY(-30px) scaleY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateY(30px) scaleY(0.3);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-wave-move {
          animation: wave-move 20s linear infinite;
        }

        .animate-wave-move-reverse {
          animation: wave-move-reverse 25s linear infinite;
        }

        .animate-stream {
          animation: stream 4s ease-in-out infinite;
        }

        .animate-stream-delayed {
          animation: stream 5s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-stream-slow {
          animation: stream 7s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-stream-fast {
          animation: stream 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
