'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import LoaderWrapper from '../Loader';

// Use unpkg CDN with the exact version from react-pdf
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

  if (loading) {
    return (
      <LoaderWrapper/>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
        <button 
          onClick={fetchSkyMaps}
          className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {['Northern', 'Equatorial', 'Southern'].map(hemisphere => {
        const hemisphereMaps = skyMaps
          .filter(map => map.hemisphere === hemisphere)
          .sort((a, b) => b.date.localeCompare(a.date));

        if (hemisphereMaps.length === 0) return null;

        return (
          <div key={hemisphere} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{getHemisphereIcon(hemisphere)}</span>
                <h2 className="text-3xl font-bold text-white">
                  {hemisphere} Hemisphere
                </h2>
              </div>
              <p className="text-gray-400 ml-14">{getHemisphereDescription(hemisphere)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hemisphereMaps.map(map => (
                <PDFThumbnailCard key={map.filename} map={map} />
              ))}
            </div>
          </div>
        );
      })}

      {skyMaps.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">No sky maps available at the moment.</p>
          <p className="mt-2">Please check back later.</p>
        </div>
      )}
    </div>
  );
}

function PDFThumbnailCard({ map }: { map: SkyMapPDF }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Create proxied URL for the PDF
  const proxiedPdfUrl = `/api/pdf-proxy?url=${encodeURIComponent(map.url)}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setThumbnailError(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setThumbnailError(true);
  }

  return (
    <a
      href={map.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20"
    >
      {/* PDF Thumbnail */}
      <div className="relative w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        {!thumbnailError ? (
          <Document
            file={proxiedPdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
                <div className="text-gray-400 text-sm">Loading preview...</div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-5xl mb-2">📄</div>
                  <div className="text-sm">Preview unavailable</div>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={280}
              height={240}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
              loading={
                <div className="w-[280px] h-[240px] bg-slate-700/50 animate-pulse rounded flex items-center justify-center">
                  <span className="text-gray-500">Rendering...</span>
                </div>
              }
            />
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center p-4">
              <div className="text-6xl mb-3">🗺️</div>
              <div className="text-sm font-medium">Sky Chart PDF</div>
              <div className="text-xs text-gray-500 mt-1">{map.monthYear}</div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-blue-500 rounded-full p-4 shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Page Count Badge */}
        {numPages && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
            {numPages} {numPages === 1 ? 'page' : 'pages'}
          </div>
        )}

        {/* Hemisphere Badge */}
        <div className="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
          {map.hemisphere}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="text-sm text-blue-400 mb-1 font-medium">Sky Chart</div>
            <div className="text-xl font-bold text-white mb-1">
              {map.monthYear}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {map.filename}
            </div>
          </div>
          <div className="text-2xl text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
            ↓
          </div>
        </div>

        {/* Download CTA */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors flex items-center">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 group-hover:animate-pulse"></span>
            Click to download • Publication quality
          </p>
        </div>
      </div>
    </a>
  );
}
