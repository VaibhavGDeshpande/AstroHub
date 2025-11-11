// components/astro-exposure-calculator/TargetTipsPanel.tsx

'use client';

import { AstroTarget } from './types';
import { targetPresets, getTargetIcon, formatTime } from './utils';

interface TargetTipsPanelProps {
  target: AstroTarget;
}

export default function TargetTipsPanel({ target }: TargetTipsPanelProps) {
  const targetData = targetPresets[target];

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">{getTargetIcon(target)}</div>
        <h3 className="text-2xl font-semibold text-purple-400">{targetData.name}</h3>
      </div>

      {/* Recommended Settings */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Recommended Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">ISO Range</div>
            <div className="text-lg font-semibold text-white">
              {targetData.recommendedISO.join(' / ')}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Aperture (f-stop)</div>
            <div className="text-lg font-semibold text-white">
              f/{targetData.recommendedAperture.join(' - f/')}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Exposure Time</div>
            <div className="text-lg font-semibold text-white">
              {targetData.recommendedExposure.map(e => formatTime(e)).join(' / ')}
            </div>
          </div>
        </div>

        {targetData.minIntegrationTime && (
          <div className="mt-3 p-3 bg-purple-900/30 border border-purple-700 rounded-lg">
            <div className="text-sm text-purple-300">
              <strong>Minimum Integration Time:</strong> {targetData.minIntegrationTime} minutes
            </div>
          </div>
        )}
      </div>

      {/* Photography Tips */}
      <div>
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Photography Tips</h4>
        
        <div className="space-y-2">
          {targetData.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <div className="text-green-400 mt-1">✓</div>
              <div className="text-gray-300">{tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Notes */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-yellow-400 text-xl">📝</div>
          <div className="text-sm text-yellow-200">
            <strong>Equipment Note:</strong> {getEquipmentNote(target)}
          </div>
        </div>
      </div>
    </div>
  );
}

function getEquipmentNote(target: AstroTarget): string {
  const notes: Record<AstroTarget, string> = {
    'milky-way': 'Wide angle lens (14-24mm) with fast aperture (f/1.4-f/2.8) recommended. Sturdy tripod essential.',
    'deep-sky': 'Star tracker or equatorial mount required for exposures over 30s. Quality tripod essential.',
    'star-trails': 'Sturdy tripod and intervalometer required. No tracking needed.',
    'moon': 'Telephoto lens (200mm+) or telescope recommended. Tripod sufficient, no tracking needed.',
    'planets': 'Long focal length (400mm+) or telescope essential. Video recording preferred over still photos.',
    'aurora': 'Wide angle lens (14-24mm) with very fast aperture (f/1.4-f/2.8). Remote shutter release helpful.',
    'wide-field': 'Wide to normal lens (14-50mm). Fast aperture preferred. Consider foreground composition.',
  };
  return notes[target];
}
