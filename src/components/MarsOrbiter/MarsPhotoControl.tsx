// components/MarsOrbiter/MarsPhotoControl.tsx
'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  RocketLaunchIcon, 
  CameraIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface MarsPhotoControlsProps {
  onSearch: (params: {
    rover: string;
    earthDate?: string;
    sol?: number;
    camera?: string;
  }) => void | Promise<void>;
  loading: boolean;
  // New: list of full_name strings observed in current results
  camerasAvailable?: string[];
}

const CAMERA_OPTIONS = [
  { code: '', full: 'All Cameras' },
  { code: 'FHAZ', full: 'Front Hazard Avoidance Camera' },
  { code: 'RHAZ', full: 'Rear Hazard Avoidance Camera' },
  { code: 'MAST', full: 'Mast Camera' },
  { code: 'CHEMCAM', full: 'Chemistry and Camera Complex' },
  { code: 'MAHLI', full: 'Mars Hand Lens Imager' },
  { code: 'MARDI', full: 'Mars Descent Imager' },
  { code: 'NAVCAM', full: 'Navigation Camera' },
];

export default function MarsPhotoControls({
  onSearch,
  loading,
  camerasAvailable,
}: MarsPhotoControlsProps) {
  const [rover] = useState('curiosity');
  const [earthDate, setEarthDate] = useState('2015-06-03');
  const [cameraCode, setCameraCode] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Date constraints matching APOD pattern
  const today = new Date().toISOString().split("T")[0];
  const maxDate = today;
  const minDate = "2012-08-06"; // Curiosity landing date

  // If camerasAvailable provided, filter to only those full_names (plus All)
  const filteredOptions = useMemo(() => {
    if (!camerasAvailable || camerasAvailable.length === 0) return CAMERA_OPTIONS;
    const lowerSet = new Set(camerasAvailable.map((f) => f.toLowerCase()));
    const allowed = CAMERA_OPTIONS.filter(
      (opt) => opt.code === '' || lowerSet.has(opt.full.toLowerCase())
    );
    // If current selection becomes invalid, reset to All Cameras
    const stillValid =
      cameraCode === '' || allowed.some((o) => o.code === cameraCode);
    if (!stillValid) {
      setCameraCode('');
    }
    return allowed;
  }, [camerasAvailable, cameraCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      rover,
      earthDate,
      camera: cameraCode || undefined,
    });
    setIsOpen(false); // Close panel after search
  };

  const handleTodayClick = () => {
    setEarthDate(today);
    setCameraCode('');
  };

  const selectedCamera = filteredOptions.find(opt => opt.code === cameraCode) || filteredOptions[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      {/* Toggle Button - matching APOD date button style */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
      >
        <RocketLaunchIcon className="h-4 w-4 text-blue-400" />
        <span className="text-sm text-white hidden sm:inline">Search Mars Photos</span>
        <span className="text-sm text-white sm:hidden">Search</span>
        <ChevronDownIcon 
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Panel - matching APOD modal style */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-slate-800/95 backdrop-blur-md border border-slate-600/40 rounded-xl shadow-2xl z-50"
            >
              <form onSubmit={handleSubmit} className="p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                  <RocketLaunchIcon className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Search Mars Photos</h3>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Rover Display */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Mars Rover
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 border border-slate-600/60 text-white rounded-lg">
                      <RocketLaunchIcon className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">CURIOSITY</span>
                    </div>
                  </div>

                  {/* Earth Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Earth Date
                    </label>
                    <div className="relative">
                      <CalendarDaysIcon className="h-4 w-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                      <input
                        type="date"
                        value={earthDate}
                        onChange={(e) => setEarthDate(e.target.value)}
                        min={minDate}
                        max={maxDate}
                        className="w-full pl-10 pr-3 py-2 bg-slate-700/60 border border-slate-600/60 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Available from {minDate} to {maxDate}
                    </p>
                  </div>

                  {/* Camera Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Camera Type
                    </label>
                    <div className="relative">
                      <CameraIcon className="h-4 w-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                      <select
                        value={cameraCode}
                        onChange={(e) => setCameraCode(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-slate-700/60 border border-slate-600/60 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        {filteredOptions.map((c) => (
                          <option key={c.code || 'ALL'} value={c.code} className="bg-slate-800">
                            {c.full}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {camerasAvailable && camerasAvailable.length > 0 && (
                      <p className="mt-1 text-xs text-slate-400">
                        Showing {filteredOptions.length - 1} cameras found in current results
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-600/40">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg font-medium"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-white/30 rounded-full"
                          style={{ borderTopColor: 'white' }}
                        />
                        Loading...
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="h-4 w-4" />
                        Search Photos
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleTodayClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 hover:text-white border border-slate-600/60 rounded-lg transition-all duration-200 text-sm"
                  >
                    Today
                  </motion.button>
                </div>

                {/* Tip */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">
                    💡 <strong>Tip:</strong> Try Earth date 2015-06-03 for great sample photos
                  </p>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
