import LoaderWrapper from '@/components/Loader';
import SkyMapsDownloader from '@/components/SkyMaps/SkyMapsDownloader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sky Maps & Star Charts | Monthly Downloads',
  description: 'Download monthly sky maps and star charts for Northern, Equatorial, and Southern hemispheres. Updated monthly with the latest astronomical data.',
  keywords: ['sky maps', 'star charts', 'astronomy', 'constellation maps', 'sky charts'],
};

export default function SkyMapsPage() {
  return (
    <LoaderWrapper>
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Sky Maps & Star Charts
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the night sky with our monthly updated sky charts. 
            Download publication-quality maps for your hemisphere and discover 
            celestial wonders visible to the naked eye.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-blue-400 mb-2">2,844+</div>
            <div className="text-gray-300">Stars Visible</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-gray-300">Hemispheres Covered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-pink-400 mb-2">Monthly</div>
            <div className="text-gray-300">Updates</div>
          </div>
        </div>

        {/* Main Content - Sky Maps Component */}
        <SkyMapsDownloader />

        {/* Info Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6">About These Charts</h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-3">What&apos;s Included</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Over 2,844 stars visible to the unaided eye</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Nebulae and star clusters</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Constellation boundaries and names</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✦</span>
                  <span>Monthly planet positions</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">How to Use</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Select your hemisphere (Northern, Equatorial, or Southern)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Download the current month&apos;s PDF chart</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Print or view on your device while stargazing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Check back monthly for updated charts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
    </LoaderWrapper>
  );
}
