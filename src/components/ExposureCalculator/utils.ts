// components/astro-exposure-calculator/utils.ts

import { CameraSpecs, LensSpecs, ExposureSettings, CalculatedResults, TargetObject, AstroTarget, BortleScale, LightPollutionData, LocationConditions } from './types';

// ============ BORTLE SCALE DATA ============

export const bortleScaleData: Record<BortleScale, LightPollutionData> = {
  1: {
    class: 'Class 1 - Excellent Dark Sky',
    description: 'Truly dark location, no light pollution',
    visible: 'Milky Way casting shadows, zodiacal light obvious, M33 visible to naked eye',
    skyGlow: 'Airglow visible, sky appears black',
    recommendedFilters: ['None needed - pristine skies'],
    isoMultiplier: 0.5,
    integrationMultiplier: 1.0,
    difficulty: 'Easy',
  },
  2: {
    class: 'Class 2 - Truly Dark Sky',
    description: 'Minimal light pollution on horizon',
    visible: 'Milky Way highly structured, zodiacal light striking, M33 easy with averted vision',
    skyGlow: 'Airglow weakly visible, sky gray near horizon',
    recommendedFilters: ['None needed'],
    isoMultiplier: 0.7,
    integrationMultiplier: 1.0,
    difficulty: 'Easy',
  },
  3: {
    class: 'Class 3 - Rural Sky',
    description: 'Some light pollution near horizon',
    visible: 'Milky Way appears complex, M15/M4/M5 obvious, zodiacal light visible',
    skyGlow: 'Light domes visible in several directions',
    recommendedFilters: ['Light pollution filter optional'],
    isoMultiplier: 0.85,
    integrationMultiplier: 1.2,
    difficulty: 'Easy',
  },
  4: {
    class: 'Class 4 - Rural/Suburban Transition',
    description: 'Moderate light pollution',
    visible: 'Milky Way visible but washed out, M33 difficult, zodiacal light barely visible',
    skyGlow: 'Light domes in most directions, sky grayish',
    recommendedFilters: ['UHC or light pollution filter recommended'],
    isoMultiplier: 1.0,
    integrationMultiplier: 1.5,
    difficulty: 'Moderate',
  },
  5: {
    class: 'Class 5 - Suburban Sky',
    description: 'Significant light pollution',
    visible: 'Milky Way very weak or invisible, M33 very difficult, clouds appear brighter than sky',
    skyGlow: 'Sky obviously grayish white, light domes everywhere',
    recommendedFilters: ['Light pollution filter essential', 'Narrowband filters for nebulae'],
    isoMultiplier: 1.2,
    integrationMultiplier: 2.0,
    difficulty: 'Challenging',
  },
  6: {
    class: 'Class 6 - Bright Suburban Sky',
    description: 'Heavy light pollution',
    visible: 'Milky Way invisible, only brightest Messier objects visible',
    skyGlow: 'Sky pale grayish white, clouds brightly illuminated',
    recommendedFilters: ['Light pollution filter required', 'Narrowband essential for nebulae', 'Consider dual narrowband'],
    isoMultiplier: 1.5,
    integrationMultiplier: 3.0,
    difficulty: 'Very Difficult',
  },
  7: {
    class: 'Class 7 - Suburban/Urban Transition',
    description: 'Severe light pollution',
    visible: 'Entire sky grayish white, only brightest objects visible',
    skyGlow: 'Sky light gray even at zenith',
    recommendedFilters: ['Narrowband filters required', 'Dual narrowband (Ha/OIII)', 'Avoid broadband imaging'],
    isoMultiplier: 1.8,
    integrationMultiplier: 4.0,
    difficulty: 'Very Difficult',
  },
  8: {
    class: 'Class 8 - City Sky',
    description: 'Extreme light pollution',
    visible: 'Sky whitish gray, only Moon, planets, and brightest stars visible',
    skyGlow: 'Sky bright gray, horizon brightly lit',
    recommendedFilters: ['Only narrowband imaging viable', 'Ha, OIII, SII filters', 'Deep sky extremely difficult'],
    isoMultiplier: 2.0,
    integrationMultiplier: 5.0,
    difficulty: 'Nearly Impossible',
  },
  9: {
    class: 'Class 9 - Inner City Sky',
    description: 'Worst light pollution',
    visible: 'Entire sky brightly lit, stars barely visible',
    skyGlow: 'Sky brilliant white/orange, stars difficult to see',
    recommendedFilters: ['Only narrowband on emission nebulae', 'Most deep sky impossible', 'Consider planetary/lunar only'],
    isoMultiplier: 2.5,
    integrationMultiplier: 6.0,
    difficulty: 'Nearly Impossible',
  },
};

// ============ CALCULATIONS WITH VALIDATION ============

export function calculateExposureMetrics(
  camera: CameraSpecs,
  lens: LensSpecs,
  exposure: ExposureSettings,
  conditions: LocationConditions
): CalculatedResults {
  const { latitude, bortleScale } = conditions;
  
  // VALIDATION
  if (!bortleScale || typeof bortleScale !== 'number' || bortleScale < 1 || bortleScale > 9) {
    console.error('Invalid Bortle scale:', bortleScale, 'Type:', typeof bortleScale);
    throw new Error(`Invalid Bortle scale: ${bortleScale}. Must be a number between 1 and 9.`);
  }
  
  const pollutionData = bortleScaleData[bortleScale];
  
  if (!pollutionData) {
    throw new Error(`No pollution data found for Bortle scale ${bortleScale}`);
  }
  
  const pixelSize = camera.pixelSize || calculatePixelSize(camera.sensorWidth, camera.sensorHeight, camera.megapixels);
  
  // Field of View
  const fovHorizontal = 2 * Math.atan(camera.sensorWidth / (2 * lens.focalLength)) * (180 / Math.PI);
  const fovVertical = 2 * Math.atan(camera.sensorHeight / (2 * lens.focalLength)) * (180 / Math.PI);
  const fovDiagonal = 2 * Math.atan(Math.sqrt(camera.sensorWidth ** 2 + camera.sensorHeight ** 2) / (2 * lens.focalLength)) * (180 / Math.PI);
  
  const rule500 = 500 / lens.focalLength;
  const npf = calculateNPFRule(lens.focalLength, lens.aperture, pixelSize, latitude);
  const imageScale = (pixelSize / lens.focalLength) * 206.265;
  const totalIntegrationTime = (exposure.shutterSpeed * exposure.numberOfFrames) / 60;
  
  const adjustedISO = Math.round(exposure.iso * pollutionData.isoMultiplier);
  const recommendedFrames = Math.ceil(exposure.numberOfFrames * pollutionData.integrationMultiplier);
  const adjustedIntegrationTime = totalIntegrationTime * pollutionData.integrationMultiplier;
  
  const baseSNR = estimateSNR(exposure.iso, exposure.shutterSpeed, exposure.numberOfFrames);
  const pollutionSNRPenalty = 1 / Math.sqrt(pollutionData.integrationMultiplier);
  const estimatedSNR = baseSNR * pollutionSNRPenalty;
  
  const recommendations = generateRecommendations(camera, lens, exposure, bortleScale);
  const warnings = generateWarnings(camera, lens, exposure, rule500, npf, bortleScale);
  
  return {
    fieldOfView: {
      horizontal: Math.round(fovHorizontal * 100) / 100,
      vertical: Math.round(fovVertical * 100) / 100,
      diagonal: Math.round(fovDiagonal * 100) / 100,
    },
    maxExposureTime: {
      rule500: Math.round(rule500 * 10) / 10,
      npfRule: Math.round(npf * 10) / 10,
    },
    totalIntegrationTime: Math.round(totalIntegrationTime * 10) / 10,
    estimatedSNR: Math.round(estimatedSNR * 10) / 10,
    imageScale: Math.round(imageScale * 100) / 100,
    lightPollution: pollutionData,
    adjustedSettings: {
      recommendedISO: adjustedISO,
      recommendedFrames: recommendedFrames,
      estimatedSessionTime: Math.round(adjustedIntegrationTime * 10) / 10,
    },
    recommendations,
    warnings,
  };
}

function calculatePixelSize(sensorWidth: number, sensorHeight: number, megapixels: number): number {
  const totalPixels = megapixels * 1000000;
  const aspectRatio = sensorWidth / sensorHeight;
  const heightPixels = Math.sqrt(totalPixels / aspectRatio);
  const widthPixels = heightPixels * aspectRatio;
  return (sensorWidth * 1000) / widthPixels;
}

function calculateNPFRule(focalLength: number, aperture: number, pixelSize: number, latitude: number): number {
  const declinationFactor = Math.cos(latitude * Math.PI / 180);
  const npf = (35 * aperture + 30 * pixelSize) / (focalLength * declinationFactor);
  return Math.max(1, npf);
}

function estimateSNR(iso: number, shutterSpeed: number, frames: number): number {
  const totalExposure = shutterSpeed * frames;
  const baseSNR = Math.sqrt(totalExposure) * (100 / Math.sqrt(iso));
  return baseSNR;
}

function generateRecommendations(
  camera: CameraSpecs, 
  lens: LensSpecs, 
  exposure: ExposureSettings,
  bortleScale: BortleScale
): string[] {
  const recommendations: string[] = [];
  const pollutionData = bortleScaleData[bortleScale];
  
  if (bortleScale >= 5) {
    recommendations.push(`${pollutionData.class}: ${pollutionData.recommendedFilters[0]}`);
    recommendations.push(`Increase total integration time by ${pollutionData.integrationMultiplier}x for this light pollution level`);
  }
  
  if (bortleScale >= 6) {
    recommendations.push('Consider narrowband imaging (Ha, OIII, SII) for emission nebulae');
    recommendations.push('Galaxies and reflection nebulae will be very challenging');
  }
  
  if (bortleScale >= 7) {
    recommendations.push('Deep sky imaging extremely difficult - consider traveling to darker skies');
  }
  
  if (bortleScale <= 3) {
    recommendations.push('Excellent dark skies! You can use lower ISO for optimal results');
  }
  
  if (exposure.numberOfFrames < 20) {
    const recommended = Math.ceil(20 * pollutionData.integrationMultiplier);
    recommendations.push(`Take at least ${recommended} frames for this light pollution level`);
  }
  
  if (exposure.darkFrames === 0 && bortleScale >= 5) {
    recommendations.push('Dark frames essential in light-polluted areas for noise reduction');
  }
  
  if (exposure.flatFrames === 0) {
    recommendations.push('Flat frames critical for light pollution gradient removal');
  }
  
  if (exposure.iso > 6400) {
    recommendations.push('High ISO may introduce excessive noise. Consider longer exposures at lower ISO');
  }
  
  if (lens.aperture > 4) {
    recommendations.push('Consider using wider aperture (f/2.8 or lower) for better light gathering');
  }
  
  return recommendations;
}

function generateWarnings(
  camera: CameraSpecs,
  lens: LensSpecs,
  exposure: ExposureSettings,
  rule500: number,
  npf: number,
  bortleScale: BortleScale
): string[] {
  const warnings: string[] = [];
  
  if (bortleScale >= 6 && exposure.numberOfFrames < 100) {
    warnings.push(`Bortle ${bortleScale}: You'll need many more frames (100+) to overcome light pollution`);
  }
  
  if (bortleScale >= 7) {
    warnings.push('Severe light pollution will significantly impact image quality');
  }
  
  if (bortleScale >= 5 && exposure.iso < 800) {
    warnings.push('Low ISO in light-polluted area may result in gradient issues');
  }
  
  if (exposure.shutterSpeed > rule500) {
    warnings.push(`Exposure exceeds 500 rule (${rule500.toFixed(1)}s). Stars may trail!`);
  }
  
  if (exposure.shutterSpeed > npf * 1.5) {
    warnings.push(`Exposure exceeds NPF rule (${npf.toFixed(1)}s). Consider star tracking!`);
  }
  
  if (exposure.numberOfFrames < 10) {
    warnings.push('Very few frames. Stacking won\'t be as effective');
  }
  
  return warnings;
}

// ============ TARGET PRESETS ============

export const targetPresets: Record<AstroTarget, TargetObject> = {
  'milky-way': {
    name: 'Milky Way Core',
    type: 'milky-way',
    recommendedISO: [1600, 3200, 6400],
    recommendedAperture: [1.4, 1.8, 2.8],
    recommendedExposure: [15, 20, 25],
    minIntegrationTime: 10,
    tips: [
      'Use widest aperture available (f/1.4-f/2.8)',
      'Keep exposure under 20-30s to avoid star trailing',
      'ISO 3200-6400 is optimal for most cameras',
      'Best from dark sky locations (Bortle 1-4)',
      'Shoot during new moon for best contrast',
      'Focus on bright star using live view zoom',
    ],
  },
  
  'deep-sky': {
    name: 'Deep Sky Objects (DSO)',
    type: 'deep-sky',
    recommendedISO: [800, 1600, 3200],
    recommendedAperture: [2.8, 4, 5.6],
    recommendedExposure: [60, 120, 180, 300],
    minIntegrationTime: 60,
    tips: [
      'Requires star tracker for exposures over 30s',
      'Take 50-200+ light frames for best results',
      'Always capture dark, flat, and bias frames',
      'Lower ISO (800-1600) with longer exposures preferred',
      'Total integration time: 1-3 hours minimum',
      'Use dithering between frames if possible',
    ],
  },
  
  'star-trails': {
    name: 'Star Trails',
    type: 'star-trails',
    recommendedISO: [400, 800, 1600],
    recommendedAperture: [2.8, 4, 5.6],
    recommendedExposure: [30, 60, 120],
    minIntegrationTime: 30,
    tips: [
      'Take 100-300+ exposures and stack in post',
      'Use intervalometer for continuous shooting',
      'Each exposure 30-60s at ISO 400-800',
      'Point at Polaris (north) or celestial south pole',
      'Lower ISO for smoother trails',
      'Leave small gaps between frames for natural look',
    ],
  },
  
  'moon': {
    name: 'Moon',
    type: 'moon',
    recommendedISO: [100, 200, 400],
    recommendedAperture: [5.6, 8, 11],
    recommendedExposure: [0.008, 0.016, 0.033],
    minIntegrationTime: 1,
    tips: [
      'Moon is very bright - use low ISO (100-400)',
      'Fast shutter speeds (1/125 - 1/500s)',
      'Narrower aperture (f/5.6-f/11) for sharpness',
      'Best detail during crescent or gibbous phases',
      'Use longer focal length (200mm+)',
      'Focus carefully on crater edges',
    ],
  },
  
  'planets': {
    name: 'Planets',
    type: 'planets',
    recommendedISO: [400, 800, 1600],
    recommendedAperture: [4, 5.6, 8],
    recommendedExposure: [0.016, 0.033, 0.1],
    minIntegrationTime: 2,
    tips: [
      'Use long focal length (400mm+) or telescope',
      'Fast shutter to freeze atmospheric turbulence',
      'Shoot video and stack best frames',
      'ISO 800-1600 typically optimal',
      'Best when planet is high in sky',
      'Use lucky imaging technique',
    ],
  },
  
  'aurora': {
    name: 'Aurora Borealis/Australis',
    type: 'aurora',
    recommendedISO: [1600, 3200, 6400],
    recommendedAperture: [1.4, 2, 2.8],
    recommendedExposure: [3, 5, 8],
    minIntegrationTime: 5,
    tips: [
      'Widest aperture possible (f/1.4-f/2.8)',
      'Short exposures (3-8s) to capture movement',
      'High ISO (1600-6400) needed',
      'Wide angle lens (14-24mm) recommended',
      'Manual focus set to infinity',
      'Include foreground for context',
    ],
  },
  
  'wide-field': {
    name: 'Wide Field Nightscape',
    type: 'wide-field',
    recommendedISO: [1600, 3200, 6400],
    recommendedAperture: [1.8, 2.8, 4],
    recommendedExposure: [15, 20, 25, 30],
    minIntegrationTime: 10,
    tips: [
      'Include interesting foreground elements',
      'Use wide angle lens (14-35mm)',
      'Wide aperture for maximum light',
      'Exposure 15-30s depending on focal length',
      'Light paint foreground if needed',
      'Focus stack if foreground is close',
    ],
  },
};

export const cameraPresets = {
  'Full Frame': { width: 36, height: 24, mp: 24 },
  'APS-C Canon': { width: 22.2, height: 14.8, mp: 24 },
  'APS-C Nikon/Sony': { width: 23.5, height: 15.6, mp: 24 },
  'Micro Four Thirds': { width: 17.3, height: 13, mp: 20 },
  'Canon R5': { width: 36, height: 24, mp: 45 },
  'Sony A7III': { width: 35.6, height: 23.8, mp: 24.2 },
  'Sony A7IV': { width: 35.7, height: 23.8, mp: 33 },
  'Nikon D850': { width: 35.9, height: 23.9, mp: 45.7 },
  'Canon 6D': { width: 35.8, height: 23.9, mp: 20.2 },
};

export const commonLenses = [
  { name: '14mm f/1.8', focal: 14, aperture: 1.8 },
  { name: '20mm f/1.8', focal: 20, aperture: 1.8 },
  { name: '24mm f/1.4', focal: 24, aperture: 1.4 },
  { name: '35mm f/1.4', focal: 35, aperture: 1.4 },
  { name: '50mm f/1.8', focal: 50, aperture: 1.8 },
  { name: '85mm f/1.8', focal: 85, aperture: 1.8 },
  { name: '135mm f/2', focal: 135, aperture: 2 },
  { name: '200mm f/2.8', focal: 200, aperture: 2.8 },
  { name: 'Custom', focal: 0, aperture: 0 },
];

export function formatTime(seconds: number): string {
  if (seconds < 1) {
    return `1/${Math.round(1 / seconds)}s`;
  }
  return `${seconds}s`;
}

export function formatTotalTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins}min`;
  }
  return `${hours}h ${mins}min`;
}

export function getTargetIcon(type: AstroTarget): string {
  const icons: Record<AstroTarget, string> = {
    'milky-way': '',
    'deep-sky': '',
    'star-trails': '',
    'moon': '',
    'planets': '',
    'aurora': '',
    'wide-field': '',
  };
  return icons[type] || '📷';
}

export function getBortleColor(scale: BortleScale): string {
  if (scale <= 2) return 'from-green-600 to-emerald-600';
  if (scale <= 4) return 'from-blue-600 to-cyan-600';
  if (scale <= 6) return 'from-yellow-600 to-orange-600';
  if (scale <= 8) return 'from-red-600 to-rose-600';
  return 'from-purple-600 to-pink-600';
}
