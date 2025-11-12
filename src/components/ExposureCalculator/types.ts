// components/astro-exposure-calculator/types.ts

export interface CameraSpecs {
  sensorWidth: number;
  sensorHeight: number;
  megapixels: number;
  pixelSize?: number;
}

export interface LensSpecs {
  focalLength: number;
  aperture: number;
}

export interface ExposureSettings {
  iso: number;
  shutterSpeed: number;
  aperture: number;
  numberOfFrames: number;
  darkFrames: number;
  flatFrames: number;
  biasFrames: number;
}

export type BortleScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface LocationConditions {
  latitude: number;
  bortleScale: BortleScale;
}

export interface LightPollutionData {
  class: string;
  description: string;
  visible: string;
  skyGlow: string;
  skyBrightness: string;
  nakedEyeLimit: string;
  opticLimit: string;
  recommendedFilters: string[];
  isoMultiplier: number;
  integrationMultiplier: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Very Difficult' | 'Nearly Impossible';
}

export interface CalculatedResults {
  fieldOfView: {
    horizontal: number;
    vertical: number;
    diagonal: number;
  };
  maxExposureTime: {
    rule500: number;
    npfRule: number;
  };
  totalIntegrationTime: number;
  estimatedSNR: number;
  imageScale: number;
  lightPollution: LightPollutionData;
  adjustedSettings: {
    recommendedISO: number;
    recommendedFrames: number;
    estimatedSessionTime: number;
  };
  recommendations: string[];
  warnings: string[];
}

export type AstroTarget = 
  | 'deep-sky' 
  | 'milky-way' 
  | 'star-trails' 
  | 'moon' 
  | 'planets' 
  | 'aurora'
  | 'wide-field';

export interface TargetObject {
  name: string;
  type: AstroTarget;
  recommendedISO: number[];
  recommendedAperture: number[];
  recommendedExposure: number[];
  minIntegrationTime?: number;
  tips: string[];
}
