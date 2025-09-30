// components/APICards.tsx
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CameraIcon, 
  StarIcon, 
  RocketLaunchIcon,
  PhotoIcon,
  CloudIcon,
  GlobeAltIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const Cards = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // NASA Data APIs
  const nasaApis = [
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
    }
  ];

  // 3D Models and Interactive Views
  const interactiveViews = [
    {
      title: '3D View of Earth',
      description: 'Experience our planet in stunning 3D with interactive controls, atmospheric effects, and real-time lighting.',
      icon: GlobeAltIcon,
      color: 'from-blue-600 to-green-500',
      path: '/3d-earth',
      features: ['Interactive 3D', 'Real-time rotation', 'Atmospheric effects', 'Day/Night cycle'],
      glow: 'blue',
      ctaText: 'Explore 3D'
    },
    {
      title: '3D View of Moon',
      description: 'See and observe the detailed surface of the Moon and its landmarks in immersive 3D.',
      icon: StarIcon,
      color: 'from-gray-400 to-blue-500',
      path: '/3d-moon',
      features: ['Moon surface', 'Important landmarks', 'Crater details', '3D exploration'],
      glow: 'gray',
      ctaText: 'Explore 3D'
    },
    {
      title: '3D View of Mars',
      description: 'See and observe the detailed surface of Mars and its landmarks with rover locations.',
      icon: StarIcon,
      color: 'from-red-500 to-orange-500',
      path: '/3d-mars',
      features: ['Mars surface', 'Important landmarks', 'Rover locations', 'Geological features'],
      glow: 'red',
      ctaText: 'Explore 3D'
    }
  ];

  // Stellarium and Sky Observation
  const stellariumSection = [
    {
      title: 'Stellarium Sky Map',
      description: 'Interactive planetarium software showing realistic star maps, constellations, and celestial objects in real-time.',
      icon: EyeIcon,
      color: 'from-indigo-500 to-purple-600',
      path: '/stellarium',
      features: ['Real-time sky', 'Constellation maps', 'Planet positions', 'Time control'],
      glow: 'indigo',
      ctaText: 'View Sky'
    }
  ];

  const getGlowClass = (glow: string) => {
    const glowClasses = {
      purple: 'hover:shadow-purple-500/25',
      red: 'hover:shadow-red-500/25',
      blue: 'hover:shadow-blue-500/25',
      green: 'hover:shadow-green-500/25',
      cyan: 'hover:shadow-cyan-500/25',
      indigo: 'hover:shadow-indigo-500/25',
      pink: 'hover:shadow-pink-500/25',
      yellow: 'hover:shadow-yellow-500/25',
      gray: 'hover:shadow-gray-500/25'
    };
    return glowClasses[glow as keyof typeof glowClasses] || 'hover:shadow-blue-500/25';
  };

  const renderCard = (api: {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  path: string;
  features: string[];
  glow: string;
  ctaText: string;
}, index: number, delayOffset: number = 0) => (

    <div
      key={index}
      className={`group relative transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${600 + delayOffset + (index * 100)}ms` }}
    >
      <Link href={api.path}>
        <div className={`relative h-full bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 overflow-hidden transition-all duration-500 cursor-pointer hover:bg-slate-800/50 hover:border-slate-600/50 hover:shadow-2xl hover:scale-105 ${getGlowClass(api.glow)} flex flex-col min-h-[380px]`}>
          {/* Enhanced Background Effects */}
          <div className={`absolute inset-0 bg-gradient-to-br ${api.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl border border-slate-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Cosmic particle effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Corner decoration with animation */}
          <div className="absolute top-4 right-4 w-8 h-8 border border-slate-600/50 rounded-full flex items-center justify-center group-hover:border-slate-400/70 group-hover:scale-110 transition-all duration-300">
            <div className="w-2 h-2 bg-slate-500/50 rounded-full group-hover:bg-slate-300 group-hover:animate-pulse transition-all duration-300" />
          </div>
          
          {/* Enhanced Icon with Glow */}
          <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg flex-shrink-0`}>
            <api.icon className="h-7 w-7 text-white drop-shadow-sm group-hover:animate-pulse" />
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${api.color} blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500`} />
          </div>

          {/* Content - Enhanced Animations */}
          <div className="flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-blue-200 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-500 flex-shrink-0">
              {api.title}
            </h3>
            
            <p className="text-slate-400 mb-4 text-sm leading-relaxed group-hover:text-slate-200 transition-all duration-500 flex-grow">
              {api.description}
            </p>

            {/* Enhanced Features with Animation */}
            <ul className="space-y-2 mb-6 flex-shrink-0">
              {api.features.map((feature: string, featureIndex: number) => (
                <li key={featureIndex} className="flex items-center text-xs text-slate-500 group-hover:text-slate-300 transition-all duration-500">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${api.color} mr-3 shadow-sm flex-shrink-0 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300`} 
                       style={{ transitionDelay: `${featureIndex * 100}ms` }} />
                  <span className="font-medium group-hover:text-white transition-colors duration-500">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced CTA with Ripple Effect */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/30 group-hover:border-slate-600/50 transition-all duration-500 flex-shrink-0">
            <div className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${api.color} bg-clip-text text-transparent group-hover:text-white transition-all duration-500`}>
              <span className="group-hover:animate-pulse">{api.ctaText}</span>
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:bg-green-300 group-hover:scale-125 transition-all duration-300" />
              <span className="text-xs text-green-400 font-medium group-hover:text-green-300 transition-colors duration-300">Live</span>
            </div>
          </div>

          <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-700 pointer-events-none" />
        </div>
      </Link>
    </div>
  );

  return (
    <section className="py-20 px-4 relative bg-black/95 backdrop-blur-lg" id="explore">
      {/* Enhanced Space Effects Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s' }} />
        <div className="absolute top-32 right-32 w-80 h-80 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent rounded-full blur-xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '4s' }} />
        
        <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/8 to-transparent animate-wave-move" />
        <div className="cosmic-wave-2 absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-400/6 to-transparent animate-wave-move-reverse" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text animate-float transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '200ms' }}>
            Explore the Universe
          </h2>
          <p className={`text-xl text-slate-300 max-w-2xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '400ms' }}>
            Access real-time space data, 3D models, and interactive sky maps
          </p>
        </div>

        {/* NASA Data Section */}
        <div className="mb-20">
          <div className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '600ms' }}>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
              NASA Data Explorer
            </h3>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Real-time access to NASA&apos;s comprehensive space data APIs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {nasaApis.map((api, index) => renderCard(api, index, 0))}
          </div>
        </div>

        {/* 3D Interactive Views Section */}
        <div className="mb-20">
          <div className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '800ms' }}>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
              3D Interactive Models
            </h3>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Immersive 3D experiences of celestial bodies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {interactiveViews.map((api, index) => renderCard(api, index, 500))}
          </div>
        </div>

        {/* Stellarium Section */}
        <div>
          <div className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1000ms' }}>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text">
              Sky Observation
            </h3>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Professional planetarium software for sky mapping and observation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-md mx-auto">
            {stellariumSection.map((api, index) => renderCard(api, index, 800))}
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS Animations */}
      <style jsx>{`
        @keyframes wave-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes wave-move-reverse {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-wave-move {
          animation: wave-move 20s linear infinite;
        }

        .animate-wave-move-reverse {
          animation: wave-move-reverse 25s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Cards;
