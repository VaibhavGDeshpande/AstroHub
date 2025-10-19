'use client'
import { useState } from 'react';
import { motion, AnimatePresence} from 'framer-motion';
import { 
  RocketLaunchIcon, 
  GlobeAltIcon, 
  StarIcon, 
  SparklesIcon,
  CameraIcon,
  MapIcon,
  EyeIcon,
  BookOpenIcon,
  CheckCircleIcon,
  NewspaperIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  console.log(hoveredFeature);
  

  const tabs = [
    { id: 'mission', label: 'Our Mission', icon: RocketLaunchIcon },
    { id: 'features', label: 'Features', icon: StarIcon },
    { id: 'tools', label: 'Tools' },
    { id: 'technology', label: 'Technology', icon: SparklesIcon }
  ];

  // ✅ Full “Explore Now” dataset
  const features = [
    {
      icon: CameraIcon,
      title: 'Astronomy Picture of the Day (APOD)',
      description: 'Get a new breathtaking image of the cosmos every day, complete with NASA-provided explanations.',
      highlight: '30+ years of archived photos'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Mars Rover Imagery',
      description: 'Browse thousands of raw and processed images from Mars rovers including Perseverance, Curiosity, and Opportunity.',
      highlight: 'Real-time rover data'
    },
    {
      icon: GlobeAltIcon,
      title: 'Earth Observation',
      description: 'View our planet in near-real time with NASA’s EPIC Earth imagery and satellite visualizations.',
      highlight: 'Live Earth data'
    },
    {
      icon: ChartBarIcon,
      title: 'Near Earth Objects (NEO)',
      description: 'Track asteroids and comets approaching Earth using NASA’s open NEO data with orbit paths and close-approach info.',
      highlight: 'Updated daily'
    },
    {
      icon: MapIcon,
      title: '3D Models & Visualizations',
      description: 'Interact with realistic 3D representations of celestial bodies, spacecraft, and mission data using WebGL.',
      highlight: 'Immersive web experience'
    },
    {
      icon: StarIcon,
      title: 'Sky Observation Tools',
      description: 'Find out what’s visible in the night sky and identify stars, constellations, and planets in real-time.',
      highlight: 'Dynamic stargazing'
    },
    {
      icon: NewspaperIcon,
      title: 'Space News & Updates',
      description: 'Stay up to date with breaking news, discoveries, and mission updates directly sourced from NASA feeds.',
      highlight: 'Real-time headlines'
    },
    {
      icon: BookOpenIcon,
      title: 'NASA Media Library',
      description: 'Access millions of NASA’s official photos, videos, and audio archives for research, education, and exploration.',
      highlight: '1M+ assets'
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
                  className="group bg-black/40 backdrop-blur-md border border-slate-600/40 hover:border-cyan-400/60 rounded-xl p-6 transition-all duration-300"
                >
                  <feature.icon className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 mb-4 transition-colors duration-300" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-xs text-cyan-400 font-medium">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {feature.highlight}
                  </div>
                  {/* <AnimatePresence>
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
                  </AnimatePresence> */}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'tools':
      case 'technology':
        // keep your existing code for both as-is
        return renderOriginalContent(activeTab);

      default:
        return null;
    }
  };

  const renderOriginalContent = (tab: string) => {
    if (tab === 'tools') {
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
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-cyan-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }
    if (tab === 'technology') {
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
        </motion.div>
      );
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

        {/* Tabs */}
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
      </div>
    </section>
  );
};

export default About;
