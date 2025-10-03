'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import LoaderWrapper from '../Loader';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SkyMapPDF {
  title: string;
  url: string;
  filename: string;
  hemisphere: string;
  date: string;
  monthYear: string;
}

export default function SkyMapsDownloader() {
  const [skyMaps, setSkyMaps] = useState<SkyMapPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHemisphere, setSelectedHemisphere] = useState<string>('all');

  useEffect(() => {
    fetchSkyMaps();
  }, []);

  const fetchSkyMaps = async () => {
    try {
      const response = await fetch('/api/scrape-skymaps');
      const result = await response.json();
      
      if (result.success) {
        setSkyMaps(result.data);
      } else {
        setError(result.error || 'Failed to load sky maps');
      }
    } catch (err) {
      setError('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  const getHemisphereIcon = (hemisphere: string) => {
    switch (hemisphere) {
      case 'Northern': return '🌠';
      case 'Equatorial': return '🌍';
      case 'Southern': return '🌌';
      default: return '⭐';
    }
  };

  const getHemisphereDescription = (hemisphere: string) => {
    switch (hemisphere) {
      case 'Northern': return 'Optimized for latitudes 25°N to 55°N';
      case 'Equatorial': return 'Best for tropical latitudes near the equator';
      case 'Southern': return 'Optimized for latitudes 25°S to 55°S';
      default: return '';
    }
  };

  const filteredHemispheres = selectedHemisphere === 'all' 
    ? ['Northern', 'Equatorial', 'Southern']
    : [selectedHemisphere];

  if (loading) {
    return (
      <LoaderWrapper/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
        </div>

        <div className="max-w-md w-full bg-slate-800/50 border border-slate-600/40 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchSkyMaps}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 rounded-lg text-white font-semibold transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradients matching APOD page */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block">
            <div className="text-6xl md:text-7xl mb-4">✨</div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Sky Maps Collection
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Explore the night sky with our curated collection of astronomical charts for every hemisphere
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-4 sm:gap-6 mt-8 flex-wrap">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 border border-slate-600/40">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {skyMaps.length}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Maps</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 border border-slate-600/40">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                3
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Hemispheres</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 border border-slate-600/40">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-400 bg-clip-text text-transparent">
                HD
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Quality</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-800/50 backdrop-blur-sm rounded-xl p-1.5 border border-slate-600/40 flex-wrap justify-center gap-1">
            {['all', 'Northern', 'Equatorial', 'Southern'].map((hemisphere) => (
              <button
                key={hemisphere}
                onClick={() => setSelectedHemisphere(hemisphere)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all ${
                  selectedHemisphere === hemisphere
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {hemisphere === 'all' ? '🌐 All' : `${getHemisphereIcon(hemisphere)} ${hemisphere}`}
              </button>
            ))}
          </div>
        </div>

        {/* Sky Maps Grid */}
        <div className="space-y-16">
          {filteredHemispheres.map(hemisphere => {
            const hemisphereMaps = skyMaps
              .filter(map => map.hemisphere === hemisphere)
              .sort((a, b) => b.date.localeCompare(a.date));

            if (hemisphereMaps.length === 0) return null;

            return (
              <div key={hemisphere} className="space-y-8">
                <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8 border border-slate-600/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl sm:text-5xl">{getHemisphereIcon(hemisphere)}</span>
                        <div>
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            {hemisphere} Hemisphere
                          </h2>
                          <p className="text-gray-400 text-sm mt-1">{getHemisphereDescription(hemisphere)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-600/40">
                      <span className="text-2xl font-bold text-white">{hemisphereMaps.length}</span>
                      <span className="text-gray-400 text-sm ml-2">maps</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {hemisphereMaps.map(map => (
                    <PDFThumbnailCard key={map.filename} map={map} />
                  ))}
                </div>
              </div>
            );
          })}

          {skyMaps.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <div className="text-7xl mb-6">🌙</div>
              <p className="text-2xl font-semibold text-white mb-2">No sky maps available</p>
              <p className="text-gray-500">Please check back later for new celestial charts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PDFThumbnailCard({ map }: { map: SkyMapPDF }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const proxiedPdfUrl = `/api/pdf-proxy?url=${encodeURIComponent(map.url)}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setThumbnailError(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setThumbnailError(true);
  }

  const getHemisphereBadgeColor = (hemisphere: string) => {
    switch (hemisphere) {
      case 'Northern': return 'from-blue-500 to-purple-500';
      case 'Equatorial': return 'from-purple-500 to-pink-500';
      case 'Southern': return 'from-pink-500 to-blue-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <a
      href={map.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600/40 hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20"
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
      
      {/* PDF Thumbnail */}
      <div className="relative w-full h-72 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center overflow-hidden">
        {!thumbnailError ? (
          <Document
            file={proxiedPdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 bg-purple-500/50 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm font-medium">Loading preview...</div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-3">📄</div>
                  <div className="text-sm font-medium">Preview unavailable</div>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={320}
              height={260}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl transition-transform duration-500 group-hover:scale-105"
              loading={
                <div className="w-[320px] h-[260px] bg-slate-800/50 animate-pulse rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Rendering...</span>
                </div>
              }
            />
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center p-6">
              <div className="text-7xl mb-4">🗺️</div>
              <div className="text-base font-semibold text-white mb-1">Sky Chart PDF</div>
              <div className="text-sm text-gray-400">{map.monthYear}</div>
            </div>
          </div>
        )}

        {/* Hover Overlay with gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className={`transition-all duration-500 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-5 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {numPages && (
            <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white font-semibold border border-slate-600/40 shadow-lg">
              📄 {numPages} {numPages === 1 ? 'page' : 'pages'}
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <div className={`bg-gradient-to-r ${getHemisphereBadgeColor(map.hemisphere)} backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-white font-bold border border-white/20 shadow-lg`}>
            {map.hemisphere}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="relative p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold uppercase tracking-wider">
              Sky Chart
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-500 group-hover:to-pink-500 transition-all">
            {map.monthYear}
          </h3>
          <p className="text-xs text-gray-500 font-mono truncate">
            {map.filename}
          </p>
        </div>

        {/* Download CTA */}
        <div className="pt-4 border-t border-slate-600/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-ping"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full absolute group-hover:animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-gray-300 font-medium">
              Publication quality
            </span>
          </div>
          <div className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transition-colors">
            <span className="text-sm font-semibold">Download</span>
            <div className="transform group-hover:translate-x-1 transition-transform text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}