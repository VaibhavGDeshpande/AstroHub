/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
      },
      {
        protocol: 'https', 
        hostname: 'www.nasa.gov',
      }
    ],
  },
};

export default nextConfig;
