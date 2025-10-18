export const CESIUM_BASE_URL = "/cesium";
export const CESIUM_ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZmUyMDU3NS0wYTk5LTQ0ZjQtYmEzNi04NjllYTU3ZmE4ZTkiLCJpZCI6MzQwOTc4LCJpYXQiOjE3NTc3NzE3MDh9.p9lg0P5Rb9zgLUib_NE5qEYNCWwt_FyDFW5Ok2EQgUw";

export const ROVER_MODELS: { [key: string]: { modelPath: string; scale: number; heading?: number } } = {
  'Curiosity': {
    modelPath: '/models/Mars/Curiosity.glb',
    scale: 1.0,
    heading: 0
  },
  'Perseverance': {
    modelPath: '/models/Mars/Perseverance.glb',
    scale: 1.0,
    heading: 0
  }
};

export const TILESET_ION_ASSET_ID = 3644333;
export const DATA_URLS = {
  CZML: "../../SampleData/Mars.czml",
  GEOJSON: "../../SampleData/MarsPointsofInterest.geojson"
};

export const CACHE_KEYS = {
  CZML: 'Mars.czml',
  GEOJSON: 'MarsPointsofInterest.geojson'
};