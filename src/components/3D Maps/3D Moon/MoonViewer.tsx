'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import MoonControls from './MoonControl';
import LoadingOverlay from './LoadingOverlay';
import { useMoonViewer } from './useMoonViewer';
import { ViewerWithControls, MoonLocationId } from '@/types/moonviewer';
import { moonLocationOptionsMap } from '@/app/3d-moon/config/moonConfig';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface MoonViewerProps {
  containerStyle?: React.CSSProperties;
}

export default function MoonViewer({ containerStyle }: MoonViewerProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerWithControls | null>(null);
  const { isLoading, initializeMoonViewer } = useMoonViewer();
  const [isClient, setIsClient] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<MoonLocationId | null>(null);
  const activeLocation = useMemo(
    () => (activeLocationId ? moonLocationOptionsMap[activeLocationId] : null),
    [activeLocationId],
  );

  useEffect(() => {
    if (!activeLocationId) return;
    const timeout = window.setTimeout(() => {
      setActiveLocationId(null);
    }, 15000);
    return () => window.clearTimeout(timeout);
  }, [activeLocationId]);

  useEffect(() => {
    setIsClient(true);
    (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = '/cesium/';
  }, []);

  useEffect(() => {
    if (!isClient || !cesiumContainerRef.current) return;

    const cleanup = initializeMoonViewer(cesiumContainerRef.current, viewerRef);

    return cleanup;
  }, [isClient, initializeMoonViewer]);


  if (!isClient) {
    return (
      <div className="w-full h-screen relative flex items-center justify-center">
        <div className="text-white">Loading 3D Moon Viewer...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={cesiumContainerRef} 
        id="cesiumContainer"
        className="w-full h-full"
        style={{ width: '100%', height: '85vh', ...(containerStyle || {}) }}
      />
      
      {isLoading && <LoadingOverlay />}
      
      <MoonControls
        viewerRef={viewerRef}
        onLocationReach={(locationId) => setActiveLocationId(locationId)}
      />

      {activeLocation && (
        <div className="moon-info-card mt-5">
          <div className="moon-info-header">
            <div className="moon-info-heading">
              <p className="moon-info-category">
                {activeLocation.category ?? 'Lunar Feature'}
              </p>
              <h3 className="moon-info-title">{activeLocation.name}</h3>
            </div>
            <button
              className="moon-info-close"
              onClick={() => setActiveLocationId(null)}
              aria-label="Close location info"
            >
              ×
            </button>
          </div>
          <div className="moon-info-body">
            <p className="moon-info-snippet">
              {activeLocation.infoSnippet || activeLocation.description || 'Explore this lunar site.'}
            </p>
            {activeLocation.infoDetails && (
              <p className="moon-info-details">{activeLocation.infoDetails}</p>
            )}
            {activeLocation.wikiUrl && (
              <a
                href={activeLocation.wikiUrl}
                target="_blank"
                rel="noreferrer"
                className="moon-info-link"
              >
                Learn more on Wikipedia ↗
              </a>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .moon-info-card {
          position: absolute;
          top: 20px;
          right: 20px;
          width: min(380px, 92vw);
          background: rgba(60, 60, 60, 0.95);
          border-radius: 10px;
          color: #f3f4f6;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.15);
          animation: fadeInUp 0.35s ease;
          overflow: hidden;
          z-index: 1100;
        }

        .moon-info-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: linear-gradient(180deg, rgba(32, 32, 32, 0.95), rgba(48, 48, 48, 0.95));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .moon-info-icon {
          font-size: 1rem;
        }

        .moon-info-heading {
          flex: 1;
        }

        .moon-info-category {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 10px;
          color: rgba(210, 214, 220, 0.75);
          margin: 0;
        }

        .moon-info-title {
          font-size: 1.1rem;
          margin: 2px 0 0;
          font-weight: 600;
        }

        .moon-info-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
        }

        .moon-info-close:hover {
          color: #fff;
        }

        .moon-info-body {
          padding: 14px 16px 16px;
          background: rgba(10, 10, 10, 0.45);
        }

        .moon-info-snippet {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 8px;
        }

        .moon-info-details {
          font-size: 0.9rem;
          line-height: 1.45;
          color: rgba(229, 231, 235, 0.95);
          margin-bottom: 10px;
        }

        .moon-info-link {
          font-size: 0.87rem;
          color: #bfdbfe;
          text-decoration: none;
          font-weight: 600;
        }

        .moon-info-link:hover {
          color: #e0f2fe;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .moon-info-card {
            top: auto;
            bottom: 20px;
            left: 12px;
            right: 12px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}
