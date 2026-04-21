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
              <td className="py-3 px-2 text-gray-400">Effective Focal Ratio</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white font-medium">
                  f/{res.effectiveFocalRatio}
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
              <td className="py-3 px-2 text-gray-400">Resolving Power (Rayleigh / Dawes)</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-white">
                  {res.resolvingPower}&quot; / {res.dawesLimit}&quot;
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

            <tr className="border-b border-gray-700 bg-blue-900/10">
              <td className="py-3 px-2 text-blue-300 font-medium">Light Gathering Power</td>
              {results.map(({ eyepiece, results: res }) => (
                <td key={eyepiece.id} className="text-right py-3 px-2 text-blue-300 font-bold">
                  {res.lightGatheringPower}x <span className="text-[10px] font-normal text-slate-500 text-uppercase">vs Eye</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Individual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ eyepiece, results: res }) => (
          <div key={eyepiece.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 group hover:border-blue-500/30 transition-all">
            <h4 className="text-lg font-semibold mb-3 text-white border-b border-gray-700 pb-2">{eyepiece.name}</h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Magnification:</span>
                <span className="text-blue-400 font-black">{res.magnification}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Effective Ratio:</span>
                <span className="text-white font-bold">f/{res.effectiveFocalRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">True FOV:</span>
                <span className="text-white">{res.trueFOV}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Exit Pupil:</span>
                <span className={res.exitPupil > 7 ? 'text-yellow-400 font-bold' : 'text-white'}>
                  {res.exitPupil}mm
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-700/50 pt-2">
                <span className="text-gray-400 font-medium text-xs">Light Gathering:</span>
                <span className="text-blue-300 font-bold">{res.lightGatheringPower}x</span>
              </div>
              
              {res.magnification > res.maxUsefulMagnification && (
                <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded text-xs text-red-400 font-medium">
                  ⚠️ Exceeds max useful ({res.maxUsefulMagnification}x)
                </div>
              )}
              
              {res.exitPupil > 7 && (
                <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700 rounded text-xs text-yellow-400 font-medium">
                  ⚠️ Pupil waste ({res.exitPupil}mm &gt; 7mm)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
