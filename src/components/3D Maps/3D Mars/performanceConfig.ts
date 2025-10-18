import { PerformanceConfig } from './types';

// Device detection utility - optimized to run once
let isMobile: boolean | null = null;

export const isMobileDevice = (): boolean => {
  if (isMobile !== null) return isMobile;
  
  if (typeof window === 'undefined') {
    isMobile = false;
    return false;
  }
  
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  return isMobile;
};

// Performance configuration based on device - memoized
let performanceConfig: PerformanceConfig | null = null;


export const getPerformanceConfig = (): PerformanceConfig => {
  if (performanceConfig) return performanceConfig;

  const isMobile = isMobileDevice();

  performanceConfig = {
    viewer: {
      resolutionScale: isMobile ? 0.8 : 1.0,
      targetFrameRate: isMobile ? 30 : 40,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
    },
    tileset: {
      maximumScreenSpaceError: isMobile ? 48 : 32, // Increased for mobile to reduce tiles
      maximumMemoryUsage: isMobile ? 256 : 512, // Reduced for mobile
      foveatedConeSize: isMobile ? 0.7 : 0.3, // Increased for mobile to reduce high detail area
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: isMobile ? 30.0 : 30.0,
      skipLevelOfDetail: isMobile,
      baseScreenSpaceError: isMobile ? 1024 : 1024, // Reduced for mobile
      skipScreenSpaceErrorFactor: isMobile ? 48 : 16, // Increased for mobile
      skipLevels: isMobile ? 2 : 1,
      immediatelyLoadDesiredLevelOfDetail: !isMobile,
      loadSiblings: !isMobile,
      preloadWhenHidden: !isMobile,
      preloadFlightDestinations: !isMobile,
      preferLeaves: true,
      progressiveResolutionHeightFraction: isMobile ? 0.2 : 0.5, // Reduced for mobile
      foveatedScreenSpaceError: true,
      foveatedMinimumScreenSpaceErrorRelaxation: 0.0,
    },
    model: {
      minimumPixelSize: isMobile ? 32 : 64, // Reduced for mobile
      maximumScale: isMobile ? 10000 : 20000, // Reduced for mobile
    },
    postProcessing: {
      bloom: !isMobile,
      hdr: !isMobile,
      exposure: isMobile ? 1.3 : 1.5,
      bloomBrightness: isMobile ? 0 : -0.5,
    },
    atmosphere: {
      perFragmentAtmosphere: !isMobile,
    },
    preloading: {
      enableAssetCaching: !isMobile,
      enableModelPreloading: !isMobile,
    }
  };

  return performanceConfig;
};