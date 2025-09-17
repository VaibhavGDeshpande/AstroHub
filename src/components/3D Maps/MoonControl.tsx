'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ViewerWithControls } from '@/types/moonviewer';

interface MoonControlsProps {
  viewerRef: React.RefObject<ViewerWithControls | null>;
  onLocationClick?: () => void;
}

export default function MoonControls({ viewerRef, onLocationClick }: MoonControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      // case 'shackleton':
      //   flyToFunctions.shackleton();
        break;
    }
    
    setIsOpen(false); // Close dropdown after selection
    onLocationClick?.();
  };

  const handleBoundariesToggle = (checked: boolean) => {
    viewerRef.current?.flyToLocations?.toggleBoundaries(checked);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const locations = [
    { id: 'seaOfTranquility', name: 'Sea of Tranquility' },
    { id: 'apollo11', name: 'Apollo 11'},
    { id: 'copernicus', name: 'Copernicus' },
    { id: 'tycho', name: 'Tycho' },
    // { id: 'shackleton', name: 'Shackleton', icon: '🏔️' }
  ];

  return (
    <div ref={dropdownRef} className="moon-controls-dropdown">
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="trigger-text">Moon Locations</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'rotate' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16"
          fill="none"
        >
          <path 
            d="M4 6L8 10L12 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>

        {/* Location Items */}
        <div className="dropdown-section">
          {/* <div className="section-label">Locations</div> */}
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationClick(location.id)}
              className="dropdown-item location-item"
            >
              <span className="item-text">{location.name}</span>
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="dropdown-separator"></div>

        {/* Settings Section */}
        <div className="dropdown-section">
          {/* <div className="section-label">Settings</div> */}
          <label className="dropdown-item checkbox-item">
            <input 
              type="checkbox" 
              onChange={(e) => handleBoundariesToggle(e.target.checked)}
            />
            <span className="checkbox-text">Show Mare Boundaries</span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .moon-controls-dropdown {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1000;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(42, 42, 42, 0.95);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .dropdown-trigger:hover {
          background: rgba(52, 52, 52, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .dropdown-trigger:active {
          transform: translateY(0);
        }

        .trigger-text {
          flex: 1;
          text-align: left;
        }

        .dropdown-arrow {
          transition: transform 0.3s ease;
          opacity: 0.7;
        }

        .dropdown-arrow.rotate {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 180px;
          max-width: 80vw;
          margin-top: 4px;
          background: rgba(42, 42, 42, 0.98);
          backdrop-filter: blur(15px);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          max-height: 400px;
          overflow-y: auto;
        }

        .dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .dropdown-header {
          padding: 16px 16px 8px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dropdown-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: white;
          text-align: center;
        }

        .dropdown-section {
          padding: 8px 0;
        }

        .section-label {
          padding: 8px 16px 4px 16px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dropdown-item:active {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(0.98);
        }

        .location-item {
          gap: 12px;
        }

        // .item-icon {
        //   font-size: 16px;
        //   width: 20px;
        //   text-align: center;
        // }

        .item-text {
          flex: 1;
        }

        .checkbox-item {
          gap: 12px;
          cursor: pointer;
        }

        .checkbox-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #3b82f6;
          cursor: pointer;
        }

        .checkbox-text {
          flex: 1;
        }

        .dropdown-separator {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 4px 16px;
        }

        /* Mobile Styles */
        @media (max-width: 7px) {
          .moon-controls-dropdown {
            position: absolute;
            top: 10px;
            left: 10px;
            right: auto;
            width: 10px;
          }

          .dropdown-trigger {
            min-width: 42vw;
            justify-content: center;
            padding: 12px 14px;
            font-size: 16px;
          }

          .dropdown-menu {
            width: 42vw;
            max-width: 72vw;
            max-height: 100px;
          }

          .dropdown-item {
            padding: 12px 5px;
            font-size: 16px;
            min-height: 52px;
          }

          .section-label {
            padding: 12px 16px 6px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
