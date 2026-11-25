// The Explore menu. The header and the /search page both read it, so a new tool only needs adding here.
export type ExploreItem = { name: string; path: string };
export type ExploreCategory = { id: string; title: string; items: ExploreItem[] };

export const exploreCategories: ExploreCategory[] = [
  {
    id: 'nasa-data',
    title: 'NASA Data',
    items: [
      { name: 'Near Earth Objects', path: '/neo' },
      { name: 'EPIC Earth Images', path: '/epic' },
      { name: 'NASA Image Library', path: '/images' },
      { name: 'NASA Eyes', path: '/nasa-eyes' },
      { name: 'Astronomy Picture of the Day', path: '/apod' }
    ]
  },
  {
    id: '3d-models',
    title: '3D Models',
    items: [
      { name: '3D View of Earth', path: '/3d-earth' },
      { name: '3D View of Moon', path: '/3d-moon' },
      { name: '3D View of Mars', path: '/3d-mars' }
    ]
  },
  {
    id: 'sky-tools',
    title: 'Sky Tools',
    items: [
      // { name: 'Stellarium Sky Map', path: '/stellarium' }, // hidden for now
      { name: 'Live Sky Chart', path: '/sky-chart' },
      { name: 'Sky Charts', path: '/sky-charts' },
      { name: 'Satellite Tracker', path: '/satellite-tracker' },
      { name: 'Messier Catalog', path: '/messier' }
    ]
  },
  {
    id: 'advanced-tools',
    title: 'Advanced Tools',
    items: [
      { name: 'Telescope Calculator', path: '/telescope-calculator' },
      { name: 'Astrophotography Exposure Calculator', path: '/exposure-calculator' },
      { name: 'Cosmic Age Calculator', path: '/cosmic-age' }
    ]
  },
  {
    id: 'news',
    title: 'News & Media',
    items: [
      { name: 'Space News & Updates', path: '/space-news' },
      { name: 'AstroHub Transmission', path: '/blogs' },
      { name: 'Transmission Authors', path: '/authors' },
      { name: 'Astrophotography Gallery', path: '/gallery' },
      { name: 'Space Quiz', path: '/space-quiz' },
      { name: 'Space Wallpapers', path: '/wallpapers' }
    ]
  },
  {
    id: 'earth-tools',
    title: 'Earth Tools',
    items: [
      { name: 'Light Pollution Map', path: '/light-pollution' },
      { name: 'Weather Dashboard', path: '/weather' }
    ]
  }
];
