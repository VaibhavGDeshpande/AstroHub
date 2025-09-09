'use client';

import React, { useState, useEffect } from 'react';
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
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function NasaMediaBrowser() {
  const [searchResults, setSearchResults] = useState<NivlItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NivlItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [assetUrl, setAssetUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: 'earth',
    mediaType: 'all',
    center: '',
    yearStart: '',
    yearEnd: '',
    keywords: '',
    photographer: '',
    location: ''
  });

  // Initial search on component mount
  useEffect(() => {
    handleSearch(1);
  }, []);

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
    const index = searchResults.findIndex(i => i.data[0]?.nasa_id === item.data[0]?.nasa_id);
    setSelectedIndex(index >= 0 ? index : 0);
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

  const handleThumbnailSelect = (index: number) => {
    if (index >= 0 && index < searchResults.length) {
      handleItemClick(searchResults[index]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GlobeAltIcon className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">NASA Media Browser</h1>
          </div>
          <p className="text-lg text-slate-400">Explore NASA&apos;s vast collection of images and videos</p>
        </div>

        {/* Search Filters */}
        <Filter
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={() => handleSearch(1)}
          onReset={handleResetFilters}
          loading={loading}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 backdrop-blur-sm border border-red-700/50 rounded-xl p-4 mb-6">
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
          </div>
        )}

        {/* Results Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Search Results ({totalItems.toLocaleString()} items)
          </h3>

          <MediaGrid
            items={searchResults}
            onItemClick={handleItemClick}
            loading={loading}
          />

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          )}
        </div>

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
  );
}