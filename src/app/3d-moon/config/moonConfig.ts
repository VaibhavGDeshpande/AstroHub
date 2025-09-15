import * as Cesium from 'cesium';
import { PointOfInterest, LocationConfig } from '../../../types/moonviewer';

export const pointsOfInterest: PointOfInterest[] = [
  {
    text: "Apollo 11",
    latitude: 0.67416,
    longitude: 23.47315,
  },
  // {
  //   text: "Apollo 14",
  //   latitude: -3.64417,
  //   longitude: 342.52135,
  // },
  // {
  //   text: "Apollo 15",
  //   latitude: 26.13341,
  //   longitude: 3.6285,
  // },
  // {
  //   text: "Lunokhod 1",
  //   latitude: 38.2378,
  //   longitude: -35.0017,
  // },
  // {
  //   text: "Lunokhod 2",
  //   latitude: 25.83232,
  //   longitude: 30.92215,
  // },
];

export const locationConfigs: Record<string, LocationConfig> = {
  seaOfTranquility: {
    destination: new Cesium.Cartesian3(
      2134594.9298812235,
      1256488.0678322134,
      379606.9284823841,
    ),
    orientation: {
      direction: new Cesium.Cartesian3(
        -0.8518395698371783,
        -0.5014189063342804,
        -0.1514873843927112,
      ),
      up: new Cesium.Cartesian3(
        -0.13054959630640847,
        -0.07684549781463353,
        0.9884591910493093,
      ),
    },
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
  },
  apollo11: {
    destination: new Cesium.Cartesian3(
      1609100.311044896,
      733266.0643925276,
      53608.976740262646,
    ),
    orientation: {
      direction: new Cesium.Cartesian3(
        -0.41704286323660256,
        -0.7222280712427744,
        -0.5517806297183315,
      ),
      up: new Cesium.Cartesian3(
        0.8621189850799429,
        -0.12210806245903304,
        -0.49177278965720556,
      ),
    },
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
  },
  copernicus: {
    destination: new Cesium.Cartesian3(
      1613572.8201475781,
      -677039.3827805589,
      339559.7958496013,
    ),
    orientation: {
      direction: new Cesium.Cartesian3(
        -0.10007925201262617,
        0.8771366500325052,
        -0.4696971795597116,
      ),
      up: new Cesium.Cartesian3(
        0.9948921707513932,
        0.08196514973381885,
        -0.058917593354560566,
      ),
    },
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
  },
  tycho: {
    destination: new Cesium.Cartesian3(
      1368413.3560818078,
      -166198.00035620513,
      -1203576.7397013502,
    ),
    orientation: {
      direction: new Cesium.Cartesian3(
        -0.8601315724135887,
        -0.5073902275496569,
        0.05223825345888711,
      ),
      up: new Cesium.Cartesian3(
        0.2639103814694499,
        -0.5303301783281616,
        -0.8056681776681204,
      ),
    },
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
  },
  shackleton: {
    destination: Cesium.Rectangle.fromBoundingSphere(
      new Cesium.BoundingSphere(
        new Cesium.Cartesian3(
          -17505.087036391753,
          38147.40236305639,
          -1769721.5748224584,
        ),
        40000.0,
      ),
    ),
    orientation: {
      direction: new Cesium.Cartesian3(
        0.2568703591904826,
        -0.6405212914728244,
        0.7237058060699372,
      ),
      up: new Cesium.Cartesian3(
        0.26770932874967773,
        -0.6723714327527822,
        -0.6901075073627064,
      ),
    },
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
  },
};
