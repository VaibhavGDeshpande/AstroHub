// components/EnhancedCards.tsx
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cardSections, CardAPI } from './cardData';

const EnhancedCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  // Removed unused hoveredCard state to satisfy eslint no-unused-vars
  const [activeIndices, setActiveIndices] = useState<{ [key: string]: number }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize active indices for each section
    const initialIndices: { [key: string]: number } = {};
    const initialDirections: { [key: string]: number } = {};
    cardSections.forEach(section => {
      initialIndices[section.id] = 0;
      initialDirections[section.id] = 1;
    });
    setActiveIndices(initialIndices);
    setDirection(initialDirections);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotate cards every 4 seconds
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    cardSections.forEach(section => {
      if (section.cards.length >= 3) {
        const interval = setInterval(() => {
          setDirection(prev => ({ ...prev, [section.id]: 1 }));
          setActiveIndices(prev => ({
            ...prev,
            [section.id]: (prev[section.id] + 1) % section.cards.length
          }));
        }, 4000);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  // Navigation handlers
  const handlePrevious = (sectionId: string, cardsLength: number) => {
    setDirection(prev => ({ ...prev, [sectionId]: -1 }));
    setActiveIndices(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] - 1 + cardsLength) % cardsLength
    }));
  };

  const handleNext = (sectionId: string, cardsLength: number) => {
    setDirection(prev => ({ ...prev, [sectionId]: 1 }));
    setActiveIndices(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] + 1) % cardsLength
    }));
  };

  const getBadgeColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      green: 'bg-green-500/10 border-green-500/20 text-green-400',
      indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    };
    return colors[color] || colors.blue;
  };

  const getVisibleCards = (sectionId: string, cards: CardAPI[]) => {
    if (isMobile || cards.length < 3) {
      return [{ card: cards[activeIndices[sectionId] || 0], position: 'center', originalIndex: activeIndices[sectionId] || 0 }];
    }

    const activeIndex = activeIndices[sectionId] || 0;
    const leftIndex = (activeIndex - 1 + cards.length) % cards.length;
    const rightIndex = (activeIndex + 1) % cards.length;

    return [
      { card: cards[leftIndex], position: 'left', originalIndex: leftIndex },
      { card: cards[activeIndex], position: 'center', originalIndex: activeIndex },
      { card: cards[rightIndex], position: 'right', originalIndex: rightIndex }
    ];
  };

  // Smoother animation variants for desktop cards
  const cardVariants = {
    center: {
      scale: 1,
      opacity: 1,
      zIndex: 3,
      filter: 'blur(0px)',
      x: 0,
      transition: {
        duration: 0.5,
      }
    },
    side: {
      scale: 0.88,
      opacity: 0.4,
      zIndex: 1,
      filter: 'blur(2px)',
      transition: {
        duration: 0.5,
      }
    }
  };

  // Smoother mobile card variants with direction support
  const mobileCardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
      transition: {
        duration: 0.4,
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      zIndex: 0,
      transition: {
        duration: 0.4,
      }
    })
  };

  // Faster, smoother content animation
  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      }
    }
  };

  const renderCard = (api: CardAPI, position: string, sectionId: string, originalIndex: number) => {
    const Icon = api.icon;
    const isCenter = position === 'center';

    const cardContent = (
      <motion.div
        layoutId={isMobile ? undefined : `card-${sectionId}-${api.title}`}
        variants={isMobile ? undefined : cardVariants}
        animate={isCenter ? "center" : "side"}
        className="h-full"
      >
        <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 overflow-hidden transition-all duration-300 hover:border-slate-500/70 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 flex flex-col min-h-[400px] cursor-pointer">
          
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${api.color} opacity-0 group-hover:opacity-[0.15] transition-all duration-500 blur-2xl`} />
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon container */}
          <div className="relative mb-6 flex-shrink-0">
            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${api.color} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <Icon className="w-8 h-8 text-white" />
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${api.color} blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-300`} />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
          </div>

          {/* Content - Only animate on center card */}
          <motion.div 
            className="relative flex-grow flex flex-col z-10"
            variants={isCenter ? contentVariants : undefined}
            initial={isCenter ? "hidden" : false}
            animate={isCenter ? "visible" : false}
            key={isCenter ? `content-${sectionId}-${originalIndex}-${activeIndices[sectionId]}` : undefined}
          >
            <motion.h3 
              variants={isCenter ? itemVariants : undefined}
              className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300"
            >
              {api.title}
            </motion.h3>

            <motion.p 
              variants={isCenter ? itemVariants : undefined}
              className="text-slate-400 mb-6 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-200 flex-grow"
            >
              {api.description}
            </motion.p>

            {/* Features */}
            <motion.div 
              variants={isCenter ? contentVariants : undefined}
              className="space-y-3 mb-6"
            >
              {api.features.map((feature: string, idx: number) => (
                <motion.div 
                  key={idx}
                  variants={isCenter ? itemVariants : {}}
                  className="flex items-center group/feature"
                >
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${api.color} mr-3 group-hover:scale-150 group-hover:shadow-lg transition-all duration-200`} />
                  <span className="text-xs text-slate-500 group-hover/feature:text-white transition-colors duration-200 font-medium">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA */}
          <div className="relative flex items-center justify-between pt-5 border-t border-slate-700/30 group-hover:border-slate-600/50 transition-all duration-200 mt-auto z-10">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold bg-gradient-to-r ${api.color} bg-clip-text text-transparent group-hover:text-white transition-all duration-200`}>
                {api.ctaText}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-200" />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Live</span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </motion.div>
    );

    if (!api.external) {
      return (
        <Link href={api.path} className="block h-full">
          {cardContent}
        </Link>
      );
    } else {
      return (
        <a href={api.path} target="_blank" rel="noopener noreferrer" className="block h-full">
          {cardContent}
        </a>
      );
    }
  };

  return (
    <MotionConfig transition={{ duration: 0.4, ease: 'easeInOut' }}>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black py-20 px-4 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Main header */}
          <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-8 leading-tight tracking-tight">
              Explore the Universe
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Access real-time space data, immersive 3D models, and professional sky observation tools
            </p>
            
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <Star className="w-4 h-4 text-blue-400 animate-pulse" />
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
          </div>

          {/* Dynamic Sections with Carousel */}
          {cardSections.map((section) => {
            const visibleCards = getVisibleCards(section.id, section.cards);
            const shouldShowCarousel = section.cards.length >= 3;
            const activeIndex = activeIndices[section.id] || 0;
            const sectionDirection = direction[section.id] || 1;

            return (
              <section key={section.id} className="mb-28">
                <div className="text-center mb-16">
                  <div className="inline-block mb-4">
                    <div className={`flex items-center gap-2 px-4 py-2 ${getBadgeColor(section.badgeColor)} border rounded-full`}>
                      <div className={`w-2 h-2 bg-${section.badgeColor}-400 rounded-full animate-pulse`}></div>
                      <span className="text-xs font-semibold uppercase tracking-wider">{section.badgeText}</span>
                    </div>
                  </div>
                  <h2 className={`text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r ${section.titleGradient} bg-clip-text mb-5 tracking-tight`}>
                    {section.badgeText}
                  </h2>
                  <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
                    {section.subtitle}
                  </p>
                </div>

                {shouldShowCarousel ? (
                  <>
                    {/* Desktop View - Three cards carousel with arrows */}
                    <div className="hidden lg:block relative">
                      {/* Navigation Arrows - Desktop */}
                      <button
                        onClick={() => handlePrevious(section.id, section.cards.length)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-700/90 border border-slate-600/50 flex items-center justify-center hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                      </button>
                      
                      <div className="flex justify-center gap-6 relative w-full mb-8">
                        {visibleCards.map(({ card, position, originalIndex }) => (
                          <div key={`${section.id}-${card.title}`} className="w-1/3">
                            {renderCard(card, position, section.id, originalIndex)}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleNext(section.id, section.cards.length)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-700/90 border border-slate-600/50 flex items-center justify-center hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                      </button>
                    </div>

                    {/* Mobile View - Single card carousel with arrows */}
                    <div className="lg:hidden relative">
                      {/* Navigation Arrows - Mobile */}
                      <div className="flex justify-between items-center mb-4 px-2">
                        <button
                          onClick={() => handlePrevious(section.id, section.cards.length)}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-700/90 border border-slate-600/50 flex items-center justify-center hover:border-purple-500/50 transition-all duration-300"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        
                        <span className="text-sm text-slate-500 font-medium">
                          {activeIndex + 1} / {section.cards.length}
                        </span>

                        <button
                          onClick={() => handleNext(section.id, section.cards.length)}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-700/90 border border-slate-600/50 flex items-center justify-center hover:border-purple-500/50 transition-all duration-300"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>

                      <div className="min-h-[400px] relative mb-8">
                        <AnimatePresence initial={false} mode="wait" custom={sectionDirection}>
                          <motion.div
                            key={`mobile-${section.id}-${activeIndex}`}
                            custom={sectionDirection}
                            variants={mobileCardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0"
                          >
                            {renderCard(visibleCards[0].card, 'center', section.id, visibleCards[0].originalIndex)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Indicator Dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                      {section.cards.map((_, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => {
                            setDirection(prev => ({ 
                              ...prev, 
                              [section.id]: idx > activeIndex ? 1 : -1 
                            }));
                            setActiveIndices(prev => ({ ...prev, [section.id]: idx }));
                          }}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            activeIndex === idx ? 'bg-purple-500' : 'bg-slate-600'
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          animate={{
                            scale: activeIndex === idx ? 1.15 : 1,
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  // Regular grid for sections with fewer than 3 cards
                  <div className={`grid ${section.cards.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6 max-w-4xl mx-auto`}>
                    {section.cards.map((api, index) => (
                      <div
                        key={index}
                        className={`transition-all duration-700 ease-out ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                        style={{ transitionDelay: `${index * 80}ms` }}
                      >
                        {renderCard(api, 'center', section.id, index)}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
};

export default EnhancedCards;
