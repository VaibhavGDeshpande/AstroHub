'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ViewerWithControls,
  MoonLocationId,
  LocationCategory,
} from '@/types/moonviewer';
import { moonLocationOptions } from '@/app/3d-moon/config/moonConfig';

const LOCATION_CATEGORY_ORDER: LocationCategory[] = [
  'Apollo Missions',
  'Maria & Basins',
  'Craters & Highlands',
  'Polar Regions',
  'Other Features',
];

interface MoonControlsProps {
  viewerRef: React.RefObject<ViewerWithControls | null>;
  onLocationClick?: () => void;
  onLocationReach?: (locationId: MoonLocationId) => void;
}

export default function MoonControls({
  viewerRef,
  onLocationClick,
  onLocationReach,
}: MoonControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocationClick = (location: MoonLocationId) => {
    const flyTo = viewerRef.current?.flyToLocations?.[location];
    if (!flyTo) return;
    flyTo({
      onComplete: () => {
        onLocationReach?.(location);
      },
    });
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

  const locations = moonLocationOptions;
  const groupedLocations = useMemo(() => {
    type LocationOption = (typeof moonLocationOptions)[number];
    const grouped = locations.reduce(
      (acc, location) => {
        const category = (location.category ?? 'Other Features') as LocationCategory;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category]!.push(location);
        return acc;
      },
      {} as Partial<Record<LocationCategory, LocationOption[]>>,
    );

    const ordered: { category: LocationCategory; items: LocationOption[] }[] = [];
    LOCATION_CATEGORY_ORDER.forEach((category) => {
      const items = grouped[category];
      if (items?.length) {
        ordered.push({ category, items });
        delete grouped[category];
      }
    });

    Object.entries(grouped).forEach(([category, items]) => {
      if (!items || !items.length) return;
      ordered.push({ category: category as LocationCategory, items });
    });

    return ordered;
  }, [locations]);

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
        {groupedLocations.map((section) => (
          <div className="dropdown-section" key={section.category}>
            <div className="section-title">{section.category}</div>
            <div className="location-grid">
              {section.items.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location.id)}
                  className="dropdown-item location-item"
                >
                  <span className="item-text">
                    <span className="item-title">{location.name}</span>
                    {location.description ? (
                      <span className="item-description">{location.description}</span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
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
      width: min(420px, 90vw);
      background: rgba(42, 42, 42, 0.98);
      backdrop-filter: blur(15px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      max-height: 520px;
      overflow-y: auto;
      padding: 12px 14px 14px;
    }

    .dropdown-menu.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .dropdown-section {
      padding: 8px 0;
    }

    .dropdown-section + .dropdown-section {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 10px;
      padding-top: 12px;
    }

    .section-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 6px;
    }

    .location-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 6px;
    }

    .dropdown-item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: none;
      color: white;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      font-size: 14px;
      border-radius: 10px;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .dropdown-item:active {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(0.98);
    }

    .location-item {
      gap: 8px;
    }

    .item-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-title {
      font-weight: 600;
    }

    .item-description {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 2px;
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
