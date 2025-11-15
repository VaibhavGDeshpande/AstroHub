import * as Cesium from 'cesium';
import {
  MoonLocationId,
  PointOfInterest,
  LocationConfig,
  LocationCategory,
} from '../../../types/moonviewer';

type LocationDefinition = {
  id: MoonLocationId;
  name: string;
  latitude: number;
  longitude: number;
  range?: number;
  headingDeg?: number;
  pitchDeg?: number;
  duration?: number;
  description?: string;
  showLabel?: boolean;
  targetHeight?: number;
  boundingRadius?: number;
  category?: LocationCategory;
  infoSnippet?: string;
  infoDetails?: string;
  wikiUrl?: string;
  customConfig?: LocationConfig;
};

const DEFAULT_RANGE = 180_000;
const DEFAULT_DURATION = 4;
const DEFAULT_PITCH = -55;
const DEFAULT_BOUNDING_RADIUS = 45_000;
const DEFAULT_EASING = Cesium.EasingFunction.LINEAR_NONE;

const createLocationConfig = (definition: LocationDefinition): LocationConfig => {
  if (definition.customConfig) {
    return definition.customConfig;
  }

  return {
    target: {
      latitude: definition.latitude,
      longitude: definition.longitude,
      height: definition.targetHeight ?? 0,
    },
    range: definition.range ?? DEFAULT_RANGE,
    headingDeg: definition.headingDeg,
    pitchDeg: definition.pitchDeg ?? DEFAULT_PITCH,
    duration: definition.duration ?? DEFAULT_DURATION,
    boundingRadius: definition.boundingRadius ?? DEFAULT_BOUNDING_RADIUS,
    easingFunction: DEFAULT_EASING,
  };
};

const locationDefinitions: LocationDefinition[] = [
  {
    id: 'seaOfTranquility',
    name: 'Sea of Tranquility',
    latitude: 8.5,
    longitude: 31.4,
    range: 260_000,
    pitchDeg: -65,
    boundingRadius: 90_000,
    category: 'Maria & Basins',
    description: 'Mare Tranquillitatis basalt plain',
    infoSnippet:
      'One of the basaltic lunar maria formed by ancient volcanic eruptions and home to the Apollo 11 landing site.',
    infoDetails:
      'Mare Tranquillitatis—Sea of Tranquility—is a vast basalt plain created by ancient volcanic flows. Its smooth surface made it an ideal landing spot for the first crewed mission to touch the Moon in 1969.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mare_Tranquillitatis',
  },
  {
    id: 'apollo11',
    name: 'Apollo 11 - Tranquility Base',
    latitude: 0.67408,
    longitude: 23.47297,
    range: 70_000,
    pitchDeg: -80,
    boundingRadius: 18_000,
    category: 'Apollo Missions',
    description: 'First human landing (1969)',
    infoSnippet:
      'Neil Armstrong and Buzz Aldrin landed here on July 20, 1969, marking humanity’s first steps on the Moon.',
    infoDetails:
      'Tranquility Base hosted NASA’s Apollo 11 lunar module Eagle. The landing proved humans could visit another world, and Armstrong’s iconic “small step” was broadcast across Earth from this patch of lunar regolith.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_11',
  },
  {
    id: 'apollo12',
    name: 'Apollo 12 - Oceanus Procellarum',
    latitude: -3.01239,
    longitude: -23.42157,
    range: 70_000,
    pitchDeg: -78,
    boundingRadius: 20_000,
    category: 'Apollo Missions',
    description: 'Second human landing (1969)',
    infoSnippet:
      'Crewed by Pete Conrad and Alan Bean, Apollo 12 targeted a precise landing near Surveyor 3 to test pinpoint accuracy.',
    infoDetails:
      'Apollo 12 touched down in Oceanus Procellarum just 160 meters from the Surveyor 3 probe, demonstrating pinpoint landing capability. The crew retrieved parts of Surveyor for engineering analysis back on Earth.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_12',
  },
  {
    id: 'apollo14',
    name: 'Apollo 14 - Fra Mauro',
    latitude: -3.6453,
    longitude: -17.4714,
    range: 70_000,
    pitchDeg: -78,
    boundingRadius: 20_000,
    category: 'Apollo Missions',
    description: 'Fra Mauro highlands (1971)',
    infoSnippet:
      'Apollo 14 explored the rugged Fra Mauro formation, collecting breccia samples to study lunar impact history.',
    infoDetails:
      'Alan Shepard and Edgar Mitchell roamed the Fra Mauro highlands, a blanket of ejecta from the Imbrium impact. Samples gathered here helped confirm the violent origins of much of the lunar surface.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_14',
  },
  {
    id: 'apollo15',
    name: 'Apollo 15 - Hadley Rille',
    latitude: 26.13222,
    longitude: 3.63386,
    range: 80_000,
    pitchDeg: -75,
    boundingRadius: 25_000,
    category: 'Apollo Missions',
    description: 'Hadley-Apennine site (1971)',
    infoSnippet:
      'Apollo 15 landed near Hadley Rille and the Apennine Mountains, enabling the first use of the Lunar Roving Vehicle.',
    infoDetails:
      'The rugged Hadley-Apennine region offered dramatic slopes and the meandering Hadley Rille. Apollo 15’s crew used the first Lunar Roving Vehicle to travel farther and collect diverse geologic samples.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_15',
  },
  {
    id: 'apollo16',
    name: 'Apollo 16 - Descartes Highlands',
    latitude: -8.97309,
    longitude: 15.50111,
    range: 80_000,
    pitchDeg: -75,
    boundingRadius: 22_000,
    category: 'Apollo Missions',
    description: 'Descartes Highlands (1972)',
    infoSnippet:
      'Apollo 16 sampled the Descartes Highlands to investigate volcanic versus impact origins of lunar highland material.',
    infoDetails:
      'Apollo 16 targeted the Descartes Highlands to investigate whether highland material was volcanic or breccia formed by impacts. Samples revealed breccias dominate, reshaping theories about the lunar crust.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_16',
  },
  {
    id: 'apollo17',
    name: 'Apollo 17 - Taurus-Littrow',
    latitude: 20.1908,
    longitude: 30.7717,
    range: 75_000,
    pitchDeg: -78,
    boundingRadius: 24_000,
    category: 'Apollo Missions',
    description: 'Final Apollo landing (1972)',
    infoSnippet:
      'Apollo 17 astronauts explored the Taurus-Littrow valley, returning the most lunar samples of any mission.',
    infoDetails:
      'Apollo 17’s astronauts Gene Cernan and Harrison Schmitt, the first scientist on the Moon, explored the Taurus-Littrow valley’s dark volcanic deposits and bright highland slopes before returning 110 kg of samples.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_17',
  },
  {
    id: 'copernicus',
    name: 'Copernicus Crater',
    latitude: 9.62,
    longitude: -20.08,
    range: 220_000,
    pitchDeg: -60,
    boundingRadius: 70_000,
    category: 'Craters & Highlands',
    description: 'Young prominent impact crater',
    infoSnippet:
      'Copernicus is a 93 km wide impact crater with terraced walls and central peaks, easily visible from Earth.',
    infoDetails:
      'Copernicus crater is a showcase for complex impact features: terraced walls, massive ejecta blankets, and central peaks rising 1,200 meters. Its young rays streak hundreds of kilometers across the lunar surface.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Copernicus_(lunar_crater)',
  },
  {
    id: 'tycho',
    name: 'Tycho Crater',
    latitude: -43.31,
    longitude: -11.36,
    range: 240_000,
    pitchDeg: -58,
    boundingRadius: 90_000,
    category: 'Craters & Highlands',
    description: 'Bright rayed crater in south',
    infoSnippet:
      'Tycho’s brilliant ray system extends over 1,500 km, making it one of the Moon’s most striking craters.',
    infoDetails:
      'Tycho spans 85 km with a central peak nearly 2 km high. The crater’s brilliant ray system formed roughly 100 million years ago and is best viewed during a full Moon when sunlight highlights the ejecta.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tycho_(lunar_crater)',
  },
  {
    id: 'mareImbrium',
    name: 'Mare Imbrium',
    latitude: 32.8,
    longitude: -15.6,
    range: 320_000,
    pitchDeg: -55,
    boundingRadius: 160_000,
    category: 'Maria & Basins',
    description: 'Sea of Rains lava plain',
    infoSnippet:
      'Mare Imbrium formed from a massive impact basin later flooded by lava, bordered by towering mountain ranges.',
    infoDetails:
      'Mare Imbrium is one of the largest impact basins in the Solar System. Later lava floods smoothed its floor, while surrounding ranges such as the Montes Apenninus mark the edges of the colossal impact.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mare_Imbrium',
  },
  {
    id: 'mareCrisium',
    name: 'Mare Crisium',
    latitude: 17.0,
    longitude: 59.1,
    range: 300_000,
    pitchDeg: -55,
    boundingRadius: 130_000,
    category: 'Maria & Basins',
    description: 'Sea of Crises lava basin',
    infoSnippet:
      'Mare Crisium is an isolated circular basin with darker basalt, often used as a navigation landmark.',
    infoDetails:
      'The Sea of Crises is a 555 km wide circular basin bordered by steep scarps. Its isolated, dark basalt plain stands out from surrounding highlands, making it a well-known feature through backyard telescopes.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mare_Crisium',
  },
  {
    id: 'aristarchus',
    name: 'Aristarchus Plateau',
    latitude: 23.7,
    longitude: -47.5,
    range: 220_000,
    pitchDeg: -62,
    boundingRadius: 55_000,
    category: 'Craters & Highlands',
    description: 'Luminous crater & plateau',
    infoSnippet:
      'The Aristarchus Plateau hosts volcanic rilles and Aristarchus crater, one of the brightest spots on the Moon.',
    infoDetails:
      'Aristarchus Plateau contains the intensely bright Aristarchus crater and the sinuous Vallis Schröteri rille, evidence of past volcanic and tectonic activity that still intrigues lunar scientists today.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Aristarchus_(crater)',
  },
  {
    id: 'orientale',
    name: 'Orientale Basin',
    latitude: -19.4,
    longitude: -92.8,
    range: 320_000,
    pitchDeg: -55,
    boundingRadius: 150_000,
    category: 'Maria & Basins',
    description: 'Multi-ring impact basin',
    infoSnippet:
      'Orientale is a spectacular multi-ring impact basin on the lunar limb, revealing concentric mountain rings.',
    infoDetails:
      'Mare Orientale’s bulls-eye pattern of mountain rings formed when a massive asteroid struck the Moon’s western limb. Because it sits near the edge of the Moon as seen from Earth, spacecraft images reveal its full beauty.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mare_Orientale',
  },
  {
    id: 'shackleton',
    name: 'Shackleton Crater',
    latitude: -89.9,
    longitude: 0,
    description: 'South pole crater with ice deposits',
    category: 'Polar Regions',
    infoSnippet:
      'Shackleton lies at the lunar south pole where peaks receive near-constant sunlight and floors harbor water ice.',
    infoDetails:
      'Shackleton crater’s rim basks in near-constant sunlight while the floor remains in permanent darkness. These cold traps likely store water ice, making the region prime territory for future exploration bases.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Shackleton_(crater)',
    customConfig: {
      target: {
        latitude: -89.9,
        longitude: 0,
      },
      range: 160_000,
      headingDeg: 0,
      pitchDeg: -35,
      boundingRadius: 80_000,
      duration: 5,
      easingFunction: Cesium.EasingFunction.LINEAR_NONE,
    },
  },
];

export const pointsOfInterest: PointOfInterest[] = locationDefinitions
  .filter((definition) => definition.showLabel !== false)
  .map((definition) => ({
    text: definition.name,
    latitude: definition.latitude,
    longitude: definition.longitude,
  }));

export type MoonLocationOption = {
  id: MoonLocationId;
  name: string;
  description?: string;
  category?: LocationCategory;
  infoSnippet?: string;
  infoDetails?: string;
  wikiUrl?: string;
};

export const moonLocationOptions: MoonLocationOption[] = locationDefinitions.map(
  ({ id, name, description, category, infoSnippet, infoDetails, wikiUrl }) => ({
    id,
    name,
    description,
    category,
    infoSnippet,
    infoDetails,
    wikiUrl,
  }),
);

export const moonLocationOptionsMap = moonLocationOptions.reduce(
  (acc, option) => {
    acc[option.id] = option;
    return acc;
  },
  {} as Record<MoonLocationId, MoonLocationOption>,
);

export const locationConfigs: Record<MoonLocationId, LocationConfig> =
  locationDefinitions.reduce((acc, definition) => {
    acc[definition.id] = createLocationConfig(definition);
    return acc;
  }, {} as Record<MoonLocationId, LocationConfig>);
