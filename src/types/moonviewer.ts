import * as Cesium from 'cesium';

export interface ViewerWithControls extends Cesium.Viewer {
  flyToLocations?: {
    seaOfTranquility: () => void;
    apollo11: () => void;
    copernicus: () => void;
    tycho: () => void;
    shackleton: () => void;
    toggleBoundaries: (show: boolean) => void;
  };
}

export interface PointOfInterest {
  text: string;
  latitude: number;
  longitude: number;
}

export interface LocationConfig {
  destination: Cesium.Cartesian3 | Cesium.Rectangle;
  orientation: {
    direction: Cesium.Cartesian3;
    up: Cesium.Cartesian3;
  };
  easingFunction: Cesium.EasingFunction.Callback;
}
