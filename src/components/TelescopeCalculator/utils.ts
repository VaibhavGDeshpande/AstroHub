// components/telescope-calculator/utils.ts - SKYVIEW-ONLY VERSION

import { TelescopeSpecs, EyepieceSpecs, CalculatedResults } from './types';

export const calculateTelescopePerformance = (
  telescope: TelescopeSpecs,
  eyepiece: EyepieceSpecs
): CalculatedResults => {
  const barlowFactor = eyepiece.barlowFactor || 1;
  const effectiveFocalLength = telescope.focalLength * barlowFactor;
  const nativeFocalRatio = telescope.focalLength / telescope.aperture;
  const effectiveFocalRatio = effectiveFocalLength / telescope.aperture;

  const magnification = effectiveFocalLength / eyepiece.focalLength;
  const trueFOV = eyepiece.apparentFOV / magnification;
  const exitPupil = telescope.aperture / magnification;
  
  // Rayleigh Criterion: 138 / D_mm
  const resolvingPower = 138 / telescope.aperture;
  // Dawes Limit: 116 / D_mm
  const dawesLimit = 116 / telescope.aperture;
  
  // Theoretical Limiting Magnitude: 2.7 + 5 * log10(D_mm)
  const limitingMagnitude = 2.7 + 5 * Math.log10(telescope.aperture);
  
  const maxUsefulMagnification = 2 * telescope.aperture;
  
  // Light Gathering Power relative to 7mm human pupil
  const lightGatheringPower = Math.pow(telescope.aperture / 7, 2);

  return {
    magnification: Math.round(magnification * 10) / 10,
    trueFOV: Math.round(trueFOV * 100) / 100,
    exitPupil: Math.round(exitPupil * 10) / 10,
    resolvingPower: Math.round(resolvingPower * 100) / 100,
    dawesLimit: Math.round(dawesLimit * 100) / 100,
    limitingMagnitude: Math.round(limitingMagnitude * 10) / 10,
    maxUsefulMagnification: Math.round(maxUsefulMagnification),
    focalRatio: Math.round(nativeFocalRatio * 10) / 10,
    effectiveFocalRatio: Math.round(effectiveFocalRatio * 10) / 10,
    effectiveFocalLength: Math.round(effectiveFocalLength),
    lightGatheringPower: Math.round(lightGatheringPower),
  };
};

// ============ SKYVIEW ONLY ============

export type ImageSource = 'skyview';

export interface ImageSourceConfig {
  name: string;
  buildUrl: (ra: number, dec: number, sizeDegrees: number) => string;
  description: string;
  coverage: string;
}

export const imageSources: Record<ImageSource, ImageSourceConfig> = {
  skyview: {
    name: 'NASA SkyView',
    buildUrl: (ra, dec, sizeDegrees) =>
      // DSS survey with JPEG return and adjustable Pixel size
      `https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl?Position=${ra},${dec}&Survey=DSS&Pixels=600&Return=JPEG&Size=${sizeDegrees}`,
    description: 'NASA SkyView Virtual Observatory',
    coverage: 'All-sky coverage with multiple surveys (using DSS here)',
  },
};

// Helper to load image from SkyView via proxy
export async function loadSkyImageWithFallback(
  ra: number,
  dec: number,
  sizeDegrees: number,
  preferredSource: ImageSource = 'skyview'
): Promise<{ img: HTMLImageElement; source: ImageSource } | null> {
  const config = imageSources[preferredSource];
  const remoteUrl = config.buildUrl(ra, dec, sizeDegrees);
  const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(remoteUrl)}`;

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      // harmless; same-origin proxy already satisfies canvas rules
      image.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
      image.onload = () => {
        clearTimeout(timeout);
        resolve(image);
      };
      image.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load'));
      };

      image.src = proxiedUrl;
    });

    return { img, source: 'skyview' };
  } catch {
    return null;
  }
}

// ============ SKY OBJECTS ============
export const popularObjects = [
  { name: 'M1 - Crab Nebula', ra: 83.6333, dec: 22.0145, size: 6.0, type: 'nebula' as const }, // SNR [web:55]
  { name: 'M2 - Globular Cluster', ra: 323.3625, dec: -0.8233, size: 12.9, type: 'cluster' as const }, // [web:55]
  { name: 'M3 - Globular Cluster', ra: 205.5484, dec: 28.3772, size: 16.2, type: 'cluster' as const }, // [web:55]
  { name: 'M4 - Globular Cluster', ra: 245.8967, dec: -26.5250, size: 26.3, type: 'cluster' as const }, // [web:55]
  { name: 'M5 - Globular Cluster', ra: 229.6384, dec: 2.0817, size: 17.4, type: 'cluster' as const }, // [web:55]
  { name: 'M6 - Butterfly Cluster', ra: 265.0680, dec: -32.2167, size: 25.0, type: 'cluster' as const }, // OC [web:55]
  { name: 'M7 - Ptolemy Cluster', ra: 268.4460, dec: -34.8000, size: 80.0, type: 'cluster' as const }, // OC [web:55]
  { name: 'M8 - Lagoon Nebula', ra: 270.9208, dec: -24.3803, size: 90.0, type: 'nebula' as const }, // [web:55]
  { name: 'M9 - Globular Cluster', ra: 259.7991, dec: -18.5169, size: 9.3, type: 'cluster' as const }, // [web:55]
  { name: 'M10 - Globular Cluster', ra: 254.2871, dec: -4.1008, size: 15.1, type: 'cluster' as const }, // [web:55]
  { name: 'M11 - Wild Duck Cluster', ra: 282.7709, dec: -6.2700, size: 14.0, type: 'cluster' as const }, // OC [web:55]
  { name: 'M12 - Globular Cluster', ra: 251.8092, dec: -1.9483, size: 16.8, type: 'cluster' as const }, // [web:55]
  { name: 'M13 - Hercules Cluster', ra: 250.4232, dec: 36.4603, size: 20.0, type: 'cluster' as const }, // [web:55]
  { name: 'M14 - Globular Cluster', ra: 264.4008, dec: -3.2458, size: 11.7, type: 'cluster' as const }, // [web:55]
  { name: 'M15 - Globular Cluster', ra: 322.4933, dec: 12.1670, size: 12.3, type: 'cluster' as const }, // [web:55]
  { name: 'M16 - Eagle Nebula', ra: 274.7000, dec: -13.8067, size: 35.0, type: 'nebula' as const }, // incl. cluster [web:55]
  { name: 'M17 - Omega Nebula', ra: 275.1000, dec: -16.1767, size: 46.0, type: 'nebula' as const }, // [web:55]
  { name: 'M18 - Open Cluster', ra: 274.9500, dec: -17.1000, size: 9.0, type: 'cluster' as const }, // [web:55]
  { name: 'M19 - Globular Cluster', ra: 255.6575, dec: -26.2678, size: 13.5, type: 'cluster' as const }, // [web:55]
  { name: 'M20 - Trifid Nebula', ra: 270.6596, dec: -22.9710, size: 29.0, type: 'nebula' as const }, // [web:55]
  { name: 'M21 - Open Cluster', ra: 270.7196, dec: -22.5075, size: 13.0, type: 'cluster' as const }, // [web:55]
  { name: 'M22 - Globular Cluster', ra: 279.0996, dec: -23.9047, size: 24.0, type: 'cluster' as const }, // [web:55]
  { name: 'M23 - Open Cluster', ra: 269.1500, dec: -19.0167, size: 27.0, type: 'cluster' as const }, // [web:55]
  { name: 'M24 - Sagittarius Star Cloud', ra: 274.4000, dec: -18.4500, size: 90.0, type: 'cluster' as const }, // MW patch [web:55]
  { name: 'M25 - Open Cluster', ra: 277.9500, dec: -19.2500, size: 32.0, type: 'cluster' as const }, // [web:55]
  { name: 'M26 - Open Cluster', ra: 281.8550, dec: -9.3833, size: 15.0, type: 'cluster' as const }, // [web:55]
  { name: 'M27 - Dumbbell Nebula', ra: 299.9008, dec: 22.7211, size: 8.0, type: 'nebula' as const }, // [web:55]
  { name: 'M28 - Globular Cluster', ra: 276.1375, dec: -24.8697, size: 11.2, type: 'cluster' as const }, // [web:55]
  { name: 'M29 - Open Cluster', ra: 305.9837, dec: 38.5336, size: 10.0, type: 'cluster' as const }, // [web:55]
  { name: 'M30 - Globular Cluster', ra: 325.0921, dec: -23.1790, size: 12.0, type: 'cluster' as const }, // [web:55]
  { name: 'M31 - Andromeda Galaxy', ra: 10.6833, dec: 41.2686, size: 178.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M32 - Elliptical Galaxy', ra: 10.6750, dec: 40.8667, size: 8.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M33 - Triangulum Galaxy', ra: 23.4621, dec: 30.6599, size: 73.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M34 - Open Cluster', ra: 40.5000, dec: 42.7667, size: 35.0, type: 'cluster' as const }, // [web:55]
  { name: 'M35 - Open Cluster', ra: 92.2250, dec: 24.3333, size: 28.0, type: 'cluster' as const }, // [web:55]
  { name: 'M36 - Open Cluster', ra: 84.0667, dec: 34.1333, size: 12.0, type: 'cluster' as const }, // [web:55]
  { name: 'M37 - Open Cluster', ra: 88.0750, dec: 32.5500, size: 24.0, type: 'cluster' as const }, // [web:55]
  { name: 'M38 - Open Cluster', ra: 82.1750, dec: 35.8500, size: 21.0, type: 'cluster' as const }, // [web:55]
  { name: 'M39 - Open Cluster', ra: 322.6500, dec: 48.4333, size: 29.0, type: 'cluster' as const }, // [web:55]
  { name: 'M40 - Winnecke 4 (Double Star)', ra: 184.7396, dec: 58.0822, size: 0.2, type: 'cluster' as const }, // star pair; tiny [web:55]
  { name: 'M41 - Open Cluster', ra: 101.5000, dec: -20.7500, size: 38.0, type: 'cluster' as const }, // [web:55]
  { name: 'M42 - Orion Nebula', ra: 83.8221, dec: -5.3911, size: 65.0, type: 'nebula' as const }, // [web:55]
  { name: 'M43 - De Mairan’s Nebula', ra: 83.8167, dec: -5.2667, size: 20.0, type: 'nebula' as const }, // [web:55]
  { name: 'M44 - Beehive Cluster', ra: 130.0250, dec: 19.9833, size: 95.0, type: 'cluster' as const }, // [web:55]
  { name: 'M45 - Pleiades', ra: 56.7500, dec: 24.1167, size: 110.0, type: 'cluster' as const }, // [web:55]
  { name: 'M46 - Open Cluster', ra: 112.1800, dec: -14.8167, size: 27.0, type: 'cluster' as const }, // [web:55]
  { name: 'M47 - Open Cluster', ra: 114.1496, dec: -14.4833, size: 30.0, type: 'cluster' as const }, // [web:55]
  { name: 'M48 - Open Cluster', ra: 123.4000, dec: -5.8000, size: 54.0, type: 'cluster' as const }, // [web:55]
  { name: 'M49 - Elliptical Galaxy', ra: 187.4450, dec: 8.0000, size: 10.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M50 - Open Cluster', ra: 105.7417, dec: -8.3333, size: 16.0, type: 'cluster' as const }, // [web:55]
  { name: 'M51 - Whirlpool Galaxy', ra: 202.4696, dec: 47.1952, size: 11.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M52 - Open Cluster', ra: 351.0833, dec: 61.5833, size: 13.0, type: 'cluster' as const }, // [web:55]
  { name: 'M53 - Globular Cluster', ra: 198.2296, dec: 18.1683, size: 13.0, type: 'cluster' as const }, // [web:55]
  { name: 'M54 - Globular Cluster', ra: 283.7625, dec: -30.4783, size: 12.0, type: 'cluster' as const }, // [web:55]
  { name: 'M55 - Globular Cluster', ra: 294.9962, dec: -30.9647, size: 19.0, type: 'cluster' as const }, // [web:55]
  { name: 'M56 - Globular Cluster', ra: 289.1487, dec: 30.1845, size: 7.1, type: 'cluster' as const }, // [web:55]
  { name: 'M57 - Ring Nebula', ra: 283.3963, dec: 33.0294, size: 1.4, type: 'nebula' as const }, // [web:55]
  { name: 'M58 - Barred Spiral Galaxy', ra: 189.4300, dec: 11.8200, size: 5.5, type: 'galaxy' as const }, // [web:55]
  { name: 'M59 - Elliptical Galaxy', ra: 190.5325, dec: 11.6467, size: 5.4, type: 'galaxy' as const }, // [web:55]
  { name: 'M60 - Elliptical Galaxy', ra: 190.9162, dec: 11.5525, size: 7.2, type: 'galaxy' as const }, // [web:55]
  { name: 'M61 - Spiral Galaxy', ra: 185.4792, dec: 4.4736, size: 6.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M62 - Globular Cluster', ra: 255.3054, dec: -30.1113, size: 14.1, type: 'cluster' as const }, // [web:55]
  { name: 'M63 - Sunflower Galaxy', ra: 198.9558, dec: 42.0292, size: 12.6, type: 'galaxy' as const }, // [web:55]
  { name: 'M64 - Black Eye Galaxy', ra: 194.1821, dec: 21.6828, size: 10.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M65 - Spiral Galaxy', ra: 169.7333, dec: 13.0933, size: 9.8, type: 'galaxy' as const }, // [web:55]
  { name: 'M66 - Spiral Galaxy', ra: 170.0000, dec: 12.9900, size: 8.7, type: 'galaxy' as const }, // [web:55]
  { name: 'M67 - Open Cluster', ra: 132.8750, dec: 11.8000, size: 30.0, type: 'cluster' as const }, // [web:55]
  { name: 'M68 - Globular Cluster', ra: 189.8662, dec: -26.7442, size: 11.0, type: 'cluster' as const }, // [web:55]
  { name: 'M69 - Globular Cluster', ra: 277.8467, dec: -32.3481, size: 9.8, type: 'cluster' as const }, // [web:55]
  { name: 'M70 - Globular Cluster', ra: 280.8038, dec: -32.2927, size: 7.8, type: 'cluster' as const }, // [web:55]
  { name: 'M71 - Globular Cluster', ra: 298.4438, dec: 18.7792, size: 7.2, type: 'cluster' as const }, // [web:55]
  { name: 'M72 - Globular Cluster', ra: 313.3650, dec: -12.5378, size: 6.6, type: 'cluster' as const }, // [web:55]
  { name: 'M73 - Asterism', ra: 314.7225, dec: -12.6272, size: 3.0, type: 'cluster' as const }, // small group [web:55]
  { name: 'M74 - Spiral Galaxy', ra: 24.1746, dec: 15.7831, size: 10.5, type: 'galaxy' as const }, // [web:55]
  { name: 'M75 - Globular Cluster', ra: 305.9942, dec: -21.9228, size: 6.8, type: 'cluster' as const }, // [web:55]
  { name: 'M76 - Little Dumbbell Nebula', ra: 25.2875, dec: 51.5739, size: 2.7, type: 'nebula' as const }, // PN [web:55]
  { name: 'M77 - Spiral Galaxy', ra: 40.6696, dec: 0.0133, size: 7.1, type: 'galaxy' as const }, // [web:55]
  { name: 'M78 - Reflection Nebula', ra: 86.7000, dec: 0.0500, size: 8.0, type: 'nebula' as const }, // [web:55]
  { name: 'M79 - Globular Cluster', ra: 81.0458, dec: -24.5242, size: 8.7, type: 'cluster' as const }, // [web:55]
  { name: 'M80 - Globular Cluster', ra: 244.2587, dec: -22.9763, size: 8.9, type: 'cluster' as const }, // [web:55]
  { name: 'M81 - Bode’s Galaxy', ra: 148.8883, dec: 69.0652, size: 26.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M82 - Cigar Galaxy', ra: 148.9683, dec: 69.6797, size: 11.2, type: 'galaxy' as const }, // [web:55]
  { name: 'M83 - Southern Pinwheel', ra: 204.2538, dec: -29.8650, size: 13.2, type: 'galaxy' as const }, // [web:55]
  { name: 'M84 - Elliptical Galaxy', ra: 186.2654, dec: 12.8869, size: 5.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M85 - Lenticular/Elliptical', ra: 186.3500, dec: 18.1914, size: 7.1, type: 'galaxy' as const }, // [web:55]
  { name: 'M86 - Lenticular/Elliptical', ra: 186.5496, dec: 12.9467, size: 8.9, type: 'galaxy' as const }, // [web:55]
  { name: 'M87 - Virgo A', ra: 187.7050, dec: 12.3911, size: 8.3, type: 'galaxy' as const }, // [web:55]
  { name: 'M88 - Spiral Galaxy', ra: 187.9967, dec: 14.4203, size: 7.1, type: 'galaxy' as const }, // [web:55]
  { name: 'M89 - Elliptical Galaxy', ra: 188.9150, dec: 12.5567, size: 5.1, type: 'galaxy' as const }, // [web:55]
  { name: 'M90 - Spiral Galaxy', ra: 189.2171, dec: 13.1628, size: 9.5, type: 'galaxy' as const }, // [web:55]
  { name: 'M91 - Barred Spiral Galaxy', ra: 188.8596, dec: 14.4961, size: 5.4, type: 'galaxy' as const }, // [web:55]
  { name: 'M92 - Globular Cluster', ra: 259.2800, dec: 43.1350, size: 11.2, type: 'cluster' as const }, // [web:55]
  { name: 'M93 - Open Cluster', ra: 116.1750, dec: -23.8667, size: 22.0, type: 'cluster' as const }, // [web:55]
  { name: 'M94 - Spiral Galaxy', ra: 192.7212, dec: 41.1206, size: 11.2, type: 'galaxy' as const }, // [web:55]
  { name: 'M95 - Barred Spiral Galaxy', ra: 161.8792, dec: 11.7047, size: 4.4, type: 'galaxy' as const }, // [web:55]
  { name: 'M96 - Spiral Galaxy', ra: 161.9167, dec: 11.8194, size: 6.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M97 - Owl Nebula', ra: 168.6983, dec: 55.0192, size: 3.4, type: 'nebula' as const }, // PN [web:55]
  { name: 'M98 - Spiral Galaxy', ra: 183.4517, dec: 14.9008, size: 9.8, type: 'galaxy' as const }, // [web:55]
  { name: 'M99 - Pinwheel Galaxy (Coma)', ra: 184.7062, dec: 14.4167, size: 5.4, type: 'galaxy' as const }, // [web:55]
  { name: 'M100 - Spiral Galaxy', ra: 185.7283, dec: 15.8203, size: 7.4, type: 'galaxy' as const }, // [web:55]
  { name: 'M101 - Pinwheel Galaxy (UMa)', ra: 210.8021, dec: 54.3489, size: 28.8, type: 'galaxy' as const }, // [web:55]
  { name: 'M102 - Spindle Galaxy (NGC 5866)', ra: 226.6229, dec: 55.7633, size: 5.2, type: 'galaxy' as const }, // common ID [web:55]
  { name: 'M103 - Open Cluster', ra: 23.3000, dec: 60.7167, size: 6.0, type: 'cluster' as const }, // [web:55]
  { name: 'M104 - Sombrero Galaxy', ra: 189.9976, dec: -11.6231, size: 9.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M105 - Elliptical Galaxy', ra: 161.9500, dec: 12.5819, size: 5.0, type: 'galaxy' as const }, // [web:55]
  { name: 'M106 - Spiral Galaxy', ra: 184.7396, dec: 47.3039, size: 18.6, type: 'galaxy' as const }, // [web:55]
  { name: 'M107 - Globular Cluster', ra: 248.1337, dec: -13.0531, size: 13.0, type: 'cluster' as const }, // [web:55]
  { name: 'M108 - Spiral Galaxy', ra: 167.8762, dec: 55.6744, size: 8.7, type: 'galaxy' as const }, // [web:55]
  { name: 'M109 - Barred Spiral Galaxy', ra: 179.3987, dec: 53.3742, size: 7.6, type: 'galaxy' as const }, // [web:55]
  { name: 'M110 - Andromeda Satellite', ra: 10.1000, dec: 41.6833, size: 17.0, type: 'galaxy' as const }, // M110 [web:55]
];


// ============ UI HELPERS ============
export const getColorForIndex = (index: number): string => {
  const colors = ['#00ff00','#ff0000','#0099ff','#ffff00','#ff00ff','#00ffff','#ff9900','#9900ff'];
  return colors[index % colors.length];
};

// ============ VALIDATION HELPERS ============
export const validateTelescopeSpecs = (specs: TelescopeSpecs): string[] => {
  const errors: string[] = [];
  if (specs.aperture <= 0) errors.push('Aperture must be greater than 0');
  if (specs.focalLength <= 0) errors.push('Focal length must be greater than 0');
  if (specs.aperture > specs.focalLength) errors.push('Focal length should typically be larger than aperture');
  const focalRatio = specs.focalLength / specs.aperture;
  if (focalRatio < 2 || focalRatio > 20) {
    errors.push(`Unusual focal ratio (f/${focalRatio.toFixed(1)}). Typical range is f/2 to f/20`);
  }
  return errors;
};

export const validateEyepieceSpecs = (specs: EyepieceSpecs): string[] => {
  const errors: string[] = [];
  if (specs.focalLength <= 0) errors.push('Eyepiece focal length must be greater than 0');
  if (specs.apparentFOV < 20 || specs.apparentFOV > 120) errors.push('Apparent FOV should be between 20° and 120°');
  if (specs.barlowFactor && (specs.barlowFactor < 1 || specs.barlowFactor > 5)) {
    errors.push('Barlow factor should be between 1x and 5x');
  }
  return errors;
};

// ============ FORMATTING HELPERS ============
export const formatFOV = (fov: number): string => (fov < 0.1 ? `${(fov * 60).toFixed(1)}'` : `${fov.toFixed(2)}°`);
export const formatMagnification = (mag: number): string => `${mag.toFixed(0)}x`;

export const getMagnificationAdvice = (
  magnification: number,
  maxUseful: number
): { message: string; type: 'info' | 'warning' | 'error' } => {
  if (magnification > maxUseful) {
    return { message: `Magnification exceeds maximum useful (${maxUseful}x). Image quality will degrade.`, type: 'error' };
  } else if (magnification > maxUseful * 0.8) {
    return { message: `Approaching maximum useful magnification. Best for planetary viewing.`, type: 'warning' };
  } else if (magnification < 20) {
    return { message: `Low magnification - excellent for wide field viewing and deep sky objects.`, type: 'info' };
  } else if (magnification < 100) {
    return { message: `Medium magnification - good for general purpose observing.`, type: 'info' };
  } else {
    return { message: `High magnification - suitable for lunar and planetary detail.`, type: 'info' };
  }
};

export const getExitPupilAdvice = (
  exitPupil: number
): { message: string; type: 'info' | 'warning' } => {
  if (exitPupil > 7) {
    return { message: `Exit pupil larger than human eye (7mm). Light is wasted - use higher magnification.`, type: 'warning' };
  } else if (exitPupil < 0.5) {
    return { message: `Very small exit pupil. Image will be dim and hard to observe.`, type: 'warning' };
  } else if (exitPupil >= 5 && exitPupil <= 7) {
    return { message: `Large exit pupil - excellent for deep sky objects under dark skies.`, type: 'info' };
  } else if (exitPupil >= 2 && exitPupil < 5) {
    return { message: `Medium exit pupil - good general purpose observing.`, type: 'info' };
  } else {
    return { message: `Small exit pupil - suitable for lunar, planetary, and bright objects.`, type: 'info' };
  }
};
