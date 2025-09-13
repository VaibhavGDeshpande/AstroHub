// components/APICards.tsx
'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CameraIcon, 
  StarIcon, 
  RocketLaunchIcon,
  PhotoIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

const Cards = () => {
  const apis = [
    {
      title: 'Astronomy Picture of the Day',
      description: 'Discover a new astronomy picture each day with detailed explanations from professional astronomers.',
      icon: StarIcon,
      color: 'from-purple-500 to-pink-500',
      path: '/apod',
      features: ['Daily updates', 'HD images', 'Expert explanations'],
      glow: 'purple',
      ctaText: 'Explore Data'
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore Mars through the eyes of NASA rovers including Curiosity, Opportunity, and Spirit.',
      icon: CameraIcon,
      color: 'from-red-500 to-orange-500',
      path: '/mars-rover',
      features: ['Multiple rovers', 'Camera filters', 'Sol dates'],
      glow: 'red',
      ctaText: 'Explore Data'
    },
    {
      title: 'Near Earth Objects',
      description: 'Track asteroids and comets that approach Earth with detailed orbital information.',
      icon: RocketLaunchIcon,
      color: 'from-blue-500 to-cyan-500',
      path: '/neo',
      features: ['Orbital data', 'Size estimates', 'Approach dates'],
      glow: 'blue',
      ctaText: 'Explore Data'
    },
    {
      title: 'EPIC Earth Images',
      description: 'See Earth from DSCOVR satellite with full disk images showing weather patterns.',
      icon: CloudIcon,
      color: 'from-cyan-500 to-blue-500',
      path: '/epic',
      features: ['Full disk images', 'Weather patterns', 'Daily updates'],
      glow: 'cyan',
      ctaText: 'Explore Data'
    },
    {
      title: 'NASA Image Library',
      description: 'Search through NASA\'s vast collection of images, videos, and audio files.',
      icon: PhotoIcon,
      color: 'from-pink-500 to-purple-500',
      path: '/images',
      features: ['Media search', 'High resolution', 'Metadata'],
      glow: 'pink',
      ctaText: 'Explore Data'
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getGlowClass = (glow: string) => {
    const glowClasses = {
      purple: 'hover:shadow-purple-500/25',
      red: 'hover:shadow-red-500/25',
      blue: 'hover:shadow-blue-500/25',
      green: 'hover:shadow-green-500/25',
      cyan: 'hover:shadow-cyan-500/25',
      indigo: 'hover:shadow-indigo-500/25',
      pink: 'hover:shadow-pink-500/25',
      yellow: 'hover:shadow-yellow-500/25'
    };
    return glowClasses[glow as keyof typeof glowClasses] || 'hover:shadow-blue-500/25';
  };

  return (
    <section className="py-20 px-4 relative" id="explore">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            animate={{
              backgroundImage: [
                'linear-gradient(45deg, #ffffff, #60a5fa)',
                'linear-gradient(45deg, #60a5fa, #a855f7)',
                'linear-gradient(45deg, #a855f7, #ffffff)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}
          >
            Explore NASA&apos;s Universe
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Access real-time space data through our comprehensive collection of NASA APIs
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
        >
          {apis.map((api, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <Link href={api.path}>
                <div className={`relative h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer overflow-hidden hover:border-slate-600/50 hover:shadow-2xl ${getGlowClass(api.glow)} flex flex-col min-h-[380px]`}>
                  {/* Enhanced Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${api.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Cosmic dust effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Corner decoration circle */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-slate-600/50 rounded-full flex items-center justify-center group-hover:border-slate-500 transition-colors duration-300">
                    <div className="w-2 h-2 bg-slate-500/50 rounded-full group-hover:bg-slate-400 transition-colors duration-300" />
                  </div>
                  
                  {/* Enhanced Icon */}
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                    <api.icon className="h-7 w-7 text-white drop-shadow-sm" />
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${api.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  </div>

                  {/* Content - Flexible grow */}
                  <div className="flex-grow flex flex-col">
                    {/* Enhanced Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300 flex-shrink-0">
                      {api.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-slate-400 mb-4 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300 flex-grow">
                      {api.description}
                    </p>

                    {/* Enhanced Features */}
                    <ul className="space-y-2 mb-6 flex-shrink-0">
                      {api.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${api.color} mr-3 shadow-sm flex-shrink-0`} />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enhanced CTA - Fixed at bottom */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/30 flex-shrink-0">
                    <div className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${api.color} bg-clip-text text-transparent group-hover:text-white transition-colors duration-300`}>
                      <span>{api.ctaText}</span>
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default Cards;
