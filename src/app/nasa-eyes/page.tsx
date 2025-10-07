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
    path: "nasa-eyes/exoplanets",
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
    // Add overflow-hidden to body
    document.body.style.overflow = 'hidden';
    
    // Cleanup: Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <LoaderWrapper>
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        </div>

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div> 
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-4">
              NASA&apos;s Eyes
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
              Explore real NASA data through interactive 3D visualizations
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {nasaCards.map((card, index) => {
              const Icon = card.icon;
              
              return (
                <Link 
                  key={index} 
                  href={card.path}
                  className="group"
                >
                  <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 overflow-hidden hover:border-slate-500/70 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[360px]">
                    
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300" 
                          style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
                        {card.title}
                      </h3>

                      <p className="text-slate-400 mb-4 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-200 flex-grow">
                        {card.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {card.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color} mr-2`} />
                            <span className="text-xs text-slate-500 font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="relative flex items-center justify-between pt-3 border-t border-slate-700/30 mt-auto">
                      <span className={`text-sm font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                        Explore Now
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-400 font-semibold">Live</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default NASAEyesCards;
