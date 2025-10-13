// components/NASAEyesCards.tsx
'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import { Orbit, Telescope, Globe, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LoaderWrapper from '@/components/Loader';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

interface CardData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
  features: string[];
}

const nasaCards: CardData[] = [
  {
    title: "Solar System",
    description: "Explore planets, their moons, asteroids, comets and spacecraft in an interactive 3D environment. Travel through time from 1950 to 2050.",
    icon: Orbit,
    color: "from-blue-500 to-cyan-500",
    path: "nasa-eyes/solar-system",
    features: [
      "150+ NASA missions",
      "Real-time positions",
      "Interactive 3D models"
    ]
  },
  {
    title: "Exoplanets",
    description: "Discover over 5,500 exoplanet systems orbiting distant stars. Filter by Earth-sized, rocky planets, or gas giants with real NASA data.",
    icon: Telescope,
    color: "from-purple-500 to-pink-500",
    path: "nasa-eyes/exoplanet",
    features: [
      "5,500+ exoplanets",
      "Advanced filtering",
      "Distance calculator"
    ]
  },
  {
    title: "Earth",
    description: "Track NASA's Earth-observing satellites in real-time. Monitor vital signs like carbon dioxide, sea level, and view recent weather events.",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
    path: "nasa-eyes/earth",
    features: [
      "Real-time satellite tracking",
      "Climate data visualization",
      "Weather event monitoring"
    ]
  },
  {
    title: "Asteroids",
    description: "Track 30,000+ near-Earth asteroids, see the next 5 closest approaches, and explore historic NASA missions to comets and asteroids.",
    icon: Sparkles,
    color: "from-orange-500 to-red-500",
    path: "nasa-eyes/asteroids",
    features: [
      "30,000+ asteroids tracked",
      "Close approach alerts",
      "Mission timelines"
    ]
  }
];

const NASAEyesCards = () => {
  // Disable scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <LoaderWrapper>
      <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        {/* Background effects - responsive sizing */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
        </div>

        {/* Mobile-optimized Back Button */}
        <div className="fixed top-3 sm:top-4 left-3 sm:left-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 active:bg-slate-700/70 border border-slate-600/40 backdrop-blur-sm transition-all duration-300 shadow-lg"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium">Back</span>
            </Link>
          </motion.div> 
        </div>

        {/* Scrollable content container */}
        <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-20 sm:py-24 md:py-16">
          <div className="container mx-auto max-w-7xl relative z-10 w-full">
            {/* Responsive Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-2 sm:mb-3 md:mb-4 leading-tight px-2">
                NASA&apos;s Eyes
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed">
                Explore real NASA data through interactive 3D visualizations
              </p>
            </motion.div>

            {/* Responsive Cards Grid - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {nasaCards.map((card, index) => {
                const Icon = card.icon;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link 
                      href={card.path}
                      className="group block h-full"
                    >
                      <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 overflow-hidden hover:border-slate-500/70 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col min-h-[320px] sm:min-h-[340px] md:min-h-[360px]">
                        
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        
                        {/* Icon - responsive sizing */}
                        <div className="relative mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                        </div>

                        {/* Content - responsive text sizing */}
                        <div className="relative flex-grow flex flex-col">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300 leading-tight" 
                              style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
                            {card.title}
                          </h3>

                          <p className="text-slate-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-200 flex-grow line-clamp-4">
                            {card.description}
                          </p>

                          {/* Features - compact mobile layout */}
                          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                            {card.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${card.color} mr-1.5 sm:mr-2 flex-shrink-0`} />
                                <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA - responsive layout */}
                        <div className="relative flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-700/30 mt-auto">
                          <span className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                            Explore Now
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold">Live</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile-specific bottom padding */}
            <div className="h-8 sm:h-0" />
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default NASAEyesCards;
