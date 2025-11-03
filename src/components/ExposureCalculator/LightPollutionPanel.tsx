// components/astro-exposure-calculator/LightPollutionPanel.tsx

'use client';

import { BortleScale } from './types';
import { bortleScaleData, getBortleColor, formatTotalTime } from './utils';

interface LightPollutionPanelProps {
  bortleScale: BortleScale;
  adjustedSettings: {
    recommendedISO: number;
    recommendedFrames: number;
    estimatedSessionTime: number;
  };
}

export default function LightPollutionPanel({ bortleScale, adjustedSettings }: LightPollutionPanelProps) {
  const data = bortleScaleData[bortleScale];

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-2xl font-semibold mb-4 text-orange-400">🌃 Light Pollution Impact</h3>

      {/* Bortle Scale Indicator */}
      <div className={`p-6 rounded-lg border-2 bg-gradient-to-r ${getBortleColor(bortleScale)} mb-6`}>
        <div className="text-white">
          <div className="text-3xl font-bold mb-2">Bortle {bortleScale}</div>
          <div className="text-xl mb-3">{data.class}</div>
          <div className="text-sm opacity-90 mb-3">{data.description}</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-black/20 p-3 rounded">
              <div className="text-xs opacity-75 mb-1">Difficulty Level</div>
              <div className="font-semibold">{data.difficulty}</div>
            </div>
            <div className="bg-black/20 p-3 rounded">
              <div className="text-xs opacity-75 mb-1">Sky Glow</div>
              <div className="font-semibold text-sm">{data.skyGlow}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjusted Settings */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Pollution-Adjusted Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Recommended ISO</div>
            <div className="text-2xl font-bold text-yellow-400">{adjustedSettings.recommendedISO}</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.isoMultiplier}x adjustment
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Recommended Frames</div>
            <div className="text-2xl font-bold text-blue-400">{adjustedSettings.recommendedFrames}</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.integrationMultiplier}x more frames needed
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Est. Session Time</div>
            <div className="text-2xl font-bold text-purple-400">
              {formatTotalTime(adjustedSettings.estimatedSessionTime)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Total with calibration
            </div>
          </div>
        </div>
      </div>

      {/* Filter Recommendations */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Filter Recommendations</h4>
        
        <div className="space-y-2">
          {data.recommendedFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2 text-sm bg-gray-900 p-3 rounded-lg border border-gray-700">
              <div className="text-green-400">✓</div>
              <div className="text-gray-300">{filter}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What's Visible */}
      <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <div className="text-sm text-blue-300">
          <strong className="text-blue-200">What You'll See:</strong> {data.visible}
        </div>
      </div>

      {/* Light Pollution Tips */}
      {bortleScale >= 5 && (
        <div className="mt-4 p-4 bg-orange-900/20 border border-orange-700 rounded-lg">
          <h5 className="font-semibold text-orange-400 mb-2">Tips for Light-Polluted Areas</h5>
          <ul className="space-y-1 text-sm text-orange-200">
            <li>• Use light pollution filters (UHC, L-Pro, etc.)</li>
            <li>• Process gradients carefully in post-production</li>
            <li>• Take extra flat frames for gradient removal</li>
            <li>• Consider narrowband imaging for nebulae</li>
            <li>• Travel to darker skies when possible</li>
          </ul>
        </div>
      )}
    </div>
  );
}
