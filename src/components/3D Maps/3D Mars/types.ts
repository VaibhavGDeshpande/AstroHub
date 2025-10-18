import Cesium from "cesium";

export interface RoverMenuEntry {
  text: string;
  onselect: () => void;
}

export interface LandmarkMenuEntry {
  text: string;
  onselect: () => void;
}

export interface RoverEntity {
  id?: string;
  name?: string;
  description?: string;
  position?: Cesium.PositionProperty;
  orientation?: Cesium.Property;
  availability?: Cesium.TimeInterval;
  properties?: {
    animationStartTime: Cesium.Property;
  };
  model?: Cesium.ModelGraphics & {
    lightColor: Cesium.Property;
  };
  label?: Cesium.LabelGraphics;
}

export interface CameraFlyToOptions {
  destination: Cesium.Cartesian3;
  orientation: Cesium.HeadingPitchRoll;
  easingFunction: typeof Cesium.EasingFunction.CUBIC_IN_OUT;
  maximumHeight: number;
  pitchAdjustHeight: number;
  duration: number;
  complete: () => void;
}

export interface LandmarkFlyToOptions {
  destination: Cesium.Cartesian3;
  orientation: Cesium.HeadingPitchRoll;
  easingFunction: typeof Cesium.EasingFunction;
  maximumHeight: number;
  pitchAdjustHeight: number;
  duration: number;
  complete: () => void;
}

export interface PerformanceConfig {
  viewer: {
    resolutionScale: number;
    targetFrameRate: number;
    requestRenderMode: boolean;
    maximumRenderTimeChange: number;
  };
  tileset: {
    maximumScreenSpaceError: number;
    maximumMemoryUsage: number;
    foveatedConeSize: number;
    cullRequestsWhileMoving: boolean;
    cullRequestsWhileMovingMultiplier: number;
    skipLevelOfDetail: boolean;
    baseScreenSpaceError: number;
    skipScreenSpaceErrorFactor: number;
    skipLevels: number;
    immediatelyLoadDesiredLevelOfDetail: boolean;
    loadSiblings: boolean;
    preloadWhenHidden: boolean;
    preloadFlightDestinations: boolean;
    preferLeaves: boolean;
    progressiveResolutionHeightFraction: number;
    foveatedScreenSpaceError: boolean;
    foveatedMinimumScreenSpaceErrorRelaxation: number;
  };
  model: {
    minimumPixelSize: number;
    maximumScale: number;
  };
  postProcessing: {
    bloom: boolean;
    hdr: boolean;
    exposure: number;
    bloomBrightness: number;
  };
  atmosphere: {
    perFragmentAtmosphere: boolean;
  };
  preloading: {
    enableAssetCaching: boolean;
    enableModelPreloading: boolean;
  };
}