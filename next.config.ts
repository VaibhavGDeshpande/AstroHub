/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    // Stellarium is hidden for now (route moved to app/_stellarium); old links land on the live sky chart.
    return [{ source: '/stellarium', destination: '/sky-chart', permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'www.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'epic.gsfc.nasa.gov',
        port: '',
        pathname: '/archive/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'rtfchzqifruryceyklqe.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
