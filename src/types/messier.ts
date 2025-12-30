export interface MessierObject {
  messierNumber: number;
  name: string;
  alternateNames: string[];
  NGC?: string;
  type: string;
  constellation: string;
  rightAscension: string;
  declination: string;
  magnitude: number;
  size: string;
  distance: number;
  viewingSeason: string;
  viewingDifficulty: string;
  image: string;
}

export interface MessierEntry extends MessierObject {
  id: string; // e.g. "M1"
}

export interface MessierInfo {
  description?: string;
  credit?: string;
  license?: string;
  notice?: string;
}

export interface MessierApiResponse {
  success: boolean;
  data: MessierEntry[];
  info?: MessierInfo | null;
  error?: string;
}
