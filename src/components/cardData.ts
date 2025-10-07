// data/cardData.ts
import { LucideIcon } from 'lucide-react';

export interface CardAPI {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  path: string;
  features: string[];
  glow: string;
  ctaText: string;
  external?: boolean;
}

export interface CardSection {
  id: string;
  badgeColor: string;
  badgeText: string;
  titleGradient: string;
  subtitle: string;
  cards: CardAPI[];
}

// Import icons (you'll use these in your component)
import { 
  Camera, 
  Star, 
  Rocket, 
  Image, 
  Cloud, 
  Globe, 
  Eye,
  Sparkles,
  Newspaper,
  Book
} from 'lucide-react';

export const cardSections: CardSection[] = [
  {
    id: 'nasa-data',
    badgeColor: 'blue',
    badgeText: 'NASA Data',
    titleGradient: 'from-blue-400 to-purple-500',
    subtitle: 'Real-time access to NASA\'s comprehensive space data APIs',
    cards: [
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
      },
      {
        title: 'NASA Eyes',
        description: 'Explore Earth, planets, and the universe interactively through NASA Eyes web application.',
        icon: Eye,
        color: 'from-blue-700 to-cyan-500',
        path: '/nasa-eyes',
        features: ['3D interactive models', 'Planetary exploration', 'Real-time data'],
        glow: 'blue',
        ctaText: 'Visit NASA Eyes',
      }
    ]
  },
//   {
//     id: 'nasa-eyes',
//     badgeColor: 'cyan',
//     badgeText: 'Official Platform',
//     titleGradient: 'from-blue-600 to-cyan-500',
//     subtitle: 'Explore the universe through NASA\'s official interactive platform',
//     cards: [
//       {
//         title: 'NASA Eyes',
//         description: 'Explore Earth, planets, and the universe interactively through NASA Eyes web application.',
//         icon: Eye,
//         color: 'from-blue-700 to-cyan-500',
//         path: '/nasa-eyes',
//         features: ['3D interactive models', 'Planetary exploration', 'Real-time data'],
//         glow: 'blue',
//         ctaText: 'Visit NASA Eyes',
//       }
//     ]
//   },
  {
    id: '3d-models',
    badgeColor: 'green',
    badgeText: 'Interactive',
    titleGradient: 'from-green-400 to-blue-500',
    subtitle: 'Immersive 3D experiences of celestial bodies',
    cards: [
      {
        title: 'Solar System Explorer',
        description: 'Navigate through our solar system with all planets, moons, and celestial bodies in real-time 3D visualization.',
        icon: Sparkles,
        color: 'from-orange-500 via-yellow-500 to-purple-500',
        path: '/solar-system',
        features: ['All 8 planets', 'Orbital mechanics', 'Interactive navigation', 'Scale accuracy'],
        glow: 'orange',
        ctaText: 'Explore System'
      },
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
    ]
  },
  {
    id: 'sky-tools',
    badgeColor: 'indigo',
    badgeText: 'Observation',
    titleGradient: 'from-indigo-400 to-purple-500',
    subtitle: 'Professional tools for mapping and observing the night sky',
    cards: [
      {
        title: 'Stellarium Sky Map',
        description: 'Interactive planetarium software showing realistic star maps, constellations, and celestial objects in real-time.',
        icon: Eye,
        color: 'from-indigo-500 to-purple-600',
        path: '/stellarium',
        features: ['Real-time sky', 'Constellation maps', 'Planet positions', 'Time control'],
        glow: 'indigo',
        ctaText: 'View Sky'
      },
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
    ]
  },
  {
    id: 'news',
    badgeColor: 'emerald',
    badgeText: 'Live Updates',
    titleGradient: 'from-emerald-400 to-teal-500',
    subtitle: 'Latest updates from space exploration and test your knowledge of Universe',
    cards: [
      {
        title: 'Space News & Updates',
        description: 'Stay informed with the latest space exploration news, mission updates, and scientific discoveries from around the world.',
        icon: Newspaper,
        color: 'from-emerald-500 to-teal-500',
        path: '/space-news',
        features: ['Latest articles', 'Mission updates', 'Scientific discoveries', 'Breaking news'],
        glow: 'emerald',
        ctaText: 'Read News'
      },
      {
        title: 'Space Quiz',
        description: 'Test your brain in the field of space, space-exploration, astronomy and astrophysics.',
        icon: Book,
        color: 'from-emerald-500 to-teal-500',
        path: '/space-quiz',
        features: ['Quiz', 'MCQ\'s', 'Test knowledge', '100+ questions'],
        glow: 'emerald',
        ctaText: 'Start Quiz'
      }
    ]
  }
];