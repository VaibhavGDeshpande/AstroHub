/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowsPointingOutIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import { fetchWallpapers, PexelsPhoto } from '@/api_service/wallpapers';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WallpaperGallery() {
  const [query, setQuery] = useState('astronomy space');
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected Image for Lightbox
  const [selectedImage, setSelectedImage] = useState<PexelsPhoto | null>(null);

  const loadPhotos = useCallback(async (searchQuery: string, pageNum: number, isNewSearch: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWallpapers(searchQuery, pageNum);
      
      if (isNewSearch) {
        setPhotos(response.photos);
      } else {
        setPhotos(prev => [...prev, ...response.photos]);
      }
      
      setHasMore(response.photos.length > 0 && !!response.next_page);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch wallpapers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos(query, 1, true);
  }, []); // Only run once on mount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    loadPhotos(query, 1, true);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPhotos(query, nextPage, false);
  };

  const handleDownload = async (photo: PexelsPhoto) => {
    try {
      // Create an anchor tag and trigger download
      const response = await fetch(photo.src.original);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AstroHub-Wallpaper-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-black/60 to-transparent">
      <div className="fixed top-4 left-4 z-50 hidden md:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300 group"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <HomeIcon className="h-4 w-4 hidden sm:block" />
            <span className="text-sm">Back</span>
          </Link>
        </motion.div>
      </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 drop-shadow-lg">
          Cosmic Wallpapers
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Discover breathtaking astronomical imagery for your desktop and mobile devices. <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 ml-1">Powered by Pexels</a>.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-6 w-6 text-cyan-400/70 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full bg-black/50 border border-cyan-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-md transition-all text-lg shadow-lg"
            placeholder="Search for galaxies, nebulas, moon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-cyan-500/25"
          >
            Search
          </button>
        </form>
      </div>

      {/* Gallery Section */}
      <div className="flex-grow max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        {error ? (
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  className="relative group rounded-2xl overflow-hidden break-inside-avoid shadow-lg bg-black/40 border border-cyan-900/30"
                >
                  <Image
                    src={photo.src.large}
                    alt={photo.alt || "Space Wallpaper"}
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    style={{ backgroundColor: photo.avg_color }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-white text-sm font-medium truncate mb-1">
                      Photo by {photo.photographer}
                    </p>
                    <div className="flex items-center space-x-3 mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(photo); }}
                        className="flex-1 flex justify-center items-center py-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 text-white rounded-lg transition-colors backdrop-blur-sm group/btn"
                        title="Download Original"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2 group-hover/btn:-translate-y-0.5 transition-transform" />
                        <span className="text-sm font-semibold">Download</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(photo); }}
                        className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                        title="View Fullscreen"
                      >
                        <ArrowsPointingOutIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Loading / Load More state */}
            <div className="mt-16 text-center">
              {loading ? (
                <div className="inline-block w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              ) : hasMore && photos.length > 0 ? (
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-full font-bold uppercase tracking-wider transition-all"
                >
                  Load More Wallpapers
                </button>
              ) : photos.length === 0 && !loading ? (
                <div className="py-20">
                  <p className="text-gray-400 text-lg">No wallpapers found for &quot;{query}&quot;.</p>
                </div>
              ) : null}
            </div>
            {/* Powered by Pexels attribution */}
            <div className="mt-16 text-center flex items-center justify-center space-x-3">
              <span className="text-gray-400 text-sm font-medium">Photos provided by</span>
              <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="https://images.pexels.com/lib/api/pexels.png" 
                  alt="Pexels" 
                  width={100} 
                  height={40} 
                  className="opacity-70 hover:opacity-100 transition-opacity filter invert" 
                  unoptimized 
                />
              </a>
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-7xl flex flex-col justify-center" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedImage.src.original}
                alt={selectedImage.alt || "Fullscreen Space Wallpaper"}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-black/50 p-4 rounded-xl border border-white/10">
               <div className="mb-4 sm:mb-0 text-center sm:text-left">
                  <p className="text-white font-medium text-lg">By {selectedImage.photographer}</p>
                  <a href={selectedImage.photographer_url} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm hover:underline">
                    View on Pexels
                  </a>
               </div>
               <button
                  onClick={() => handleDownload(selectedImage)}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center transition-colors font-semibold"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download Resolution ({selectedImage.width}x{selectedImage.height})
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
