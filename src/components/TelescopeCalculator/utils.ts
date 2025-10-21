// components/telescope-calculator/utils.ts - COMPLETE UPDATED VERSION

import { TelescopeSpecs, EyepieceSpecs, CalculatedResults } from './types';


export const calculateTelescopePerformance = (
  telescope: TelescopeSpecs,
  eyepiece: EyepieceSpecs
): CalculatedResults => {
  const barlowFactor = eyepiece.barlowFactor || 1;
  const effectiveFocalLength = telescope.focalLength * barlowFactor;
  const focalRatio = telescope.focalLength / telescope.aperture;

  // Magnification = Telescope Focal Length / Eyepiece Focal Length
  const magnification = effectiveFocalLength / eyepiece.focalLength;

  // True FOV = Apparent FOV / Magnification
  const trueFOV = eyepiece.apparentFOV / magnification;

  // Exit Pupil = Aperture / Magnification
  const exitPupil = telescope.aperture / magnification;

  // Resolving Power (Rayleigh Criterion) = 138 / Aperture(mm)
  const resolvingPower = 138 / telescope.aperture;

  // Limiting Magnitude = 2 + 5 * log10(Aperture in mm)
  const limitingMagnitude = 2 + 5 * Math.log10(telescope.aperture);

  // Maximum Useful Magnification = 2 * Aperture(mm)
  const maxUsefulMagnification = 2 * telescope.aperture;

  return {
    magnification: Math.round(magnification * 10) / 10,
    trueFOV: Math.round(trueFOV * 100) / 100,
    exitPupil: Math.round(exitPupil * 10) / 10,
    resolvingPower: Math.round(resolvingPower * 100) / 100,
    limitingMagnitude: Math.round(limitingMagnitude * 10) / 10,
    maxUsefulMagnification: Math.round(maxUsefulMagnification),
    focalRatio: Math.round(focalRatio * 10) / 10,
    effectiveFocalLength: Math.round(effectiveFocalLength),
  };
};

// ============ IMAGE SOURCES ============

export type ImageSource = 'skyview' | 'eso-dss' | 'sdss' | 'stsci-dss' | 'legacy-survey' ;

export interface ImageSourceConfig {
  name: string;
  buildUrl: (ra: number, dec: number, sizeDegrees: number) => string;
  description: string;
  coverage: string;
}

export const imageSources: Record<ImageSource, ImageSourceConfig> = {
  // NASA SkyView - Best coverage, multiple surveys
  'skyview': {
    name: 'NASA SkyView',
    buildUrl: (ra, dec, sizeDegrees) => {
      return `https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl?Position=${ra},${dec}&Survey=DSS&Pixels=600&Return=JPEG&Size=${sizeDegrees}`;
    },
    description: 'NASA SkyView Virtual Observatory',
    coverage: 'All-sky coverage with multiple surveys',
  },
  
  // ESO DSS - European Southern Observatory (good CORS support)
  'eso-dss': {
    name: 'ESO DSS',
    buildUrl: (ra, dec, sizeDegrees) => {
      const sizeArcmin = sizeDegrees * 60;
      // ESO DSS expects RA in hours (RA degrees / 15)
      const raHours = ra / 15;
      return `https://archive.eso.org/dss/dss/image?ra=${raHours}&dec=${dec}&x=${sizeArcmin}&y=${sizeArcmin}&Sky-Survey=DSS2-red&mime-type=image/jpeg`;
    },
    description: 'European Southern Observatory DSS',
    coverage: 'Full sky, excellent southern hemisphere',
  },
  
  // STScI DSS - Space Telescope Science Institute
  'stsci-dss': {
    name: 'STScI DSS',
    buildUrl: (ra, dec, sizeDegrees) => {
      const sizeArcmin = sizeDegrees * 60;
      return `https://archive.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r=${ra}&d=${dec}&e=J2000&h=${sizeArcmin}&w=${sizeArcmin}&f=gif&c=none&fov=NONE&v3=`;
    },
    description: 'Space Telescope Science Institute DSS',
    coverage: 'Full sky coverage',
  },
  
  // SDSS - Sloan Digital Sky Survey
  'sdss': {
    name: 'SDSS',
    buildUrl: (ra, dec, sizeDegrees) => {
      // Calculate optimal scale: total FOV in arcsec / image size in pixels
      const scale = (sizeDegrees * 3600) / 600; // arcsec per pixel
      return `https://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?ra=${ra}&dec=${dec}&scale=${scale}&width=600&height=600`;
    },
    description: 'Sloan Digital Sky Survey',
    coverage: 'Limited to SDSS footprint (~35% of sky)',
  },
  
  // Legacy Survey (DECaLS, BASS, MzLS)
  'legacy-survey': {
    name: 'Legacy Survey',
    buildUrl: (ra, dec, sizeDegrees) => {
      const pixscale = (sizeDegrees * 3600) / 600; // arcsec/pixel
      return `https://www.legacysurvey.org/viewer/jpeg-cutout?ra=${ra}&dec=${dec}&pixscale=${pixscale}&layer=ls-dr10&size=600`;
    },
    description: 'DESI Legacy Imaging Surveys',
    coverage: 'Northern and southern sky coverage',
  },
};

// Helper to load image with automatic fallback to other sources
export async function loadSkyImageWithFallback(
  ra: number,
  dec: number,
  sizeDegrees: number,
  preferredSource: ImageSource = 'skyview'
): Promise<{ img: HTMLImageElement; source: ImageSource } | null> {
  // Try preferred source first, then fallbacks in order of reliability
  const sourcesToTry: ImageSource[] = [
    preferredSource,
    'skyview',
    'eso-dss',
    'legacy-survey',
    'sdss',
    'stsci-dss',
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  for (const source of sourcesToTry) {
    try {
      const config = imageSources[source];
      const url = config.buildUrl(ra, dec, sizeDegrees);
      
      console.log(`Attempting to load from ${config.name}...`);
      
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        
        // 10 second timeout per source
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 10000);
        
        image.onload = () => {
          clearTimeout(timeout);
          resolve(image);
        };
        
        image.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load'));
        };
        
        image.src = url;
      });
      
      console.log(`✓ Successfully loaded from ${config.name}`);
      return { img, source };
      
    } catch (error) {
      console.warn(`✗ Failed to load from ${imageSources[source].name}:`, error);
      continue; // Try next source
    }
  }
  
  console.error('All image sources failed to load');
  return null;
}

// Legacy functions (kept for backwards compatibility)
export const getDSSImageUrl = (
  ra: number,
  dec: number,
  sizeArcmin: number = 30
): string => {
  const sizeDegrees = sizeArcmin / 60;
  return imageSources['eso-dss'].buildUrl(ra, dec, sizeDegrees);
};

export const getSDSSImageUrl = (
  ra: number,
  dec: number,
  scale: number = 0.4,
  width: number = 512,
  height: number = 512
): string => {
  return `https://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?ra=${ra}&dec=${dec}&scale=${scale}&width=${width}&height=${height}`;
};

// ============ SKY OBJECTS ============

// Messier catalog objects for quick selection
export const popularObjects = [
  { name: 'M31 - Andromeda Galaxy', ra: 10.6833, dec: 41.2686, size: 178, type: 'galaxy' as const },
  { name: 'M42 - Orion Nebula', ra: 83.8221, dec: -5.3911, size: 65, type: 'nebula' as const },
  { name: 'M45 - Pleiades', ra: 56.75, dec: 24.1167, size: 110, type: 'cluster' as const },
  { name: 'M51 - Whirlpool Galaxy', ra: 202.4696, dec: 47.1952, size: 11, type: 'galaxy' as const },
  { name: 'M13 - Hercules Cluster', ra: 250.4232, dec: 36.4603, size: 20, type: 'cluster' as const },
  { name: 'M27 - Dumbbell Nebula', ra: 299.9008, dec: 22.7211, size: 8, type: 'nebula' as const },
  { name: 'M57 - Ring Nebula', ra: 283.3963, dec: 33.0294, size: 1.4, type: 'nebula' as const },
  { name: 'M81 - Bode\'s Galaxy', ra: 148.8883, dec: 69.0652, size: 26, type: 'galaxy' as const },
  { name: 'M1 - Crab Nebula', ra: 83.6333, dec: 22.0145, size: 6, type: 'nebula' as const },
  { name: 'M33 - Triangulum Galaxy', ra: 23.4621, dec: 30.6599, size: 73, type: 'galaxy' as const },
  { name: 'M104 - Sombrero Galaxy', ra: 189.9976, dec: -11.6231, size: 9, type: 'galaxy' as const },
  { name: 'M8 - Lagoon Nebula', ra: 270.9208, dec: -24.3803, size: 90, type: 'nebula' as const },
];

// ============ UI HELPERS ============

export const getColorForIndex = (index: number): string => {
  const colors = [
    '#00ff00', // Green
    '#ff0000', // Red
    '#0099ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff9900', // Orange
    '#9900ff', // Purple
  ];
  return colors[index % colors.length];
};

// ============ VALIDATION HELPERS ============

export const validateTelescopeSpecs = (specs: TelescopeSpecs): string[] => {
  const errors: string[] = [];
  
  if (specs.aperture <= 0) {
    errors.push('Aperture must be greater than 0');
  }
  
  if (specs.focalLength <= 0) {
    errors.push('Focal length must be greater than 0');
  }
  
  if (specs.aperture > specs.focalLength) {
    errors.push('Focal length should typically be larger than aperture');
  }
  
  const focalRatio = specs.focalLength / specs.aperture;
  if (focalRatio < 2 || focalRatio > 20) {
    errors.push(`Unusual focal ratio (f/${focalRatio.toFixed(1)}). Typical range is f/2 to f/20`);
  }
  
  return errors;
};

export const validateEyepieceSpecs = (specs: EyepieceSpecs): string[] => {
  const errors: string[] = [];
  
  if (specs.focalLength <= 0) {
    errors.push('Eyepiece focal length must be greater than 0');
  }
  
  if (specs.apparentFOV < 20 || specs.apparentFOV > 120) {
    errors.push('Apparent FOV should be between 20° and 120°');
  }
  
  if (specs.barlowFactor && (specs.barlowFactor < 1 || specs.barlowFactor > 5)) {
    errors.push('Barlow factor should be between 1x and 5x');
  }
  
  return errors;
};

// ============ FORMATTING HELPERS ============

export const formatFOV = (fov: number): string => {
  if (fov < 0.1) {
    return `${(fov * 60).toFixed(1)}'`; // Show in arcminutes
  }
  return `${fov.toFixed(2)}°`;
};

export const formatMagnification = (mag: number): string => {
  return `${mag.toFixed(0)}x`;
};

export const getMagnificationAdvice = (
  magnification: number,
  maxUseful: number
): { message: string; type: 'info' | 'warning' | 'error' } => {
  if (magnification > maxUseful) {
    return {
      message: `Magnification exceeds maximum useful (${maxUseful}x). Image quality will degrade.`,
      type: 'error',
    };
  } else if (magnification > maxUseful * 0.8) {
    return {
      message: `Approaching maximum useful magnification. Best for planetary viewing.`,
      type: 'warning',
    };
  } else if (magnification < 20) {
    return {
      message: `Low magnification - excellent for wide field viewing and deep sky objects.`,
      type: 'info',
    };
  } else if (magnification < 100) {
    return {
      message: `Medium magnification - good for general purpose observing.`,
      type: 'info',
    };
  } else {
    return {
      message: `High magnification - suitable for lunar and planetary detail.`,
      type: 'info',
    };
  }
};

export const getExitPupilAdvice = (
  exitPupil: number
): { message: string; type: 'info' | 'warning' } => {
  if (exitPupil > 7) {
    return {
      message: `Exit pupil larger than human eye (7mm). Light is wasted - use higher magnification.`,
      type: 'warning',
    };
  } else if (exitPupil < 0.5) {
    return {
      message: `Very small exit pupil. Image will be dim and hard to observe.`,
      type: 'warning',
    };
  } else if (exitPupil >= 5 && exitPupil <= 7) {
    return {
      message: `Large exit pupil - excellent for deep sky objects under dark skies.`,
      type: 'info',
    };
  } else if (exitPupil >= 2 && exitPupil < 5) {
    return {
      message: `Medium exit pupil - good general purpose observing.`,
      type: 'info',
    };
  } else {
    return {
      message: `Small exit pupil - suitable for lunar, planetary, and bright objects.`,
      type: 'info',
    };
  }
};
