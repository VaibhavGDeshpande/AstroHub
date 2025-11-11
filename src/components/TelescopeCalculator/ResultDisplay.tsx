// components/telescope-calculator/ResultsDisplay.tsx

'use client';

import { CalculatedResults, EyepieceSpecs } from './types';

interface ResultsDisplayProps {
  results: Array<{ eyepiece: EyepieceSpecs; results: CalculatedResults }>;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Performance Comparison</h3>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-gray-400 font-medium">Parameter</th>
              {results.map(({ eyepiece }) => (
                <th key={eyepiece.id} className="text-right py-3 px-2 text-gray-300 font-medium">
                  {eyepiece.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-3 px-2 text-gray-400">Eyepiece FL (mm)</td>
              {results.map(({ eyepiece }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white">
                  {eyepiece.focalLength}mm
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-700">
              <td className="py-3 px-2 text-gray-400">Barlow Factor</td>
              {results.map(({ eyepiece }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white">
                  {eyepiece.barlowFactor}x
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-700 bg-gray-900">
              <td className="py-3 px-2 text-gray-300 font-medium">Magnification</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-blue-400 font-semibold">
                  {res.magnification}x
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-700">
              <td className="py-3 px-2 text-gray-400">True FOV (°)</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white">
                  {res.trueFOV}°
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-700">
              <td className="py-3 px-2 text-gray-400">Exit Pupil (mm)</td>
              {results.map(({ eyepiece, results: res }) => (
                <td 
                  key={eyepiece.id} 
                  className={`text-right py-3 px-2 ${
                    res.exitPupil > 7 ? 'text-yellow-400' : 'text-white'
                  }`}
                >
                  {res.exitPupil}mm
                  {res.exitPupil > 7 && ' ⚠️'}
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-700">
              <td className="py-3 px-2 text-gray-400">Resolving Power (&quot;)</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white">
                  {res.resolvingPower}&quot;
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-700">
              <td className="py-3 px-2 text-gray-400">Limiting Magnitude</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white">
                  {res.limitingMagnitude}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Individual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ eyepiece, results: res }) => (
          <div key={eyepiece.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-white">{eyepiece.name}</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Magnification:</span>
                <span className="text-blue-400 font-semibold">{res.magnification}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">True FOV:</span>
                <span className="text-white">{res.trueFOV}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Exit Pupil:</span>
                <span className={res.exitPupil > 7 ? 'text-yellow-400' : 'text-white'}>
                  {res.exitPupil}mm
                </span>
              </div>
              
              {res.magnification > res.maxUsefulMagnification && (
                <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded text-xs text-red-400">
                  ⚠️ Exceeds max useful magnification ({res.maxUsefulMagnification}x)
                </div>
              )}
              
              {res.exitPupil > 7 && (
                <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700 rounded text-xs text-yellow-400">
                  ⚠️ Exit pupil larger than human eye (7mm)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
