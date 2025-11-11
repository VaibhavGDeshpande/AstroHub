// components/astro-exposure-calculator/ShootingPlan.tsx

'use client';

import { ExposureSettings, CalculatedResults, AstroTarget } from './types';
import { formatTime, formatTotalTime } from './utils';

interface ShootingPlanProps {
  exposure: ExposureSettings;
  results: CalculatedResults;
  target: AstroTarget;
}

export default function ShootingPlan({ exposure, results, target }: ShootingPlanProps) {
  const totalFrames = exposure.numberOfFrames + exposure.darkFrames + exposure.flatFrames + exposure.biasFrames;
  const totalLightTime = (exposure.shutterSpeed * exposure.numberOfFrames) / 60;
  const totalCalibrationTime = (exposure.shutterSpeed * exposure.darkFrames) / 60;
  const estimatedTotalTime = totalLightTime + totalCalibrationTime + (totalFrames * 0.05);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-2xl font-semibold mb-6 text-green-400">📋 Shooting Plan</h3>

      {/* Session Summary */}
      <div className="mb-6 p-5 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700 rounded-lg">
        <h4 className="text-lg font-semibold text-green-300 mb-4">Session Summary</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Total Frames</div>
            <div className="text-2xl font-bold text-white">{totalFrames}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Light Frames</div>
            <div className="text-2xl font-bold text-white">{exposure.numberOfFrames}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Integration Time</div>
            <div className="text-2xl font-bold text-white">{formatTotalTime(results.totalIntegrationTime)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Est. Session Time</div>
            <div className="text-2xl font-bold text-white">{formatTotalTime(estimatedTotalTime)}</div>
          </div>
        </div>
      </div>

      {/* Detailed Checklist */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">Shooting Checklist</h4>

        {/* Light Frames */}
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">1</div>
              <h5 className="font-semibold text-blue-400">Light Frames (Main Exposures)</h5>
            </div>
            <div className="text-sm text-gray-400">{formatTotalTime(totalLightTime)}</div>
          </div>
          <div className="ml-8 space-y-1 text-sm text-gray-300">
            <div>• Frames: <span className="text-white font-semibold">{exposure.numberOfFrames}</span></div>
            <div>• Exposure: <span className="text-white font-semibold">{formatTime(exposure.shutterSpeed)}</span></div>
            <div>• ISO: <span className="text-white font-semibold">{exposure.iso}</span></div>
            <div>• Aperture: <span className="text-white font-semibold">f/{exposure.aperture}</span></div>
            {target === 'deep-sky' && exposure.shutterSpeed > 30 && (
              <div className="text-yellow-400 mt-2">⚠️ Star tracker required for {exposure.shutterSpeed}s exposures</div>
            )}
          </div>
        </div>

        {/* Dark Frames */}
        {exposure.darkFrames > 0 && (
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white font-bold text-xs">2</div>
                <h5 className="font-semibold text-purple-400">Dark Frames</h5>
              </div>
              <div className="text-sm text-gray-400">{formatTotalTime(totalCalibrationTime)}</div>
            </div>
            <div className="ml-8 space-y-1 text-sm text-gray-300">
              <div>• Frames: <span className="text-white font-semibold">{exposure.darkFrames}</span></div>
              <div>• Same ISO ({exposure.iso}) and exposure ({formatTime(exposure.shutterSpeed)}) as light frames</div>
              <div>• Lens cap ON, same temperature as light frames</div>
            </div>
          </div>
        )}

        {/* Flat Frames */}
        {exposure.flatFrames > 0 && (
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xs">3</div>
                <h5 className="font-semibold text-green-400">Flat Frames</h5>
              </div>
            </div>
            <div className="ml-8 space-y-1 text-sm text-gray-300">
              <div>• Frames: <span className="text-white font-semibold">{exposure.flatFrames}</span></div>
              <div>• Use white t-shirt or flat panel over lens</div>
              <div>• Expose to mid-histogram (adjust shutter speed)</div>
              <div>• Same aperture as light frames (f/{exposure.aperture})</div>
            </div>
          </div>
        )}

        {/* Bias Frames */}
        {exposure.biasFrames > 0 && (
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-600 flex items-center justify-center text-white font-bold text-xs">4</div>
                <h5 className="font-semibold text-yellow-400">Bias Frames</h5>
              </div>
            </div>
            <div className="ml-8 space-y-1 text-sm text-gray-300">
              <div>• Frames: <span className="text-white font-semibold">{exposure.biasFrames}</span></div>
              <div>• Fastest shutter speed (1/4000s or faster)</div>
              <div>• Lens cap ON, any temperature</div>
              <div>• Same ISO as light frames ({exposure.iso})</div>
            </div>
          </div>
        )}
      </div>

      {/* Pre-Shoot Checklist */}
      <div className="mt-6 p-5 bg-orange-900/20 border border-orange-700 rounded-lg">
        <h4 className="text-lg font-semibold text-orange-400 mb-3">Pre-Shoot Checklist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Camera batteries fully charged (+ spare)</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Memory cards formatted with space</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Tripod stable and leveled</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Lens cleaned (front and rear)</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Camera set to manual mode (M)</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Focus manually on bright star</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Image stabilization OFF</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Shoot in RAW format</span>
          </div>
          {target === 'deep-sky' && (
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Star tracker polar aligned</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Remote shutter/intervalometer ready</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Red flashlight for night vision</span>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Check weather and moon phase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
