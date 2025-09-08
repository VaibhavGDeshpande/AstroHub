// components/MarsPhotoControls.tsx
'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, RocketLaunchIcon, CameraIcon } from '@heroicons/react/24/outline';

interface MarsPhotoControlsProps {
  onSearch: (params: {
    rover: string;
    earthDate?: string;
    sol?: number;
    camera?: string;
  }) => void;
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
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <RocketLaunchIcon className="h-5 w-5 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Search Mars Photos</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Rover</label>
          <div className="px-3 py-2 bg-slate-700/60 border border-slate-600/60 text-white rounded-md">
            CURIOSITY
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Earth Date</label>
          <div className="relative">
            <CalendarDaysIcon className="h-4 w-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={earthDate}
              onChange={(e) => setEarthDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-700/60 border border-slate-600/60 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Camera</label>
          <div className="relative">
            <CameraIcon className="h-4 w-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={cameraCode}
              onChange={(e) => setCameraCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-700/60 border border-slate-600/60 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filteredOptions.map((c) => (
                <option key={c.code || 'ALL'} value={c.code}>
                  {c.full}
                </option>
              ))}
            </select>
          </div>
          {camerasAvailable && camerasAvailable.length > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              Showing cameras found in current results.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
        >
          {loading ? 'Loading Photos...' : 'Search Mars Photos'}
        </motion.button>
        <span className="text-xs text-slate-400">Tip: Use Earth date 2015-06-03</span>
      </div>
    </motion.form>
  );
}
