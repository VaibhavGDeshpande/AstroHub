/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cardSections, CardAPI } from './cardData';
import { shouldPrefetchRoute } from '@/lib/routePrefetch';

const EnhancedCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(cardSections[0].id);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getBadgeColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400 focus-visible:ring-blue-500/50',
      green: 'bg-green-500/10 border-green-500/20 text-green-400 focus-visible:ring-green-500/50',
      indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 focus-visible:ring-indigo-500/50',
      emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 focus-visible:ring-emerald-500/50',
      cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 focus-visible:ring-cyan-500/50',
      purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400 focus-visible:ring-purple-500/50',
      yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 focus-visible:ring-yellow-500/50',
      red: 'bg-red-500/10 border-red-500/20 text-red-400 focus-visible:ring-red-500/50',
      gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400 focus-visible:ring-gray-500/50',
    };
    return colors[color] || colors.blue;
  };

  const getGradientFromColor = (color: string) => {
    const gradients: { [key: string]: string } = {
      blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/30',
      green: 'from-green-600/20 to-green-900/10 border-green-500/30',
      indigo: 'from-indigo-600/20 to-indigo-900/10 border-indigo-500/30',
      emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/30',
      cyan: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/30',
      purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/30',
      yellow: 'from-yellow-600/20 to-yellow-900/10 border-yellow-500/30',
      red: 'from-red-600/20 to-red-900/10 border-red-500/30',
      gray: 'from-slate-600/20 to-slate-900/10 border-slate-500/30',
    };
    return gradients[color] || gradients.blue;
  };

  const renderCard = (api: CardAPI, originalIndex: number) => {
    const Icon = api.icon;
    
    const cardContent = (
      <div className={`relative h-full w-full bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-slate-500/70 hover:shadow-[0_15px_40px_rgba(8,_112,_184,_0.08)] hover:-translate-y-1.5 flex flex-col group`}>
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${api.color} opacity-0 group-hover:opacity-[0.08] transition-all duration-500 blur-xl`} />

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex flex-col mb-4">
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 mb-4`}>
              <Icon className={`w-6 h-6 text-white`} />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${api.color} blur-md opacity-0 group-hover:opacity-60 transition-all duration-300`} />
            </div>

            <h3 className={`font-bold text-white mb-2 text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300`}>
              {api.title}
            </h3>
            <p className={`text-slate-400 leading-relaxed font-light text-sm line-clamp-3`}>
              {api.description}
            </p>
          </div>

          <div className="flex-grow" />

          <div className={`space-y-2 mb-6`}>
            {api.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center group/feature">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${api.color} mr-3 group-hover/feature:scale-125 transition-all duration-200`} />
                <span className="text-sm text-slate-500 group-hover/feature:text-slate-300 transition-colors duration-200">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className={`relative flex items-center justify-between pt-4 border-t border-slate-700/30 group-hover:border-slate-600/50 transition-all duration-200`}>
            <div className="flex items-center gap-2 group/cta">
              <span className={`text-sm font-semibold bg-gradient-to-r ${api.color} bg-clip-text text-transparent transition-all duration-200`}>
                {api.ctaText}
              </span>
              <ArrowRight className={`w-4 h-4 text-slate-400 group-hover/cta:text-white group-hover/cta:translate-x-1.5 transition-all duration-200`} />
            </div>

            {api.status && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className={`w-1.5 h-1.5 rounded-full ${api.status === 'Live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping border border-transparent ${api.status === 'Live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${api.status === 'Live' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {api.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const wrapWithLink = (content: React.ReactNode) => {
      if (!api.external) {
        return (
          <Link href={api.path} prefetch={shouldPrefetchRoute(api.path)} className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-2xl">
            {content}
          </Link>
        );
      } else {
        return (
          <a href={api.path} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-2xl">
            {content}
          </a>
        );
      }
    };

    return (
      <motion.div
        key={`${activeTab}-${api.title}`}
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ duration: 0.4, delay: originalIndex * 0.05 }}
        className="h-full"
      >
        {wrapWithLink(cardContent)}
      </motion.div>
    );
  };

  const activeSection = cardSections.find(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] py-16 sm:py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto max-w-[1400px] relative z-10 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          id="tour-features-directory"
          className="mb-12 lg:mb-20 text-center md:text-left md:flex items-end justify-between border-b border-slate-800/60 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/30 border border-slate-700/50 mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Platform Directory</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Command Center
            </h1>
            <p className="text-lg text-slate-400 font-light">
              Explore our suite of astronomical tools, telemetry access points, and interactive simulations. 
            </p>
          </div>
        </motion.div>

        {/* Command Center Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Sidebar Navigation */}
          <motion.div 
            className="w-full lg:w-72 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-24 bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2">Navigation</h3>
              
              {/* Mobile Horizontal Scroll / Desktop Vertical List */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {cardSections.map((section) => {
                  const isActive = activeTab === section.id;
                  const baseBadge = getBadgeColor(section.badgeColor);
                  const activeGradient = getGradientFromColor(section.badgeColor);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`relative flex items-center justify-between w-full p-3 sm:p-4 rounded-xl text-left transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-slate-400
                        ${isActive 
                          ? `bg-gradient-to-br ${activeGradient} shadow-lg` 
                          : 'hover:bg-slate-800/40 border border-transparent hover:border-slate-700/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                          ${isActive ? 'bg-slate-900/50' : 'bg-slate-800/80 group-hover:bg-slate-700/80'}
                        `}>
                          <div className={`w-2 h-2 rounded-full ${isActive ? `bg-${section.badgeColor}-400 animate-pulse shadow-[0_0_10px_currentColor]` : 'bg-slate-600'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                            {section.badgeText}
                          </span>
                          {isActive && (
                            <span className="text-[10px] text-slate-400 capitalize hidden sm:block">
                              {section.cards.length} Modules
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 border-2 rounded-xl pointer-events-none"
                          style={{ borderColor: `var(--${section.badgeColor}-500, #3b82f6)`, opacity: 0.3 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0 relative">
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 lg:mb-8 pb-4 border-b border-slate-800/60 hidden lg:block">
                    <h2 className="text-2xl font-bold text-white mb-2">{activeSection.subtitle}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase tracking-widest">{activeSection.badgeText} Directory</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <span className="text-xs text-slate-500">{activeSection.cards.length} Services Available</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                    {activeSection.cards.map((api, index) => renderCard(api, index))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EnhancedCards;
