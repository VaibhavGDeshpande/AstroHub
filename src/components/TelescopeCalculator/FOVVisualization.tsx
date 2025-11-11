
'use client';

import { useEffect, useRef, useState } from 'react';
import { CalculatedResults, EyepieceSpecs, SkyObject } from './types';
import { 
  popularObjects, 
  getColorForIndex, 
  loadSkyImageWithFallback,
  imageSources,
  ImageSource 
} from './utils';

interface FOVVisualizationProps {
  results: Array<{ eyepiece: EyepieceSpecs; results: CalculatedResults }>;
  size?: number; // canvas size in pixels (width = height)
}

export default function FOVVisualization({ results, size = 600 }: FOVVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedObject, setSelectedObject] = useState<SkyObject>(popularObjects[0]);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource>('skyview');
  const [actualImageSource, setActualImageSource] = useState<ImageSource | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [imageScale, setImageScale] = useState(12); 
  const imageSize = size;

  // Load sky background image with automatic fallback
  useEffect(() => {
    if (!selectedObject) return;

    let cancelled = false;

    const loadImage = async () => {
      setLoading(true);
      setLoadError(null);
      setBackgroundImage(null);
      
      try {
        // Calculate size in degrees based on scale
        const totalFOVArcsec = imageSize * imageScale;
        const sizeDegrees = totalFOVArcsec / 3600;
        
        console.log(`Loading image for ${selectedObject.name} at ${sizeDegrees.toFixed(2)}° FOV`);
        
        const result = await loadSkyImageWithFallback(
          selectedObject.ra,
          selectedObject.dec,
          sizeDegrees,
          imageSource
        );
        
        if (cancelled) return;
        
        if (result) {
          setBackgroundImage(result.img);
          setActualImageSource(result.source);
          setLoadError(null);
        } else {
          setBackgroundImage(null);
          setActualImageSource(null);
          setLoadError('All image sources failed to load');
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading sky image:', error);
          setBackgroundImage(null);
          setActualImageSource(null);
          setLoadError(error instanceof Error ? error.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [selectedObject, imageScale, imageSource, imageSize]);

  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Draw background image
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, width, height);
      ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
      ctx.fillRect(0, 0, width, height);
    } else {
      // Simple star field fallback
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const totalFOVArcsec = imageSize * imageScale;
    const totalFOVDegrees = totalFOVArcsec / 3600;
    const pixelsPerDegree = imageSize / totalFOVDegrees;

    console.log('FOV Debug:', {
      imageScale,
      totalFOVArcsec,
      totalFOVDegrees: totalFOVDegrees.toFixed(3),
      pixelsPerDegree: pixelsPerDegree.toFixed(1),
    });

    // Draw FOV overlays for each eyepiece
    results.forEach(({ eyepiece, results: res }, index) => {
      const fovDegrees = res.trueFOV;
      const fovPixels = fovDegrees * pixelsPerDegree;
      
      console.log(`${eyepiece.name}: ${fovDegrees}° = ${fovPixels.toFixed(0)} px`);
      
      const x = (width - fovPixels) / 2;
      const y = (height - fovPixels) / 2;
      const color = getColorForIndex(index);
      
      // Draw FOV rectangle
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, fovPixels, fovPixels);

      // Draw corner brackets
      const bracketLen = 20;
      ctx.lineWidth = 2;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(x, y + bracketLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + bracketLen, y);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(x + fovPixels - bracketLen, y);
      ctx.lineTo(x + fovPixels, y);
      ctx.lineTo(x + fovPixels, y + bracketLen);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x, y + fovPixels - bracketLen);
      ctx.lineTo(x, y + fovPixels);
      ctx.lineTo(x + bracketLen, y + fovPixels);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x + fovPixels - bracketLen, y + fovPixels);
      ctx.lineTo(x + fovPixels, y + fovPixels);
      ctx.lineTo(x + fovPixels, y + fovPixels - bracketLen);
      ctx.stroke();

      // Draw label with background
      ctx.setLineDash([]);
      const labelText = `${eyepiece.name}: ${res.magnification}x (${res.trueFOV.toFixed(2)}°)`;
      ctx.font = 'bold 13px sans-serif';
      const textMetrics = ctx.measureText(labelText);
      
      const labelX = x + 10;
      const labelY = y + 10;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(labelX - 5, labelY - 15, textMetrics.width + 10, 22);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(labelX - 5, labelY - 15, textMetrics.width + 10, 22);
      ctx.fillStyle = color;
      ctx.fillText(labelText, labelX, labelY + 2);
    });

    // Draw center crosshair
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    const crossSize = 20;
    ctx.beginPath();
    ctx.moveTo(width / 2 - crossSize, height / 2);
    ctx.lineTo(width / 2 + crossSize, height / 2);
    ctx.moveTo(width / 2, height / 2 - crossSize);
    ctx.lineTo(width / 2, height / 2 + crossSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Draw scale reference (1 degree)
    const oneDegreePx = pixelsPerDegree;
    const scaleX = 20;
    const scaleY = height - 40;
    
    if (oneDegreePx > 10) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scaleX, scaleY);
      ctx.lineTo(scaleX + oneDegreePx, scaleY);
      ctx.moveTo(scaleX, scaleY - 8);
      ctx.lineTo(scaleX, scaleY + 8);
      ctx.moveTo(scaleX + oneDegreePx, scaleY - 8);
      ctx.lineTo(scaleX + oneDegreePx, scaleY + 8);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('1°', scaleX + oneDegreePx / 2 - 10, scaleY - 12);
    }

    // Info box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(width - 160, 10, 150, 90);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 160, 10, 150, 90);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Image Properties', width - 150, 28);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`FOV: ${totalFOVDegrees.toFixed(2)}°`, width - 150, 46);
    ctx.fillText(`(${(totalFOVDegrees * 60).toFixed(1)}' arc)`, width - 150, 60);
    ctx.fillText(`Scale: ${imageScale}"/px`, width - 150, 74);
    
    // Show source info
    if (actualImageSource) {
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`Source: ${imageSources[actualImageSource].name}`, width - 150, 90);
    }

  }, [results, backgroundImage, imageScale, imageSize, actualImageSource]);

  if (results.length === 0) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Field of View Visualization</h3>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Object Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Target Object
          </label>
          <select
            value={selectedObject.name}
            onChange={(e) => {
              const obj = popularObjects.find((o) => o.name === e.target.value);
              if (obj) setSelectedObject(obj);
            }}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            {popularObjects.map((obj) => (
              <option key={obj.name} value={obj.name}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Source Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Preferred Image Source
          </label>
          <select
            value={imageSource}
            onChange={(e) => setImageSource(e.target.value as ImageSource)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(imageSources).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Auto-fallback enabled
          </p>
        </div>

        {/* Image Scale Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Zoom Level: {imageScale} arcsec/px ({((imageSize * imageScale) / 3600).toFixed(2)}° total)
          </label>
          <input
            type="range"
            min="3"
            max="25"
            step="1"
            value={imageScale}
            onChange={(e) => setImageScale(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Zoomed In (0.5°)</span>
            <span>Wide Field (4°)</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-black rounded-lg overflow-hidden border-2 border-gray-700">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <div className="text-white flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p>Loading real sky image...</p>
              <p className="text-sm text-gray-400">Trying multiple sources with auto-fallback</p>
            </div>
          </div>
        )}
        
        {!loading && !backgroundImage && (
          <div className="absolute top-4 left-4 bg-yellow-900/80 border border-yellow-600 text-yellow-200 px-4 py-2 rounded-lg text-sm z-10 max-w-md">
            ⚠️ {loadError || 'Sky image unavailable for this region'} - showing simulated star field
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="w-full h-auto"
        />
      </div>

      {/* Legend & Info */}
      <div className="mt-4 space-y-3">
        {/* FOV Legend */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Field of View Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {results.map(({ eyepiece, results: res }, index) => (
              <div key={eyepiece.id} className="flex items-center gap-2 text-sm bg-gray-800 p-2 rounded">
                <div
                  className="w-4 h-4 border-2 flex-shrink-0"
                  style={{ borderColor: getColorForIndex(index) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{eyepiece.name}</div>
                  <div className="text-gray-400 text-xs">
                    {res.trueFOV.toFixed(2)}° ({res.magnification}x)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Object & Source Info */}
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 text-sm space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-gray-400">Target:</span>
              <span className="text-white font-medium ml-2">{selectedObject.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="text-white font-medium ml-2 capitalize">{selectedObject.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Object Size:</span>
              <span className="text-white font-medium ml-2">
                {selectedObject.size}&apos; = {(selectedObject.size / 60).toFixed(2)}°
              </span>
            </div>
            <div>
              <span className="text-gray-400">Coordinates:</span>
              <span className="text-white font-medium ml-2">
                RA {selectedObject.ra.toFixed(1)}° / Dec {selectedObject.dec.toFixed(1)}°
              </span>
            </div>
          </div>
          
          {actualImageSource && (
            <div className="pt-2 border-t border-gray-700">
              <span className="text-gray-400">Image Source:</span>
              <span className="text-green-400 font-medium ml-2">
                {imageSources[actualImageSource].name}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {imageSources[actualImageSource].description} - {imageSources[actualImageSource].coverage}
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-500 pt-3 border-t border-gray-700">   
            💡 <strong>How to use:</strong> Each colored rectangle shows what you&apos;ll see through your telescope with that eyepiece.
            The yellow crosshair marks the center of your view. If one image source fails, the system automatically tries alternatives.
          </p>
        </div>
      </div>
    </div>
  );
}
