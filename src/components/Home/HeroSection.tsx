// components/HeroSection.tsx
'use client'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, GlobeAltIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearInterval(timer);
    };
  }, [mousePosition]);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const stats = [
    { label: 'APIs Available', value: '8+', icon: SparklesIcon },
    { label: 'Space Images', value: '1M+', icon: GlobeAltIcon },
    { label: 'Data Sources', value: '24/7', icon: RocketLaunchIcon },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1
            variants={textVariants}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            <span className="block">NASA</span>
            <motion.span
              className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              animate={floatingAnimation}
            >
              Explorer
            </motion.span>
          </motion.h1>

          {/* Subtitle with enhanced styling */}
          <motion.div
            variants={textVariants}
            className="space-y-4"
          >
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover the wonders of space through NASA&apos;s vast data universe.
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Access real-time astronomy data, Mars rover images, Earth imagery, and explore the cosmos like never before.
            </p>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <Link
              href="#explore"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <RocketLaunchIcon className="h-5 w-5 group-hover:animate-bounce" />
                <span>Start Exploring</span>
              </span>
            </Link>
            
            <Link
              href="/documentation"
              className="group px-8 py-4 border border-slate-600 rounded-full text-white hover:border-blue-400 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5" />
                <span>View Documentation</span>
              </span>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={textVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="group relative p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <stat.icon className="h-8 w-8 text-blue-400 group-hover:text-purple-400 transition-colors" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Live Time Display */}
          <motion.div
            variants={textVariants}
            className="mt-12 p-4 bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-lg max-w-md mx-auto"
          >
            <div className="text-sm text-slate-400 mb-1">Mission Time (UTC)</div>
            <div className="font-mono text-lg text-blue-400">
              {currentTime.toISOString().replace('T', ' ').slice(0, 19)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;