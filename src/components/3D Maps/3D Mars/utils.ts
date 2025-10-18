import * as Cesium from 'cesium';
import { RoverEntity } from './types';
import { ROVER_MODELS } from './constants';
import { getPerformanceConfig } from './performanceConfig';

// Memoized utility functions
export const createWidthCallbackProperty = (() => {
  const cache = new WeakMap<Cesium.NearFarScalar, Cesium.CallbackProperty>();
  
  return (nearFarScalar: Cesium.NearFarScalar, viewer: Cesium.Viewer): Cesium.CallbackProperty => {
    if (cache.has(nearFarScalar)) {
      return cache.get(nearFarScalar)!;
    }
    
    const callback = new Cesium.CallbackProperty(function () {
      const distance = viewer.camera.positionCartographic.height;
      let t = (distance - nearFarScalar.near) / (nearFarScalar.far - nearFarScalar.near);
      t = Cesium.Math.clamp(t, 0.0, 1.0);
      return Cesium.Math.lerp(nearFarScalar.nearValue, nearFarScalar.farValue, t);
    }, false);
    
    cache.set(nearFarScalar, callback);
    return callback;
  };
})();

export const createJulianDateToSolConverter = (
  startJulianDate: Cesium.JulianDate,
  startSol: number
): ((julianDate: Cesium.JulianDate) => string) => {
  const secondsPerSol = 24 * 60 * 60 + 39 * 60 + 35;
  
  return function (julianDate: Cesium.JulianDate): string {
    const differenceInSeconds = Cesium.JulianDate.secondsDifference(julianDate, startJulianDate);
    const solNumber = Math.floor(differenceInSeconds / secondsPerSol) + startSol;
    return `Sol ${solNumber}`;
  };
};

export const createRoverModel = (
  name: string, 
  position: Cesium.Cartesian3, 
  viewer: Cesium.Viewer
): Cesium.Entity | null => {
  if (!ROVER_MODELS[name]) return null;

  const perfConfig = getPerformanceConfig();
  const modelConfig = ROVER_MODELS[name];

  try {
    const entity = viewer.entities.add({
      name: `${name} Model`,
      position: position,
      orientation: Cesium.Transforms.headingPitchRollQuaternion(
        position,
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(modelConfig.heading || 0),
          0,
          0
        )
      ),
      model: {
        uri: modelConfig.modelPath,
        minimumPixelSize: perfConfig.model.minimumPixelSize,
        maximumScale: perfConfig.model.maximumScale,
        scale: modelConfig.scale,
        lightColor: Cesium.Color.WHITE,
        shadows: Cesium.ShadowMode.DISABLED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }
    });

    return entity;
  } catch (error) {
    console.error(`Error creating model for ${name}:`, error);
    return null;
  }
};

export const updateRoverModelPosition = (
  roverName: string, 
  roverEntity: RoverEntity, 
  modelEntity: Cesium.Entity, 
  clock: Cesium.Clock
): void => {
  if (!roverEntity || !clock) return;

  const currentTime = clock.currentTime;
  const position = roverEntity.position?.getValue(currentTime);

  if (position) {
    modelEntity.position = new Cesium.CallbackProperty(() => {
      const time = clock.currentTime;
      if (time && roverEntity.position) {
        return roverEntity.position.getValue(time);
      }
      return position;
    }, false) as unknown as Cesium.PositionProperty;

    if (roverEntity.orientation) {
      modelEntity.orientation = new Cesium.CallbackProperty(() => {
        const time = clock.currentTime;
        if (time && roverEntity.orientation) {
          return roverEntity.orientation.getValue(time);
        }
        return Cesium.Transforms.headingPitchRollQuaternion(
          position,
          new Cesium.HeadingPitchRoll(0, 0, 0)
        );
      }, false);
    }
  }
};

export const createCanvasAsTexture = (text: string): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#ffffff";

  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas;
};

// Cache for canvas textures to avoid recreating
const canvasTextureCache = new Map<string, HTMLCanvasElement>();

export const getCachedCanvasTexture = (text: string): HTMLCanvasElement => {
  if (canvasTextureCache.has(text)) {
    return canvasTextureCache.get(text)!;
  }
  
  const canvas = createCanvasAsTexture(text);
  canvasTextureCache.set(text, canvas);
  return canvas;
};