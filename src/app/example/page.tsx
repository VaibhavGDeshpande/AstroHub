// components/About.tsx
'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RocketLaunchIcon, 
  GlobeAltIcon, 
  StarIcon, 
  SparklesIcon,
  CameraIcon,
  MapIcon,
  EyeIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const tabs = [
    { id: 'mission', label: 'Our Mission', icon: RocketLaunchIcon },
    { id: 'features', label: 'Features', icon: StarIcon },
    { id: 'tools', label: 'Tools' },
    { id: 'technology', label: 'Technology', icon: SparklesIcon }
  ];

  const features = [
    {
      icon: CameraIcon,
      title: 'Daily APOD',
      description: 'Astronomy Picture of the Day with detailed explanations and high-resolution images from NASA\'s archives.',
      highlight: '30+ years of cosmic imagery'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Mars Exploration',
      description: 'Browse thousands of photos captured by NASA\'s Mars rovers including Curiosity, Perseverance, and more.',
      highlight: 'Real-time rover data'
    },
    {
      icon: GlobeAltIcon,
      title: 'Earth Monitoring',
      description: 'View our planet from space through NASA\'s Earth Polychromatic Imaging Camera (EPIC) satellite.',
      highlight: 'Live Earth imagery'
    },
    {
      title: 'Near Earth Objects',
      description: 'Track asteroids and comets approaching Earth with real-time data from NASA\'s NEO surveillance.',
      highlight: 'Updated daily'
    },
    {
      icon: MapIcon,
      title: '3D Visualizations',
      description: 'Explore interactive 3D models of celestial bodies including detailed Moon and Mars terrain.',
      highlight: 'WebGL powered'
    },
    {
      icon: BookOpenIcon,
      title: 'NASA Image Library',
      description: 'Access millions of space images, videos, and audio files from NASA\'s comprehensive media archive.',
      highlight: '1M+ resources'
    }
  ];

  const stats = [
    { number: '15+', label: 'Astronomy Tools'},
    { number: '5M+', label: 'Space Images', icon: CameraIcon },
    { number: '24/7', label: 'Live Data Feeds' },
    { number: '30+', label: 'Years of Archives', icon: BookOpenIcon }
  ];

  const technologies = [
    { name: 'React/Next.js', purpose: 'Modern web framework for fast, interactive experiences' },
    { name: 'NASA APIs', purpose: 'Direct integration with official NASA data sources' },
    { name: 'WebGL/Three.js', purpose: '3D visualizations and interactive cosmic models' },
    { name: 'Real-time Data', purpose: 'Live updates from space missions and observatories' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'mission':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Bringing the Universe to Your Screen
              </h2>
              <p className="text-lg text-cyan-200 max-w-3xl mx-auto leading-relaxed">
                AstroHub is your gateway to NASA&apos;s vast cosmos of data, images, and discoveries. 
                We make space exploration accessible to everyone through cutting-edge web technology 
                and real-time astronomical data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-xl p-6">
                <EyeIcon className="h-8 w-8 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Our Vision</h3>
                <p className="text-cyan-200">
                  To democratize space exploration by providing free, accessible tools that inspire 
                  curiosity and foster understanding of our universe through NASA&apos;s incredible data resources.
                </p>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-purple-400/30 rounded-xl p-6">
                <SparklesIcon className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Our Impact</h3>
                <p className="text-cyan-200">
                  Empowering educators, students, astronomers, and space enthusiasts worldwide 
                  with interactive tools that make complex astronomical data understandable and engaging.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'features':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Explore the Cosmos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group bg-black/40 backdrop-blur-md border border-slate-600/40 hover:border-cyan-400/60 rounded-xl p-6 cursor-pointer transition-all duration-300"
                >
                  {/* <feature.icon className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 mb-4 transition-colors duration-300" /> */}
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-xs text-cyan-400 font-medium">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {feature.highlight}
                  </div>
                  <AnimatePresence>
                    {hoveredFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center mt-3 text-cyan-300 text-sm"
                      >
                        <span>Explore now</span>
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'tools':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Powerful Astronomy Tools
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-black/40 backdrop-blur-md border border-slate-600/40 rounded-xl p-4"
                >
                  {/* <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-2" /> */}
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-cyan-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-slate-600/40 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">What Makes Us Special</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <span className="text-white font-medium">Real-time NASA Data</span>
                    <p className="text-sm text-slate-300">Direct API integration with official NASA sources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <span className="text-white font-medium">Interactive 3D Models</span>
                    <p className="text-sm text-slate-300">Explore celestial bodies in stunning detail</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <span className="text-white font-medium">Historical Archives</span>
                    <p className="text-sm text-slate-300">Access 30+ years of space imagery and data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <span className="text-white font-medium">Mobile Optimized</span>
                    <p className="text-sm text-slate-300">Seamless experience across all devices</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'technology':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Built with Modern Technology
            </h2>
            
            <div className="space-y-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-md border border-slate-600/40 rounded-xl p-4 hover:border-cyan-400/60 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300">{tech.name}</h3>
                      <p className="text-slate-300">{tech.purpose}</p>
                    </div>
                    <SparklesIcon className="h-6 w-6 text-cyan-400" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Performance & Reliability</h3>
              <p className="text-cyan-200 leading-relaxed">
                Our platform is built for speed and reliability, utilizing modern web technologies 
                to deliver real-time space data with minimal latency. We employ advanced caching strategies, 
                optimized image delivery, and progressive loading to ensure you have the best possible 
                experience exploring the universe.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            About AstroHub
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Your comprehensive platform for exploring NASA&apos;s universe of data, images, and cosmic discoveries.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-black/40 border border-slate-600/40 text-slate-300 hover:border-cyan-400/60 hover:text-cyan-300'
              }`}
            >
              {/* <tab.icon className="h-4 w-4" /> */}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          {/* <div className="bg-black/40 backdrop-blur-md border border-cyan-400/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Explore the Universe?</h3>
            <p className="text-cyan-200 mb-6">
              Start your cosmic journey with our comprehensive suite of astronomy tools and NASA data.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25"
            >
              <span className="flex items-center gap-2">
                <RocketLaunchIcon className="h-5 w-5" />
                Begin Exploration
              </span>
            </motion.button>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
