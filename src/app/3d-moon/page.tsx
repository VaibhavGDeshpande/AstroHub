"use client"

import { useState, useEffect, useCallback } from 'react';
import MoonViewer from '../../components/3D Maps/MoonViewer';

interface MoonData {
  phase: string;
  illumination: number;
  age: number;
  distance: number;
  nextFullMoon: string;
  nextNewMoon: string;
  moonrise: string;
  moonset: string;
  zodiacSign: string;
}

export default function MoonPage() {
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentMoonPhase = useCallback(() => {
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                   'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'];
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    return phases[Math.floor(dayOfYear / 3.69) % 8];
  }, []);

  const getNextFullMoon = useCallback(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  }, []);

  const getNextNewMoon = useCallback(() => {
    const date = new Date();
    date.setDate(date.getDate() + 28);
    return date.toISOString().split('T')[0];
  }, []);

  const fetchMoonData = useCallback(async () => {
    try {
      setLoading(true);
      
      const moonInfo: MoonData = {
        phase: getCurrentMoonPhase(),
        illumination: Math.floor(Math.random() * 100),
        age: Math.floor(Math.random() * 29.5),
        distance: 384400 + Math.floor(Math.random() * 20000),
        nextFullMoon: getNextFullMoon(),
        nextNewMoon: getNextNewMoon(),
        moonrise: '10:45 AM',
        moonset: '11:30 PM',
        zodiacSign: 'Libra'
      };

      setMoonData(moonInfo);
    } catch (err) {
      setError('Failed to fetch moon data');
      console.error('Moon data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getCurrentMoonPhase, getNextFullMoon, getNextNewMoon]);

  useEffect(() => {
    fetchMoonData();
    const interval = setInterval(fetchMoonData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchMoonData]);

  const getMoonPhaseIcon = (phase: string) => {
    const phaseIcons: { [key: string]: string } = {
      'New Moon': '🌑',
      'Waxing Crescent': '🌒',
      'First Quarter': '🌓',
      'Waxing Gibbous': '🌔',
      'Full Moon': '🌕',
      'Waning Gibbous': '🌖',
      'Third Quarter': '🌗',
      'Waning Crescent': '🌘'
    };
    return phaseIcons[phase] || '🌙';
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Fixed Header */}
      <header className="w-full h-16 px-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Lunar Observatory
          </h1>
          <p className="text-xs text-gray-300">Real-time Moon data and 3D visualization</p>
        </div>
        <button 
          onClick={fetchMoonData}
          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
          disabled={loading}
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className="main-container" style={{ height: 'calc(100vh - 4rem)' }}>
        
        {/* Desktop Layout: Side by Side */}
        <div className="desktop-layout">
          {/* Left Panel - Moon Data */}
          <div className="w-1/4 h-full overflow-y-auto bg-black/10 backdrop-blur-sm">
            <div className="p-4 space-y-4">
              
              {/* Current Status */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  Current Status
                  <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </h2>

                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {moonData && !loading && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-3xl mb-1">{getMoonPhaseIcon(moonData.phase)}</div>
                      <div className="font-medium text-sm">{moonData.phase}</div>
                      <div className="text-xs text-gray-300">{moonData.illumination.toFixed(1)}% lit</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">{moonData.age.toFixed(1)}</div>
                      <div className="text-xs">Days old</div>
                      <div className="text-xs text-gray-300">Lunar cycle</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Information */}
              {moonData && !loading && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <h3 className="font-semibold mb-3">Details</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-gray-300">Distance</span>
                      <span className="font-medium">{moonData.distance.toLocaleString()} km</span>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-gray-300">Zodiac</span>
                      <span className="font-medium">{moonData.zodiacSign}</span>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-gray-300">Moonrise</span>
                      <span className="font-medium">{moonData.moonrise}</span>
                    </div>
                    
                    <div className="flex justify-between py-1">
                      <span className="text-gray-300">Moonset</span>
                      <span className="font-medium">{moonData.moonset}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {moonData && !loading && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <h3 className="font-semibold mb-3">Upcoming Events</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <div className="text-xl">🌕</div>
                      <div className="text-sm">
                        <div className="font-medium">Next Full Moon</div>
                        <div className="text-gray-300 text-xs">{new Date(moonData.nextFullMoon).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <div className="text-xl">🌑</div>
                      <div className="text-sm">
                        <div className="font-medium">Next New Moon</div>
                        <div className="text-gray-300 text-xs">{new Date(moonData.nextNewMoon).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Panel - 3D Moon Viewer */}
          <div className="w-3/4 h-full bg-black/20 backdrop-blur-sm border-l border-white/10">
            <div className="w-full h-full p-4">
              <div className="moon-viewer-container">
                <div className="moon-viewer-wrapper">
                  <MoonViewer />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Moon Viewer Top, Info Bottom */}
        <div className="mobile-layout">
          {/* Moon Viewer - Top Section */}
          <div className="mobile-viewer-section">
            <div className="w-full h-full bg-black/20 backdrop-blur-sm">
              <div className="w-full h-full p-3">
                <div className="mobile-moon-viewer-container">
                  <div className="mobile-moon-viewer-wrapper">
                    <MoonViewer />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section - Bottom */}
          <div className="mobile-info-section">
            <div className="w-full h-full overflow-y-auto bg-black/10 backdrop-blur-sm">
              <div className="p-3 space-y-3">
                
                {/* Current Status - Mobile */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                  <h2 className="text-base font-semibold mb-2 flex items-center justify-center">
                    Current Status
                    <div className="ml-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </h2>

                  {loading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  {moonData && !loading && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-white/5 rounded-lg">
                        <div className="text-2xl mb-1">{getMoonPhaseIcon(moonData.phase)}</div>
                        <div className="font-medium text-xs">{moonData.phase}</div>
                        <div className="text-xs text-gray-300">{moonData.illumination.toFixed(1)}% lit</div>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{moonData.age.toFixed(1)}</div>
                        <div className="text-xs">Days old</div>
                        <div className="text-xs text-gray-300">Lunar cycle</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Info Cards */}
                {moonData && !loading && (
                  <>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                      <h3 className="font-semibold mb-2 text-sm">Quick Info</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="text-gray-300">Distance</div>
                          <div className="font-medium">{moonData.distance.toLocaleString()} km</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="text-gray-300">Zodiac</div>
                          <div className="font-medium">{moonData.zodiacSign}</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="text-gray-300">Rise</div>
                          <div className="font-medium">{moonData.moonrise}</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="text-gray-300">Set</div>
                          <div className="font-medium">{moonData.moonset}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                      <h3 className="font-semibold mb-2 text-sm">Upcoming Events</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                          <div className="text-lg">🌕</div>
                          <div className="text-xs">
                            <div className="font-medium">Next Full Moon</div>
                            <div className="text-gray-300">{new Date(moonData.nextFullMoon).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                          <div className="text-lg">🌑</div>
                          <div className="text-xs">
                            <div className="font-medium">Next New Moon</div>
                            <div className="text-gray-300">{new Date(moonData.nextNewMoon).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>

      </main>

      <style jsx>{`
        .main-container {
          width: 100%;
          position: relative;
        }

        /* Desktop Layout - Side by Side */
        .desktop-layout {
          display: flex;
          width: 100%;
          height: 100%;
        }

        /* Mobile Layout - Stacked Vertically */
        .mobile-layout {
          display: none;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }

        .mobile-viewer-section {
          flex: 0 0 60%;
          min-height: 0;
        }

        .mobile-info-section {
          flex: 1;
          min-height: 0;
        }

        /* Desktop Moon Viewer Container */
        .moon-viewer-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .moon-viewer-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .moon-viewer-wrapper > div {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain;
        }

        /* Mobile Moon Viewer Container */
        .mobile-moon-viewer-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .mobile-moon-viewer-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-moon-viewer-wrapper > div {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain;
        }

        /* Prevent content overflow and cutting */
        .moon-viewer-wrapper > :global(*),
        .mobile-moon-viewer-wrapper > :global(*) {
          box-sizing: border-box;
          overflow: visible !important;
        }

        /* Ensure Cesium container fits properly */
        .moon-viewer-wrapper :global(#cesiumContainer),
        .mobile-moon-viewer-wrapper :global(#cesiumContainer) {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain !important;
          object-position: center !important;
        }

        /* Mobile Media Query */
        @media (max-width: 767px) {
          .desktop-layout {
            display: none;
          }

          .mobile-layout {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
