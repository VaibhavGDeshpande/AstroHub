// components/astro-exposure-calculator/ResultsDisplay.tsx

'use client';

import { CalculatedResults, AstroTarget } from './types';
import { formatTotalTime } from './utils';

interface ResultsDisplayProps {
  results: CalculatedResults;
  target: AstroTarget;
}

export default function ResultsDisplay({ results, target }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6 rounded-lg border border-blue-700">
          <div className="text-blue-400 text-sm font-medium mb-2">Field of View</div>
          <div className="text-3xl font-bold text-white mb-1">
            {results.fieldOfView.horizontal.toFixed(1)}°×{results.fieldOfView.vertical.toFixed(1)}°
          </div>
          <div className="text-xs text-gray-400">
            Diagonal: {results.fieldOfView.diagonal.toFixed(1)}°
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 rounded-lg border border-green-700">
          <div className="text-green-400 text-sm font-medium mb-2">Max Exposure (NPF)</div>
          <div className="text-3xl font-bold text-white mb-1">
            {results.maxExposureTime.npfRule}s
          </div>
          <div className="text-xs text-gray-400">
            500 Rule: {results.maxExposureTime.rule500.toFixed(1)}s
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 rounded-lg border border-purple-700">
          <div className="text-purple-400 text-sm font-medium mb-2">Total Integration</div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatTotalTime(results.totalIntegrationTime)}
          </div>
          <div className="text-xs text-gray-400">
            {results.totalIntegrationTime.toFixed(1)} minutes
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 p-6 rounded-lg border border-yellow-700">
          <div className="text-yellow-400 text-sm font-medium mb-2">Image Scale</div>
          <div className="text-3xl font-bold text-white mb-1">
            {results.imageScale}"
          </div>
          <div className="text-xs text-gray-400">
            arcsec/pixel
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Detailed Calculations</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="py-3 px-4 text-gray-400">Horizontal FOV</td>
                <td className="py-3 px-4 text-white font-semibold text-right">
                  {results.fieldOfView.horizontal.toFixed(2)}°
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Vertical FOV</td>
                <td className="py-3 px-4 text-white font-semibold text-right">
                  {results.fieldOfView.vertical.toFixed(2)}°
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Diagonal FOV</td>
                <td className="py-3 px-4 text-white font-semibold text-right">
                  {results.fieldOfView.diagonal.toFixed(2)}°
                </td>
              </tr>
              <tr className="bg-gray-900">
                <td className="py-3 px-4 text-gray-400">Max Exposure (NPF Rule)</td>
                <td className="py-3 px-4 text-green-400 font-semibold text-right">
                  {results.maxExposureTime.npfRule}s
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Max Exposure (500 Rule)</td>
                <td className="py-3 px-4 text-white font-semibold text-right">
                  {results.maxExposureTime.rule500.toFixed(1)}s
                </td>
              </tr>
              <tr className="bg-gray-900">
                <td className="py-3 px-4 text-gray-400">Total Integration Time</td>
                <td className="py-3 px-4 text-purple-400 font-semibold text-right">
                  {formatTotalTime(results.totalIntegrationTime)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Image Scale</td>
                <td className="py-3 px-4 text-white font-semibold text-right">
                  {results.imageScale}" per pixel
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Estimated SNR</td>
                <td className="py-3 px-4 text-white font-semibold text-right">
                  {results.estimatedSNR.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Warnings */}
      {results.warnings.length > 0 && (
        <div className="bg-red-900/20 border border-red-700 p-5 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-400 mb-2">Warnings</h4>
              <ul className="space-y-2">
                {results.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-red-300">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700 p-5 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-blue-300">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
