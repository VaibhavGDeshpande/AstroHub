// app/mars-photos/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon, PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { getMarsPhotos } from '@/api_service/mars_orbiter';
import { MarsOrbiter } from '@/types/mars_orbiter';
import MarsPhotoCard from '@/components/MarsOrbiter/MarsPhotoCard';
import RoverInfo from '@/components/MarsOrbiter/RoverInfo';
import MarsPhotoControls from '@/components/MarsOrbiter/MarsPhotoControl';

export default function MarsPhotosPage() {
  const [photos, setPhotos] = useState<MarsOrbiter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRover, setCurrentRover] = useState<MarsOrbiter['rover'] | null>(null);

  // New: cameras available (full_name) derived from current results
  const camerasAvailable = useMemo(
    () => Array.from(new Set(photos.map((p) => p.camera.full_name))).filter(Boolean),
    [photos]
  );

  useEffect(() => {
    handleSearch({ rover: 'curiosity', earthDate: '2015-06-03' });
  }, []);

  const handleSearch = useCallback(async (params: {
    rover: string;
    earthDate?: string;
    camera?: string; // short code (e.g., FHAZ)
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Call shape: rover, earth_date, camera
      const response = await getMarsPhotos(
        params.rover as 'curiosity',
        params.earthDate,
        params.camera
      );

      setPhotos(response.photos);

      // Correct rover assignment from first photo if available
      if (response.photos.length > 0) {
        setCurrentRover(response.photos.rover);
      } else {
        setCurrentRover(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Mars photos');
      setPhotos([]);
      setCurrentRover(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const openInNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      {/* Back button (consistent with EPIC) */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Go back to home page"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Mars Rover Photos
          </h1>
          <p className="text-slate-300">
            Explore images captured by NASA&apos;s rovers on the Martian surface
          </p>
        </motion.header>

        {/* Controls with dynamic cameras */}
        <MarsPhotoControls
          onSearch={handleSearch}
          loading={loading}
          camerasAvailable={camerasAvailable}
        />

        {/* Rover Info */}
        {currentRover && <RoverInfo rover={currentRover} />}

        {/* Error card */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-red-300 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white mb-1">Error loading photos</p>
                  <p className="text-sm text-slate-300">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading card */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 mb-6 flex items-center justify-center"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-8 h-8 border-2 border-blue-500/30 rounded-full"
                  style={{ borderTopColor: 'rgb(59 130 246)' }}
                />
                <p className="text-slate-300">Loading Mars photos...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photos */}
        {!loading && photos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PhotoIcon className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Photos Found: {photos.length}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <MarsPhotoCard key={photo.id} photo={photo} onOpenFull={openInNewTab} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading && photos.length === 0 && !error && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No photos found</h3>
            <p className="text-slate-300">
              Try adjusting search parameters or selecting a different date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
