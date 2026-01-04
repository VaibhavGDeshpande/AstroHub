// // app/nasa-eyes/layout.tsx
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'NASA Eyes | Interactive Space Visualization',
//   description: 'Explore space with NASA Eyes - interactive visualizations of Earth, asteroids, exoplanets, and the solar system. Real-time data and stunning 3D models.',
//   keywords: ['NASA Eyes', 'space visualization', 'interactive space', 'Earth view', 'asteroids', 'exoplanets', 'solar system', '3D space'],
//   authors: [{ name: 'NASA Eyes Team' }],
//   openGraph: {
//     title: 'NASA Eyes | Interactive Space Visualization',
//     description: 'Explore space with NASA Eyes - interactive visualizations of Earth, asteroids, exoplanets, and the solar system.',
//     type: 'website',
//     images: [
//       {
//         url: '/assets/AstroHub.avif',
//         width: 1200,
//         height: 630,
//         alt: 'NASA Eyes Preview'
//       }
//     ]
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'NASA Eyes',
//     description: 'Explore space with NASA Eyes - interactive visualizations.',
//   },
//   robots: {
//     index: true,
//     follow: true,
//   }
// };

// export const viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
// };

// export default function NasaEyesLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="nasa-eyes-layout">
//       {children}
//     </div>
//   )
// }

