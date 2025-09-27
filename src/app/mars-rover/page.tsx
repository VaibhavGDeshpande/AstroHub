// app/mars-photos/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion} from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  HomeIcon,
  PhotoIcon,  
} from '@heroicons/react/24/outline';  
import { getMarsPhotos } from '@/api_service/mars_orbiter';
import { MarsOrbiter } from '@/types/mars_orbiter';
import MarsPhotoCard from '@/components/MarsOrbiter/MarsPhotoCard';
// import RoverInfo from '@/components/MarsOrbiter/RoverInfo';
import MarsPhotoControls from '@/components/MarsOrbiter/MarsPhotoControl';
import ErrorMessage from "@/components/Error";
import LoaderWrapper from "@/components/Loader";

export default function MarsPhotosPage() {
  const [photos, setPhotos] = useState<MarsOrbiter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRover, setCurrentRover] = useState<MarsOrbiter['rover'] | null>(null);

  // Cameras available (full_name) derived from current results
  const camerasAvailable = useMemo(
    () => Array.from(new Set(photos.map((p) => p.camera.full_name))).filter(Boolean),
    [photos]
  );

  // Stable search handler
  const handleSearch = useCallback(async (params: {
    rover: string;
    earthDate?: string;
    camera?: string; // short code
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMarsPhotos(
        params.rover,
        params.earthDate,
        params.camera
      );

      // response.photos should be MarsOrbiter[]; set directly
      setPhotos(response.photos);

      // Use first photo's rover if available
      if (response.photos.length > 0) {
        setCurrentRover(response.photos[0].rover);
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

  // Include handleSearch as dependency (stable due to useCallback)
  useEffect(() => {
    handleSearch({ rover: 'curiosity', earthDate: '2015-06-03' });
  }, [handleSearch]);

  const openInNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleRetry = () => {
    setError(null);
    handleSearch({ rover: 'curiosity', earthDate: '2015-06-03' });
  };

  // Error handling with APOD-style ErrorMessage component
  if (error && !loading) {
    return (
      <ErrorMessage
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <LoaderWrapper 
      isVisible={loading} 
      minDuration={1000}
    >
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background gradients - matching APOD style */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        </div>

        {/* Header with Navigation and Controls - matching APOD layout */}
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
          {/* Back Button - APOD style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <HomeIcon className="h-4 w-4 hidden sm:block" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div>

          {/* Mars Photo Controls - positioned like APOD date selector */}
          <MarsPhotoControls
            onSearch={handleSearch}
            loading={loading}
            camerasAvailable={camerasAvailable}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col gap-10">
          {/* Header with gradient title - matching APOD style */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Mars Rover Photos
            </h1>
            <p className="text-slate-300 mt-2">
              Explore images captured by NASA&apos;s rovers on the Martian surface
            </p>
          </motion.div>

          {/* Rover Info with animation delay */}
          {currentRover && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto w-full"
            >
              {/* <RoverInfo rover={currentRover} /> */}
            </motion.div>
          )}

          {/* Main Content */}
          {!loading && photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-7xl">
                {/* Photos count section */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="flex items-center gap-2">
                    <PhotoIcon className="h-5 w-5 text-blue-400" />
                    <h2 className="text-2xl font-semibold text-white">
                      Photos Found: {photos.length}
                    </h2>
                  </div>
                </motion.div>

                {/* Photos grid with staggered animations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {photos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + (index * 0.05) }}
                    >
                      <MarsPhotoCard photo={photo} onOpenFull={openInNewTab} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Empty state with APOD-style design */}
          {!loading && photos.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <div className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm rounded-xl p-8 text-center max-w-md">
                <PhotoIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No photos found</h3>
                <p className="text-slate-300">
                  Try adjusting search parameters or selecting a different date.
                </p>
              </div>
            </motion.div>
          )}

          {/* Empty section for future use - matching APOD pattern */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto w-full"
          >
          </motion.div>
        </div>
      </div>
    </LoaderWrapper>
  );
}
