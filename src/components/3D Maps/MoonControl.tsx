'use client';

import React from 'react';
import { ViewerWithControls } from '@/types/moonviewer';

interface MoonControlsProps {
  viewerRef: React.RefObject<ViewerWithControls | null>;
}

export default function MoonControls({ viewerRef }: MoonControlsProps) {
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
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1000;
          background: rgba(42, 42, 42, 0.8);
          padding: 4px;
          border-radius: 4px;
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
      `}</style>
    </div>
  );
}
