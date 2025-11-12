'use client';

import { useState } from 'react';
import CalculatorForm from '@/components/TelescopeCalculator/CalculatorForm';
import ResultsDisplay from '@/components/TelescopeCalculator/ResultDisplay';
import FOVVisualization from '@/components/TelescopeCalculator/FOVVisualization';
import { TelescopeSpecs, EyepieceSpecs, CalculatedResults } from '@/components/TelescopeCalculator/types';
import { calculateTelescopePerformance } from '@/components/TelescopeCalculator/utils';
import LoaderWrapper from '@/components/Loader';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
    <LoaderWrapper>

      <div className="fixed top-4 left-4 z-50 hidden md:block">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </motion.div>
      </div>


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
    </LoaderWrapper>
  );
}
