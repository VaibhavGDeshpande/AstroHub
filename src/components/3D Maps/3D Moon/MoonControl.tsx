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
    }

    setIsOpen(false);
    onLocationClick?.();
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
    { id: 'apollo11', name: 'Apollo 11' },
    { id: 'copernicus', name: 'Copernicus' },
    { id: 'tycho', name: 'Tycho' },
  ];

  return (
    <div ref={dropdownRef} className="moon-controls-dropdown">
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

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-section">
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
      padding: 10px 14px;
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
      min-width: 160px;
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
      top: calc(100% + 4px);
      left: 0;
      width: 220px;
      max-width: 80vw;
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

    .dropdown-section {
      padding: 8px 0;
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

    .item-text {
      flex: 1;
    }

    .checkbox-item {
      gap: 12px;
      cursor: pointer;
    }

    .checkbox-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #60a5fa;
      cursor: pointer;
      flex-shrink: 0;
    }

    .checkbox-text {
      flex: 1;
    }

    .dropdown-separator {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 4px 16px;
    }

    @media (max-width: 768px) {
      .moon-controls-dropdown {
        top: 10px;
        left: 10px;
        /* Removed right: 10px to allow dropdown to size naturally */
      }

      .dropdown-trigger {
        width: auto;
        min-width: 140px;
        max-width: 200px;
        padding: 12px 14px;
        font-size: 15px;
      }

      .dropdown-menu {
        width: auto;
        min-width: 180px;
        max-width: 250px;
        max-height: 60vh;
      }

      .dropdown-item {
        padding: 14px 16px;
        font-size: 15px;
        min-height: 48px;
      }

      .checkbox-item input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }
    }
  `}</style>
    </div>

  );
}
