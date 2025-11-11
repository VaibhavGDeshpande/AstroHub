// app/advanced-tools/page.tsx
'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import { Telescope, Camera} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

interface CardData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
  features: string[];
  badge?: string;
}

const toolCards: CardData[] = [
  {
    title: "Telescope Calculator",
    description: "Calculate telescope performance with different eyepieces. Visualize field of view overlays on real sky images.",
    icon: Telescope,
    color: "from-blue-500 to-cyan-500",
    path: "/advanced-tools/telescope-calculator",
    badge: "Planning",
    features: [
      "FOV calculations",
      "Eyepiece comparison",
      "Sky image overlays",
      "Magnification analysis"
    ]
  },
  {
    title: "Astrophotography Exposure",
    description: "Plan perfect night sky photography with light pollution analysis. Get optimized exposure settings instantly.",
    icon: Camera,
    color: "from-purple-500 to-pink-500",
    path: "/advanced-tools/exposure-calculator",
    badge: "Imaging",
    features: [
      "Bortle scale (1-9)",
      "NPF & 500 rule",
      "7 target types",
      "Shooting checklist"
    ]
  }
];

export default function AdvancedToolsPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[32rem] md:h-[32rem] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition-all duration-300 shadow-lg"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <HomeIcon className="h-4 w-4 hidden sm:block" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </motion.div> 
      </div>

      {/* Main Content - Centered */}
      <div className="h-full flex flex-col items-center justify-center px-4 md:px-8">
        <div className="container mx-auto max-w-6xl relative z-10 w-full">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-2 md:mb-3 leading-tight">
              Advanced Observation Tools
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Professional calculators for telescope planning and astrophotography exposure
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-4 md:mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm text-slate-300 font-medium">Real-time</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
                <Telescope className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                <span className="text-xs md:text-sm text-slate-300 font-medium">Planning</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
                <Camera className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                <span className="text-xs md:text-sm text-slate-300 font-medium">Imaging</span>
              </div>
            </div>
          </motion.div>

          {/* Cards Grid - Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {toolCards.map((card, index) => {
              const Icon = card.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                >
                  <Link 
                    href={card.path}
                    className="group block h-full"
                  >
                    <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl p-4 md:p-6 overflow-hidden hover:border-slate-500/70 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col">
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      {/* Badge */}
                      {card.badge && (
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                          <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${card.color} text-white text-[10px] md:text-xs font-bold shadow-lg`}>
                            {card.badge}
                          </div>
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className="relative mb-3 md:mb-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative flex-grow flex flex-col">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300 leading-tight">
                          {card.title}
                        </h3>

                        <p className="text-slate-400 mb-3 md:mb-4 text-xs md:text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-200">
                          {card.description}
                        </p>

                        {/* Features - Compact */}
                        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                          {card.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color} mr-2 flex-shrink-0 mt-1`} />
                              <span className="text-[11px] md:text-xs text-slate-400 group-hover:text-slate-300 font-medium leading-tight transition-colors duration-200">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="relative flex items-center justify-between pt-3 border-t border-slate-700/30 mt-auto">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs md:text-sm font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                            Launch Calculator
                          </span>
                          <svg 
                            className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
                          <span className="text-xs text-emerald-400 font-bold">Active</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Info Section - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 md:mt-6 max-w-4xl mx-auto"
          >
          </motion.div>

        </div>
      </div>
    </div>
  );
}
