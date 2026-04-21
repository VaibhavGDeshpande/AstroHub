// components/telescope-calculator/types.ts

export interface TelescopeSpecs {
  aperture: number; // mm
  focalLength: number; // mm
  focalRatio?: number; // calculated
}

export interface EyepieceSpecs {
  id: string;
  name: string;
  focalLength: number; // mm
  apparentFOV: number; // degrees
  barlowFactor?: number;
}

export interface CalculatedResults {
  magnification: number;
  trueFOV: number; // degrees
  exitPupil: number; // mm
  resolvingPower: number; // arcseconds (Rayleigh)
  dawesLimit: number; // arcseconds
  limitingMagnitude: number;
  maxUsefulMagnification: number;
  focalRatio: number; // native
  effectiveFocalRatio: number; // with barlow
  effectiveFocalLength: number; // with barlow
  lightGatheringPower: number; // vs human eye
}

export interface SkyObject {
  name: string;
  ra: number; // Right Ascension (degrees)
  dec: number; // Declination (degrees)
  size: number; // Angular size in arcminutes
  type: 'galaxy' | 'nebula' | 'cluster' | 'planet';
}

export interface FOVOverlay {
  id: string;
  name: string;
  width: number; // degrees
  height: number; // degrees
  color: string;
}

