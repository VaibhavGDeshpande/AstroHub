// components/astro-exposure-calculator/AstroExposureCalculator.tsx

'use client';

import { useState } from 'react';
import ExposureForm from './ExposureForm';
import ResultsDisplay from './ResultsDisplay';
import TargetTipsPanel from './TargetTipsPanel';
import ShootingPlan from './ShootingPlan';
import LightPollutionPanel from './LightPollutionPanel';
import { CameraSpecs, LensSpecs, ExposureSettings, CalculatedResults, AstroTarget, BortleScale } from './types';
import { calculateExposureMetrics } from './utils';

export default function AstroExposureCalculator() {
  const [results, setResults] = useState<CalculatedResults | null>(null);
  const [currentTarget, setCurrentTarget] = useState<AstroTarget>('milky-way');
  const [currentExposure, setCurrentExposure] = useState<ExposureSettings | null>(null);
  const [currentBortle, setCurrentBortle] = useState<BortleScale>(4);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (
    camera: CameraSpecs,
    lens: LensSpecs,
    exposure: ExposureSettings,
    target: AstroTarget,
    latitude: number,
    bortleScale: BortleScale
  ) => {
    try {
      setError(null);
      
      // Validation
      if (!bortleScale || typeof bortleScale !== 'number' || bortleScale < 1 || bortleScale > 9) {
        throw new Error(`Invalid Bortle scale: ${bortleScale}. Please select a value between 1 and 9.`);
      }
      
      const calculatedResults = calculateExposureMetrics(
        camera, 
        lens, 
        exposure, 
        { latitude, bortleScale }
      );
      
      setResults(calculatedResults);
      setCurrentTarget(target);
      setCurrentExposure(exposure);
      setCurrentBortle(bortleScale);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      console.error('Error calculating exposure metrics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Astrophotography Exposure Calculator
          </h1>
          <p className="text-gray-400 text-lg">
            Plan your perfect night sky photography session with light pollution analysis
          </p>
        </div>

        {/* Calculator Form */}
        <div className="mb-8">
          <ExposureForm onCalculate={handleCalculate} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-5 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">❌</div>
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-1">Calculation Error</h4>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Target Tips (Always Visible) */}
        <div className="mb-8">
          <TargetTipsPanel target={currentTarget} />
        </div>

        {/* Results Section */}
        {results && currentExposure && (
          <div id="results-section">
            {/* Light Pollution Panel */}
            <div className="mb-8">
              <LightPollutionPanel 
                bortleScale={currentBortle} 
                adjustedSettings={results.adjustedSettings}
              />
            </div>

            {/* Results Display */}
            <div className="mb-8">
              <ResultsDisplay results={results} target={currentTarget} />
            </div>

            {/* Shooting Plan */}
            <div className="mb-8">
              <ShootingPlan 
                exposure={currentExposure} 
                results={results} 
                target={currentTarget}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
