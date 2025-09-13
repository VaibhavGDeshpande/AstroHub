'use client';

import React, { useEffect, useRef } from 'react';
import MoonControls from './MoonControl';
import LoadingOverlay from './LoadingOverlay';
import { useMoonViewer } from './useMoonViewer';
import { ViewerWithControls } from '@/types/moonviewer';

// Set Cesium base path
if (typeof window !== 'undefined') {
  (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = '/cesium/';
}

export default function MoonViewer() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerWithControls | null>(null);
  const { isLoading, initializeMoonViewer } = useMoonViewer();

  useEffect(() => {
    if (!cesiumContainerRef.current) return;

    const cleanup = initializeMoonViewer(cesiumContainerRef.current, viewerRef);

    return cleanup;
  }, [initializeMoonViewer]);

  return (
    <div className="w-full h-screen relative">
      <div 
        ref={cesiumContainerRef} 
        id="cesiumContainer"
        className="w-full h-full"
        style={{ width: '100%', height: '100vh' }}
      />
      
      {isLoading && <LoadingOverlay />}
      
      <MoonControls viewerRef={viewerRef} />
      
    </div>
  );
}
