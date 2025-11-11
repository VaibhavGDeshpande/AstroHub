// components/telescope-calculator/CalculatorForm.tsx

'use client';

import { useState } from 'react';
import { TelescopeSpecs, EyepieceSpecs } from './types';

interface CalculatorFormProps {
  onCalculate: (telescope: TelescopeSpecs, eyepieces: EyepieceSpecs[]) => void;
}

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [telescope, setTelescope] = useState<TelescopeSpecs>({
    aperture: 200,
    focalLength: 1000,
  });

  const [eyepieces, setEyepieces] = useState<EyepieceSpecs[]>([
    { id: '1', name: 'Eyepiece 1', focalLength: 25, apparentFOV: 50, barlowFactor: 1 },
  ]);

  const handleTelescopeChange = (field: keyof TelescopeSpecs, value: number) => {
    setTelescope((prev) => ({ ...prev, [field]: value }));
  };

  const handleEyepieceChange = (id: string, field: keyof EyepieceSpecs, value: number | string) => {
    setEyepieces((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep))
    );
  };

  const addEyepiece = () => {
    const newId = (eyepieces.length + 1).toString();
    setEyepieces((prev) => [
      ...prev,
      { id: newId, name: `Eyepiece ${newId}`, focalLength: 10, apparentFOV: 50, barlowFactor: 1 },
    ]);
  };

  const removeEyepiece = (id: string) => {
    if (eyepieces.length > 1) {
      setEyepieces((prev) => prev.filter((ep) => ep.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(telescope, eyepieces);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Telescope Specifications */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Telescope Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Aperture (mm)
            </label>
            <input
              type="number"
              value={telescope.aperture}
              onChange={(e) => handleTelescopeChange('aperture', parseFloat(e.target.value))}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              min="1"
              step="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Focal Length (mm)
            </label>
            <input
              type="number"
              value={telescope.focalLength}
              onChange={(e) => handleTelescopeChange('focalLength', parseFloat(e.target.value))}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              min="1"
              step="1"
              required
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-400">
            Focal Ratio: <span className="text-white font-semibold">f/{(telescope.focalLength / telescope.aperture).toFixed(1)}</span>
          </p>
        </div>
      </div>

      {/* Eyepiece Specifications */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-400">Eyepiece Specifications</h3>
          <button
            type="button"
            onClick={addEyepiece}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Eyepiece
          </button>
        </div>

        <div className="space-y-4">
          {eyepieces.map((eyepiece) => (
            <div key={eyepiece.id} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <input
                  type="text"
                  value={eyepiece.name}
                  onChange={(e) => handleEyepieceChange(eyepiece.id, 'name', e.target.value)}
                  className="bg-transparent text-lg font-medium text-white border-none focus:outline-none"
                />
                {eyepieces.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEyepiece(eyepiece.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Focal Length (mm)
                  </label>
                  <input
                    type="number"
                    value={eyepiece.focalLength}
                    onChange={(e) => handleEyepieceChange(eyepiece.id, 'focalLength', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Apparent FOV (°)
                  </label>
                  <input
                    type="number"
                    value={eyepiece.apparentFOV}
                    onChange={(e) => handleEyepieceChange(eyepiece.id, 'apparentFOV', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="120"
                    step="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Barlow Factor
                  </label>
                  <select
                    value={eyepiece.barlowFactor}
                    onChange={(e) => handleEyepieceChange(eyepiece.id, 'barlowFactor', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">None (1x)</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                    <option value="2.5">2.5x</option>
                    <option value="3">3x</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
      >
        Calculate Performance
      </button>
    </form>
  );
}
