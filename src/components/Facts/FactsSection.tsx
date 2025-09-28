// components/Demo.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FactsSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Use ref instead of state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const astronomyFacts = [
    {
      emoji: "🔭",
      text: "The Hubble Space Telescope has traveled over 4 billion miles in its orbit, equivalent to a round trip to Neptune."
    },
    {
      emoji: "🌌",
      text: "The Milky Way galaxy contains an estimated 100-400 billion stars and is approximately 13.6 billion years old."
    },
    {
      emoji: "⚫",
      text: "Sagittarius A*, the supermassive black hole at our galaxy's center, has a mass equivalent to 4 million suns."
    },
    {
      emoji: "🪐",
      text: "Saturn's rings are composed of billions of ice and rock particles, ranging from tiny grains to house-sized chunks."
    },
    {
      emoji: "🌟",
      text: "The nearest star system, Alpha Centauri, consists of three stars located 4.37 light-years from Earth."
    },
    {
      emoji: "🔴",
      text: "Mars experiences the largest dust storms in the solar system, some covering the entire planet for months."
    },
    {
      emoji: "🛰️",
      text: "The International Space Station orbits Earth at 17,500 mph, completing one orbit approximately every 90 minutes."
    },
    {
      emoji: "💫",
      text: "Pulsars are rotating neutron stars that emit beams of radiation, acting as cosmic lighthouses in space."
    },
    {
      emoji: "🌍",
      text: "Earth's magnetic field extends up to 65,000 kilometers into space, protecting us from harmful solar radiation."
    },
    {
      emoji: "🚀",
      text: "The Voyager 1 spacecraft, launched in 1977, is now over 14 billion miles from Earth in interstellar space."
    },
    {
      emoji: "🌙",
      text: "The Moon's gravitational influence causes Earth's tides and gradually slows our planet's rotation by 2.3 milliseconds per century."
    },
    {
      emoji: "☀️",
      text: "The Sun converts 600 million tons of hydrogen into helium every second through nuclear fusion in its core."
    }
  ];

  // Video loading and setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Intersection Observer for video and text control
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            video.currentTime = 0;
            video.play().then(() => {
              setIsPlaying(true);
            }).catch((error) => {
              console.log('Video play failed:', error);
              setIsPlaying(false);
            });
          } else {
            setIsInView(false);
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [videoLoaded]);

  // Fact rotation - only when in view
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isInView || !videoLoaded) {
      return;
    }

    // Reset to first fact when coming into view
    setCurrentFactIndex(0);

    // Start fact rotation
    intervalRef.current = setInterval(() => {
      setCurrentFactIndex((prevIndex) => 
        (prevIndex + 1) % astronomyFacts.length
      );
    }, 4000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isInView, videoLoaded, astronomyFacts.length]); // Remove factInterval from dependencies

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const currentFact = astronomyFacts[currentFactIndex];

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ 
        once: false,
        amount: 0.3
      }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          muted={true}
          loop
          playsInline
          preload="auto"
          onClick={handleVideoClick}
        >
          <source src="/assets/mars1.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* Professional Facts Section - Only show when in view */}
      <AnimatePresence>
        {isInView && videoLoaded && (
          <motion.div
            key={`facts-container-${isInView}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              staggerChildren: 0.2
            }}
            className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 max-w-4xl mx-auto px-6"
          >
            {/* Clean Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-400"></div>
                <h2 className="mx-6 text-slate-300 font-medium text-sm tracking-[0.2em] uppercase">
                  Astronomical Insights
                </h2>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-400"></div>
              </div>
            </motion.div>

            {/* Fully Transparent Content Card */}
            <div className="relative">
              <div className="relative px-8 py-10 md:px-12 md:py-14">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`fact-${currentFactIndex}-${isInView}`}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -30, rotateX: 15 }}
                    transition={{ 
                      duration: 0.7, 
                      ease: "easeOut",
                      opacity: { duration: 0.4 },
                      y: { duration: 0.6 },
                      rotateX: { duration: 0.6 }
                    }}
                    className="text-center space-y-6"
                  >
                    {/* Minimalist Icon */}
                    <motion.div
                      initial={{ scale: 0.5, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="flex justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/30 transition-all duration-300">
                        <span className="text-2xl">{currentFact.emoji}</span>
                      </div>
                    </motion.div>

                    {/* Professional Typography with enhanced animations */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.3,
                        ease: "easeOut"
                      }}
                      className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto"
                      style={{ 
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6)' 
                      }}
                    >
                      {currentFact.text}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>

                {/* Professional Progress Bar */}
                <motion.div 
                  className="mt-10 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex space-x-1 bg-black/20 rounded-full p-1 backdrop-blur-sm">
                    {astronomyFacts.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          index === currentFactIndex 
                            ? 'w-6 bg-white/80' 
                            : 'w-1.5 bg-white/30'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: 0.5 + index * 0.05 
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        viewport={{ once: false }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex flex-col items-center text-white/60"
        >
          <span className="text-xs mb-2 tracking-wider">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
        </motion.div>
      </motion.div>

      {/* Transparent bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-5" />
      
      {/* Minimal corner accents with animations */}
      <motion.div 
        className="absolute top-6 left-6 w-8 h-8 border-l border-t border-slate-400/20 z-10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        viewport={{ once: false }}
      />
      <motion.div 
        className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-slate-400/20 z-10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        viewport={{ once: false }}
      />
      <motion.div 
        className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-slate-400/20 z-10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        viewport={{ once: false }}
      />
    </motion.section>
  );
};

export default FactsSection;
