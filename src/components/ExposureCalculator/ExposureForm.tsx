// components/astro-exposure-calculator/ExposureForm.tsx

'use client';

import { useState } from 'react';
import { CameraSpecs, LensSpecs, ExposureSettings, AstroTarget, BortleScale } from './types';
import { cameraPresets, commonLenses, targetPresets, bortleScaleData, getBortleColor } from './utils';

interface ExposureFormProps {
  onCalculate: (
    camera: CameraSpecs,
    lens: LensSpecs,
    exposure: ExposureSettings,
    target: AstroTarget,
    latitude: number,
    bortleScale: BortleScale
  ) => void;
}

export default function ExposureForm({ onCalculate }: ExposureFormProps) {
  const [target, setTarget] = useState<AstroTarget>('milky-way');
  const [cameraPreset, setCameraPreset] = useState('Full Frame');
  const [lensPreset, setLensPreset] = useState('24mm f/1.4');
  
  const [camera, setCamera] = useState<CameraSpecs>({
    sensorWidth: 36,
    sensorHeight: 24,
    megapixels: 24,
  });

  const [lens, setLens] = useState<LensSpecs>({
    focalLength: 24,
    aperture: 1.4,
  });

  const [exposure, setExposure] = useState<ExposureSettings>({
    iso: 3200,
    shutterSpeed: 20,
    aperture: 1.4,
    numberOfFrames: 50,
    darkFrames: 20,
    flatFrames: 20,
    biasFrames: 20,
  });

  const [latitude, setLatitude] = useState<number>(40);
  const [bortleScale, setBortleScale] = useState<BortleScale>(4);

  const handleCameraPresetChange = (preset: string) => {
    setCameraPreset(preset);
    if (preset !== 'Custom') {
      const specs = cameraPresets[preset as keyof typeof cameraPresets];
      setCamera({
        sensorWidth: specs.width,
        sensorHeight: specs.height,
        megapixels: specs.mp,
      });
    }
  };

  const handleLensPresetChange = (preset: string) => {
    setLensPreset(preset);
    const lensData = commonLenses.find(l => l.name === preset);
    if (lensData && preset !== 'Custom') {
      setLens({
        focalLength: lensData.focal,
        aperture: lensData.aperture,
      });
      setExposure(prev => ({ ...prev, aperture: lensData.aperture }));
    }
  };

  const handleTargetChange = (newTarget: AstroTarget) => {
    setTarget(newTarget);
    const preset = targetPresets[newTarget];
    
    setExposure(prev => ({
      ...prev,
      iso: preset.recommendedISO[0],
      shutterSpeed: preset.recommendedExposure[0],
      aperture: preset.recommendedAperture[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!bortleScale || bortleScale < 1 || bortleScale > 9) {
      alert('Please select a valid Bortle scale (1-9)');
      return;
    }
    
    onCalculate(camera, lens, exposure, target, latitude, bortleScale);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Type Selection */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">Photography Target</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(targetPresets) as AstroTarget[]).map((targetType) => {
            const preset = targetPresets[targetType];
            return (
              <button
                key={targetType}
                type="button"
                onClick={() => handleTargetChange(targetType)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  target === targetType
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-600 bg-gray-900 hover:border-gray-500'
                }`}
              >
                <div className="text-3xl mb-2">{
                  preset.name.includes('Milky') ? '' : 
                  preset.name.includes('Deep') ? '' : 
                  preset.name.includes('Trail') ? '' :
                  preset.name.includes('Moon') ? '' :
                  preset.name.includes('Planet') ? '' :
                  preset.name.includes('Aurora') ? '' : ''
                }</div>
                <div className="text-sm font-medium">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Camera Specifications</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Camera Preset
          </label>
          <select
            value={cameraPreset}
            onChange={(e) => handleCameraPresetChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(cameraPresets).map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sensor Width (mm)
            </label>
            <input
              type="number"
              value={camera.sensorWidth}
              onChange={(e) => setCamera({ ...camera, sensorWidth: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sensor Height (mm)
            </label>
            <input
              type="number"
              value={camera.sensorHeight}
              onChange={(e) => setCamera({ ...camera, sensorHeight: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Megapixels
            </label>
            <input
              type="number"
              value={camera.megapixels}
              onChange={(e) => setCamera({ ...camera, megapixels: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      {/* Lens Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-green-400">Lens Specifications</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lens Preset
          </label>
          <select
            value={lensPreset}
            onChange={(e) => handleLensPresetChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
          >
            {commonLenses.map((lensOption) => (
              <option key={lensOption.name} value={lensOption.name}>{lensOption.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Focal Length (mm)
            </label>
            <input
              type="number"
              value={lens.focalLength}
              onChange={(e) => setLens({ ...lens, focalLength: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Aperture (f-number)
            </label>
            <input
              type="number"
              value={lens.aperture}
              onChange={(e) => {
                const newAperture = parseFloat(e.target.value) || 0;
                setLens({ ...lens, aperture: newAperture });
                setExposure({ ...exposure, aperture: newAperture });
              }}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              min="0.5"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      {/* Exposure Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Exposure Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ISO
            </label>
            <select
              value={exposure.iso}
              onChange={(e) => setExposure({ ...exposure, iso: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
            >
              {[100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600].map(iso => (
                <option key={iso} value={iso}>{iso}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Shutter Speed (seconds)
            </label>
            <input
              type="number"
              value={exposure.shutterSpeed}
              onChange={(e) => setExposure({ ...exposure, shutterSpeed: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              min="0.001"
              step="any"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Aperture (f-number)
            </label>
            <input
              type="number"
              value={exposure.aperture}
              onChange={(e) => setExposure({ ...exposure, aperture: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              min={lens.aperture}
              max="22"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Frames
            </label>
            <input
              type="number"
              value={exposure.numberOfFrames}
              onChange={(e) => setExposure({ ...exposure, numberOfFrames: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dark Frames
            </label>
            <input
              type="number"
              value={exposure.darkFrames}
              onChange={(e) => setExposure({ ...exposure, darkFrames: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Flat Frames
            </label>
            <input
              type="number"
              value={exposure.flatFrames}
              onChange={(e) => setExposure({ ...exposure, flatFrames: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Location & Sky Conditions - FIXED */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-red-400">Location & Sky Conditions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Latitude (degrees)
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              min="-90"
              max="90"
              step="0.1"
              placeholder="e.g., 40 for New York"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bortle Scale (Light Pollution)
            </label>
            <select
              value={bortleScale}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= 9) {
                  setBortleScale(val as BortleScale);
                }
              }}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              required
            >
              <option value={1}>Class 1 - Excellent Dark Sky </option>
              <option value={2}>Class 2 - Truly Dark Sky </option>
              <option value={3}>Class 3 - Rural Sky </option>
              <option value={4}>Class 4 - Rural/Suburban </option>
              <option value={5}>Class 5 - Suburban Sky </option>
              <option value={6}>Class 6 - Bright Suburban </option>
              <option value={7}>Class 7 - Suburban/Urban </option>
              <option value={8}>Class 8 - City Sky </option>
              <option value={9}>Class 9 - Inner City </option>
            </select>
          </div>
        </div>

        {/* Bortle Info Card */}
        {bortleScaleData[bortleScale] && (
          <div className={`p-4 rounded-lg border-2 bg-gradient-to-r ${getBortleColor(bortleScale)}`}>
            <div className="text-white">
              <div className="font-bold text-lg mb-2">{bortleScaleData[bortleScale].class}</div>
              <div className="text-sm opacity-90 mb-2">{bortleScaleData[bortleScale].description}</div>
              <div className="text-xs opacity-80">
                <strong>Visible:</strong> {bortleScaleData[bortleScale].visible}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 text-xs text-gray-400">
          💡 Check your local light pollution at{' '}
          <a 
            href="https://www.lightpollutionmap.info" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            lightpollutionmap.info
          </a>
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
      >
        Calculate Exposure Plan
      </button>
    </form>
  );
}
