// components/telescope-calculator/TelescopeCalculator.tsx

'use client';

import { useState } from 'react';
import CalculatorForm from './CalculatorForm';
import ResultsDisplay from './ResultDisplay';
import FOVVisualization from './FOVVisualization';
import { TelescopeSpecs, EyepieceSpecs, CalculatedResults } from './types';
import { calculateTelescopePerformance } from './utils';

export default function TelescopeCalculator() {
  const [results, setResults] = useState<
    Array<{ eyepiece: EyepieceSpecs; results: CalculatedResults }>
  >([]);

  const handleCalculate = (telescope: TelescopeSpecs, eyepieces: EyepieceSpecs[]) => {
    const calculatedResults = eyepieces.map((eyepiece) => ({
      eyepiece,
      results: calculateTelescopePerformance(telescope, eyepiece),
    }));

    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Telescope Calculator
          </h1>
          <p className="text-gray-400 text-lg">
            Calculate your telescope&apos;s performance with different eyepieces
          </p>
        </div>

        {/* Calculator Form */}
        <div className="mb-8">
          <CalculatorForm onCalculate={handleCalculate} />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <>
            <div className="mb-8">
              <ResultsDisplay results={results} />
            </div>

            <div className="mb-8">
              <FOVVisualization results={results} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
