/** @type {import('next').NextConfig} */
import CopyWebpackPlugin from 'copy-webpack-plugin';

const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      cesium: 'cesium/Build/Cesium',
    };
    
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/cesium/Build/Cesium/Workers',
            to: '../public/cesium/Workers',
          },
          {
            from: 'node_modules/cesium/Build/Cesium/ThirdParty',
            to: '../public/cesium/ThirdParty',
          },
          {
            from: 'node_modules/cesium/Build/Cesium/Assets',
            to: '../public/cesium/Assets',
          },
          {
            from: 'node_modules/cesium/Build/Cesium/Widgets',
            to: '../public/cesium/Widgets',
          },
        ],
      })
    );
    
    return config;
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
    ],
  },
};

export default nextConfig;
