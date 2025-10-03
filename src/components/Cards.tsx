// EnhancedCards.tsx (or .jsx/.tsx depending on your setup)
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // or 'next/router' depending on your Next.js version
import { 
  Camera, 
  Star, 
  Rocket, 
  Image, 
  Cloud, 
  Globe, 
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const EnhancedCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nasaApis = [
    {
      title: 'Astronomy Picture of the Day',
      description: 'Discover a new astronomy picture each day with detailed explanations from professional astronomers.',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      path: '/apod',
      features: ['Daily updates', 'HD images', 'Expert explanations'],
      glow: 'purple',
      ctaText: 'Explore Data'
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore Mars through the eyes of NASA rovers including Curiosity, Opportunity, and Spirit.',
      icon: Camera,
      color: 'from-red-500 to-orange-500',
      path: '/mars-rover',
      features: ['Multiple rovers', 'Camera filters', 'Sol dates'],
      glow: 'red',
      ctaText: 'Explore Data'
    },
    {
      title: 'Near Earth Objects',
      description: 'Track asteroids and comets that approach Earth with detailed orbital information.',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      path: '/neo',
      features: ['Orbital data', 'Size estimates', 'Approach dates'],
      glow: 'blue',
      ctaText: 'Explore Data'
    },
    {
      title: 'EPIC Earth Images',
      description: 'See Earth from DSCOVR satellite with full disk images showing weather patterns.',
      icon: Cloud,
      color: 'from-cyan-500 to-blue-500',
      path: '/epic',
      features: ['Full disk images', 'Weather patterns', 'Daily updates'],
      glow: 'cyan',
      ctaText: 'Explore Data'
    },
    {
      title: 'NASA Image Library',
      description: 'Search through NASA\'s vast collection of images, videos, and audio files.',
      icon: Image,
      color: 'from-pink-500 to-purple-500',
      path: '/images',
      features: ['Media search', 'High resolution', 'Metadata'],
      glow: 'pink',
      ctaText: 'Explore Data'
    }
  ];

  const interactiveViews = [
    {
      title: '3D View of Earth',
      description: 'Experience our planet in stunning 3D with interactive controls, atmospheric effects, and real-time lighting.',
      icon: Globe,
      color: 'from-blue-600 to-green-500',
      path: '/3d-earth',
      features: ['Interactive 3D', 'Real-time rotation', 'Atmospheric effects', 'Day/Night cycle'],
      glow: 'blue',
      ctaText: 'Explore 3D'
    },
    {
      title: '3D View of Moon',
      description: 'See and observe the detailed surface of the Moon and its landmarks in immersive 3D.',
      icon: Star,
      color: 'from-gray-400 to-blue-500',
      path: '/3d-moon',
      features: ['Moon surface', 'Important landmarks', 'Crater details', '3D exploration'],
      glow: 'gray',
      ctaText: 'Explore 3D'
    },
    {
      title: '3D View of Mars',
      description: 'See and observe the detailed surface of Mars and its landmarks with rover locations.',
      icon: Star,
      color: 'from-red-500 to-orange-500',
      path: '/3d-mars',
      features: ['Mars surface', 'Important landmarks', 'Rover locations', 'Geological features'],
      glow: 'red',
      ctaText: 'Explore 3D'
    }
  ];

  const stellariumSection = [
    {
      title: 'Stellarium Sky Map',
      description: 'Interactive planetarium software showing realistic star maps, constellations, and celestial objects in real-time.',
      icon: Eye,
      color: 'from-indigo-500 to-purple-600',
      path: '/stellarium',
      features: ['Real-time sky', 'Constellation maps', 'Planet positions', 'Time control'],
      glow: 'indigo',
      ctaText: 'View Sky'
    }
  ];

  const skyChartsSection = [
    {
      title: 'Sky Charts',
      description: 'Printable and interactive monthly updated sky charts to help plan your nights of stargazing.',
      icon: Eye,
      color: 'from-yellow-500 to-orange-500',
      path: '/sky-charts',
      features: ['Monthly updates', 'Printable charts', 'Constellation guides'],
      glow: 'yellow',
      ctaText: 'View Charts'
    }
  ];

  const nasaEyesSection = [
    {
      title: 'NASA Eyes',
      description: 'Explore Earth, planets, and the universe interactively through NASA Eyes web application.',
      icon: Eye,
      color: 'from-blue-700 to-cyan-500',
      path: 'https://eyes.nasa.gov',
      features: ['3D interactive models', 'Planetary exploration', 'Real-time data'],
      glow: 'blue',
      ctaText: 'Visit NASA Eyes',
      external: true
    }
  ];

  const renderCard = (api: any, index: number, delayOffset: number = 0) => {
    const Icon = api.icon;
    const cardIndex = index + delayOffset;

    const cardContent = (
      <div
        onMouseEnter={() => setHoveredCard(cardIndex)}
        onMouseLeave={() => setHoveredCard(null)}
        className={`group relative transition-all duration-700 ease-out cursor-pointer ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ transitionDelay: `${cardIndex * 80}ms` }}
      >
        <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 overflow-hidden transition-all duration-500 hover:border-slate-500/70 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 flex flex-col min-h-[400px]">
          
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${api.color} opacity-0 group-hover:opacity-[0.15] transition-all duration-700 blur-2xl`} />
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon container with enhanced glow */}
          <div className="relative mb-6 flex-shrink-0">
            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${api.color} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <Icon className="w-8 h-8 text-white" />
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${api.color} blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-500`} />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="relative flex-grow flex flex-col z-10">
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
              {api.title}
            </h3>

            <p className="text-slate-400 mb-6 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300 flex-grow">
              {api.description}
            </p>

            {/* Features with staggered animation */}
            <div className="space-y-3 mb-6">
              {api.features.map((feature: string, idx: number) => (
                <div 
                  key={idx}
                  className="flex items-center group/feature"
                  style={{
                    animation: hoveredCard === cardIndex ? `slideIn 0.3s ease-out ${idx * 0.1}s forwards` : 'none',
                    opacity: hoveredCard === cardIndex ? 1 : 0.7
                  }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${api.color} mr-3 group-hover:scale-150 group-hover:shadow-lg transition-all duration-300`} />
                  <span className="text-xs text-slate-500 group-hover/feature:text-white transition-colors duration-300 font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA */}
          <div className="relative flex items-center justify-between pt-5 border-t border-slate-700/30 group-hover:border-slate-600/50 transition-all duration-300 mt-auto z-10">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold bg-gradient-to-r ${api.color} bg-clip-text text-transparent group-hover:text-white transition-all duration-300`}>
                {api.ctaText}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Live</span>
            </div>
          </div>

          {/* Hover overlay effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </div>
    );

    // Decide whether to use Link (internal) or <a> (external)
    if (!api.external) {
      return (
        <Link key={index} href={api.path}>
          {cardContent}
        </Link>
      );
    } else {
      return (
        <a
          key={index}
          href={api.path}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardContent}
        </a>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black py-20 px-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold text-blue-400">Powered by NASA APIs</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-6 leading-tight">
            Explore the Universe
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Access real-time space data, immersive 3D models, and professional sky observation tools
          </p>
        </div>

        {/* NASA Data Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-4">
              NASA Data Explorer
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Real-time access to NASA's comprehensive space data APIs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {nasaApis.map((api, index) => renderCard(api, index, 0))}
          </div>
        </section>

        {/* 3D Interactive Views */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text mb-4">
              3D Interactive Models
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Immersive 3D experiences of celestial bodies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interactiveViews.map((api, index) => renderCard(api, index, 10))}
          </div>
        </section>

        {/* Sky Observation */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text mb-4">
              Sky Observation
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Professional tools for mapping and observing the night sky
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[...stellariumSection, ...skyChartsSection].map((api, index) => renderCard(api, index, 20))}
          </div>
        </section>

        {/* NASA Eyes Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text mb-4">
              NASA Eyes
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Explore the universe through NASA's official interactive platform
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {nasaEyesSection.map((api, index) => renderCard(api, index, 25))}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedCards;
