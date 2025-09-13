'use client';

import React from 'react';
import { ViewerWithControls } from '@/types/moonviewer';

interface MoonControlsProps {
  viewerRef: React.RefObject<ViewerWithControls | null>;
  onLocationClick?: () => void;
}

export default function MoonControls({ viewerRef, onLocationClick }: MoonControlsProps) {
  const handleLocationClick = (location: string) => {
    const flyToFunctions = viewerRef.current?.flyToLocations;
    if (!flyToFunctions) return;

    switch (location) {
      case 'seaOfTranquility':
        flyToFunctions.seaOfTranquility();
        break;
      case 'apollo11':
        flyToFunctions.apollo11();
        break;
      case 'copernicus':
        flyToFunctions.copernicus();
        break;
      case 'tycho':
        flyToFunctions.tycho();
        break;
      case 'shackleton':
        flyToFunctions.shackleton();
        break;
    }
    
    // Close hamburger menu after clicking (mobile only)
    onLocationClick?.();
  };

  const handleBoundariesToggle = (checked: boolean) => {
    viewerRef.current?.flyToLocations?.toggleBoundaries(checked);
  };

  return (
    <div id="toolbar" className="moon-controls">
      <div className="header">Moon Viewer</div>
      <button onClick={() => handleLocationClick('seaOfTranquility')}>
        Sea of Tranquility
      </button>
      <button onClick={() => handleLocationClick('apollo11')}>
        Apollo 11
      </button>
      <button onClick={() => handleLocationClick('copernicus')}>
        Copernicus
      </button>
      <button onClick={() => handleLocationClick('tycho')}>
        Tycho
      </button>
      <button onClick={() => handleLocationClick('shackleton')}>
        Shackleton
      </button>
      <label>
        <input 
          type="checkbox" 
          onChange={(e) => handleBoundariesToggle(e.target.checked)}
        />
        Show Mare Boundaries
      </label>

      <style jsx>{`
        .moon-controls {
          background: rgba(42, 42, 42, 0.8);
          padding: 4px;
          border-radius: 4px;
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1000;
          width: auto;
          max-width: 300px;
        }

        .moon-controls input {
          vertical-align: middle;
          padding-top: 2px;
          padding-bottom: 2px;
        }

        .moon-controls .header {
          font-weight: bold;
          color: white;
          margin: 2px;
          display: block;
        }

        .moon-controls button {
          margin: 2px;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          color: white;
          cursor: pointer;
          display: block;
          width: 100%;
        }

        .moon-controls button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .moon-controls label {
          color: white;
          margin: 2px;
          display: block;
          cursor: pointer;
        }

        /* Mobile - when inside hamburger menu */
        @media (max-width: 767px) {
          .moon-controls {
            position: static;
            background: transparent;
            padding: 8px 0;
            width: 100%;
            max-width: none;
          }

          .moon-controls .header {
            font-size: 18px;
            margin: 4px 2px 12px 2px;
            text-align: center;
          }

          .moon-controls button {
            margin: 4px 0;
            padding: 12px 16px;
            font-size: 15px;
            border-radius: 6px;
            min-height: 48px;
          }

          .moon-controls label {
            margin: 12px 0 4px 0;
            font-size: 15px;
            padding: 8px 4px;
          }

          .moon-controls input {
            width: 18px;
            height: 18px;
            margin-right: 10px;
          }
        }
      `}</style>
    </div>
  );
}