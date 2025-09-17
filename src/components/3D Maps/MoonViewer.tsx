'use client';

import React, { useEffect, useRef, useState } from 'react';
import MoonControls from './MoonControl';
import LoadingOverlay from './LoadingOverlay';
import { useMoonViewer } from './useMoonViewer';
import { ViewerWithControls } from '@/types/moonviewer';
// Import Cesium CSS for InfoBox styling
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface MoonViewerProps {
  containerStyle?: React.CSSProperties;
}

export default function MoonViewer({ containerStyle }: MoonViewerProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerWithControls | null>(null);
  const { isLoading, initializeMoonViewer } = useMoonViewer();
  const [isClient, setIsClient] = useState(false);

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
      
      <MoonControls viewerRef={viewerRef} />
    </div>
  );
}
