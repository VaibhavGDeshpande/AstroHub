'use client';

import React, { useEffect, useRef, useState } from 'react';
import MoonControls from './MoonControl';
import LoadingOverlay from './LoadingOverlay';
import { useMoonViewer } from './useMoonViewer';
import { ViewerWithControls } from '@/types/moonviewer';

// Cesium base path will be set in useEffect to avoid hydration mismatch

export default function MoonViewer() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerWithControls | null>(null);
  const { isLoading, initializeMoonViewer } = useMoonViewer();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set Cesium base path on client side only
    (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = '/cesium/';
  }, []);

  useEffect(() => {
    if (!isClient || !cesiumContainerRef.current) return;

    const cleanup = initializeMoonViewer(cesiumContainerRef.current, viewerRef);

    return cleanup;
  }, [isClient, initializeMoonViewer]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isClient) {
    return (
      <div className="w-full h-screen relative flex items-center justify-center">
        <div className="text-white">Loading 3D Moon Viewer...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <div 
        ref={cesiumContainerRef} 
        id="cesiumContainer"
        className="w-full h-full"
        style={{ width: '100%', height: '100vh' }}
      />
      
      {isLoading && <LoadingOverlay />}
      
      {/* Desktop: Original MoonControls (always visible) */}
      <div className="hidden md:block">
        <MoonControls viewerRef={viewerRef} />
      </div>

      {/* Mobile: Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed top-4 left-4 z-50 md:hidden
          w-12 h-12 
          bg-gray-800/90 hover:bg-gray-700/95 active:bg-gray-600
          border border-gray-600/50 rounded-lg cursor-pointer
          flex flex-col justify-center items-center gap-1
          backdrop-blur-sm shadow-lg
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-400/50
        "
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className={`
          w-5 h-0.5 bg-white rounded-full
          transition-all duration-300 ease-in-out
          ${isOpen ? 'rotate-45 translate-y-1.5' : ''}
        `}></span>
        <span className={`
          w-5 h-0.5 bg-white rounded-full
          transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-0' : 'opacity-100'}
        `}></span>
        <span className={`
          w-5 h-0.5 bg-white rounded-full
          transition-all duration-300 ease-in-out
          ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}
        `}></span>
      </button>

      {/* Mobile: Backdrop Overlay */}
      {isOpen && (
        <div 
          className="
            fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden
            transition-opacity duration-300 ease-in-out
          " 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile: Hamburger Menu Panel */}
      <div className={`
        fixed top-0 left-0 h-screen w-80 max-w-[85vw] md:hidden
        bg-gray-900/95 backdrop-blur-lg border-r border-gray-700/50
        transform transition-transform duration-300 ease-in-out
        z-40 pt-20 px-4 pb-4 overflow-y-auto
        shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <MoonControls viewerRef={viewerRef} onLocationClick={() => setIsOpen(false)} />
      </div>
    </div>
  );
}