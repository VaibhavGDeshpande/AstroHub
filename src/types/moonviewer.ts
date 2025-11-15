import * as Cesium from 'cesium';

export type MoonLocationId =
  | 'seaOfTranquility'
  | 'apollo11'
  | 'apollo12'
  | 'apollo14'
  | 'apollo15'
  | 'apollo16'
  | 'apollo17'
  | 'copernicus'
  | 'tycho'
  | 'mareImbrium'
  | 'mareCrisium'
  | 'aristarchus'
  | 'orientale'
  | 'shackleton';

export type LocationCategory =
  | 'Apollo Missions'
  | 'Maria & Basins'
  | 'Craters & Highlands'
  | 'Polar Regions'
  | 'Other Features';

export type FlyToLocationOptions = {
  onComplete?: () => void;
};

export type FlyToLocationHandler = (options?: FlyToLocationOptions) => void;

export interface ViewerWithControls extends Cesium.Viewer {
  flyToLocations?: Record<MoonLocationId, FlyToLocationHandler>;
}

export interface PointOfInterest {
  text: string;
  latitude: number;
  longitude: number;
}

export interface LocationConfig {
  target: {
    latitude: number;
    longitude: number;
    height?: number;
  };
  range?: number;
  headingDeg?: number;
  pitchDeg?: number;
  boundingRadius?: number;
  duration?: number;
  easingFunction?: Cesium.EasingFunction.Callback;
}
