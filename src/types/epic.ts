// types/epic.ts
interface CentroidCoordinates {
  lat: number;
  lon: number;
}

interface J2000Position {
  x: number;
  y: number;
  z: number;
}

interface AttitudeQuaternions {
  q0: number;
  q1: number;
  q2: number;
  q3: number;
}

interface EPICCoordinates {
  centroid_coordinates: CentroidCoordinates;
  dscovr_j2000_position: J2000Position;
  lunar_j2000_position: J2000Position;
  sun_j2000_position: J2000Position;
  attitude_quaternions: AttitudeQuaternions;
}

export interface EPICImage extends EPICCoordinates {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  coords: EPICCoordinates;
}

export type EPICResponse = EPICImage[];

export type { EPICCoordinates, CentroidCoordinates, J2000Position, AttitudeQuaternions };
