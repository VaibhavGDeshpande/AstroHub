import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AstroHub',
    short_name: 'AstroHub',
    description: 'Sky charts, astronomy weather, NASA data and observing tools for amateur astronomers.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    categories: ['education', 'science', 'weather'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Live Sky Chart', url: '/sky-chart', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Astronomy Weather', url: '/weather', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Daily Space Quiz', url: '/space-quiz', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
