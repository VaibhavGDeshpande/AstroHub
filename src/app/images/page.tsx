'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  NivlItem, 
  NivlSearchParams,
  SearchFilters,
  NivlSearchResponse
} from '@/types/nivl';
import { searchNasaMedia, getNasaAssets, createSearchParams } from '../../api_service/example';
import Filter from '@/components/NIVL/SearchFilter';
import MediaGrid from '@/components/NIVL/MediaGrid';
import MediaViewer from '@/components/NIVL/MediaViewer';
import Pagination from '@/components/NIVL/Pagination';
import { 
  ArrowLeftIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';
import LoaderWrapper from '@/components/Loader';

export default function NasaMediaBrowser() {
  const [searchResults, setSearchResults] = useState<NivlItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NivlItem | null>(null);
  const [assetUrl, setAssetUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query:'earth',
    mediaType: 'all',
    center: '',
    yearStart: '',
    yearEnd: '',
    keywords: '',
    photographer: '',
    location: ''
  });

  const handleSearch = async (page: number = 1) => {
    setLoading(true);
    setError('');
    setCurrentPage(page);
    
    try {
      const searchParams: NivlSearchParams = createSearchParams(filters);
      searchParams.page = page;
      searchParams.page_size = itemsPerPage;
      
      const results: NivlSearchResponse = await searchNasaMedia(searchParams);
      
      setSearchResults(results.collection.items);
      setTotalItems(results.collection.metadata.total_hits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search NASA media';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item: NivlItem) => {
    setSelectedItem(item);
    setLoading(true);
    setError('');
    
    try {
      const nasaId = item.data[0]?.nasa_id;
      if (!nasaId) {
        throw new Error('No NASA ID found for this item');
      }

      const assets = await getNasaAssets(nasaId);
      
      // Find the best quality video or image
      const videoAsset = assets.find(asset => 
        asset.includes('.mp4') || asset.includes('.mov') || asset.includes('.webm')
      );
      
      const imageAsset = assets.find(asset => 
        asset.includes('.jpg') || asset.includes('.png') || asset.includes('.jpeg')
      );

      setAssetUrl(videoAsset || imageAsset || assets[0] || '');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load asset';
      setError(errorMessage);
      console.error('Asset loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      mediaType: 'all',
      center: '',
      yearStart: '',
      yearEnd: '',
      keywords: '',
      photographer: '',
      location: ''
    });
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cosmic Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-indigo-500/15 blur-[90px]" />
        <div className="absolute bottom-32 right-32 w-56 h-56 bg-cyan-500/15 blur-[80px]" />
      </div>

      {/* Fixed Back Button */}
      <div className="fixed top-4 left-4 z-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 mt-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              NASA Media Browser
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-slate-300"
          >
            Explore NASA&apos;s vast collection of images and videos from across the cosmos
          </motion.p>
        </motion.div>

        {/* Search Filters with Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <Filter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={() => handleSearch(1)}
            onReset={handleResetFilters}
            loading={loading}
          />
        </motion.div>

        {/* Error Display with Cosmic Styling */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Error</h3>
                <p className="text-sm text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section with Glass Morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/40 rounded-xl p-6 mb-8"
        >
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-xl font-semibold text-white mb-4"
          >
            Search Results ({totalItems.toLocaleString()} items)
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <MediaGrid
              items={searchResults}
              onItemClick={handleItemClick}
              loading={loading}
            />
          </motion.div>

          {/* Pagination with Animation */}
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Media Modal */}
        {selectedItem && (
          <MediaViewer
            item={selectedItem}
            assetUrl={assetUrl}
            loading={loading}
            onClose={() => {
              setSelectedItem(null);
              setAssetUrl('');
            }}
            onOpenInNewTab={openImageInNewTab}
          />
        )}
      </div>
    </div>
    </LoaderWrapper>
  );
}
