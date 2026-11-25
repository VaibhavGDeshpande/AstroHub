// Sky math for the Stellarium-style view: J2000 catalog -> local horizon -> stereographic screen projection.
// Frames: catalog vectors are J2000 equatorial; the view works in ENU (x = East, y = North, z = Up).
import * as A from 'astronomy-engine';

export const DEG = Math.PI / 180;
export type Vec3 = [number, number, number];
export type Site = { lat: number; lon: number };

export const eqVec = (raDeg: number, decDeg: number): Vec3 => {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
};

export const enuFromAltAz = (azDeg: number, altDeg: number): Vec3 => {
  const az = azDeg * DEG, alt = altDeg * DEG;
  return [Math.sin(az) * Math.cos(alt), Math.cos(az) * Math.cos(alt), Math.sin(alt)];
};

export const altAzOf = (v: Vec3) => ({
  alt: Math.asin(Math.max(-1, Math.min(1, v[2]))) / DEG,
  az: ((Math.atan2(v[0], v[1]) / DEG) + 360) % 360,
});

// J2000 equatorial -> ENU for this moment and place (includes precession and nutation).
export function horizonMatrix(date: Date, site: Site) {
  const r = A.Rotation_EQJ_HOR(date, new A.Observer(site.lat, site.lon, 0)).rot;
  // astronomy-engine HOR is x = North, y = West, z = Zenith; RotateVector uses column-major rot[j][i].
  return (v: Vec3, out: Vec3 = [0, 0, 0]): Vec3 => {
    const n = r[0][0] * v[0] + r[1][0] * v[1] + r[2][0] * v[2];
    const w = r[0][1] * v[0] + r[1][1] * v[1] + r[2][1] * v[2];
    out[0] = -w;
    out[1] = n;
    out[2] = r[0][2] * v[0] + r[1][2] * v[1] + r[2][2] * v[2];
    return out;
  };
}

// Atmospheric refraction (Saemundsson): lifts objects near the horizon by up to ~0.6°.
export function refract(v: Vec3): Vec3 {
  const alt = Math.asin(Math.max(-1, Math.min(1, v[2]))) / DEG;
  if (alt < -2) return v;
  const lifted = (alt + 1.02 / Math.tan((alt + 10.3 / (alt + 5.11)) * DEG) / 60) * DEG;
  const h = Math.hypot(v[0], v[1]) || 1;
  const c = Math.cos(lifted) / h;
  return [v[0] * c, v[1] * c, Math.sin(lifted)];
}

export type View = { az: number; alt: number; fov: number; width: number; height: number };
export type Projected = { x: number; y: number; s: number }; // s = pixels per degree at that point

// Stereographic projection centred on the view direction, zenith up (like Stellarium's default).
export function makeProjector(view: View) {
  const az = view.az * DEG, alt = view.alt * DEG;
  const f: Vec3 = [Math.sin(az) * Math.cos(alt), Math.cos(az) * Math.cos(alt), Math.sin(alt)];
  const r: Vec3 = [Math.cos(az), -Math.sin(az), 0];
  const u: Vec3 = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  // The horizontal field of view spans the screen width.
  const R = view.width / 2 / (2 * Math.tan((view.fov * DEG) / 4));
  const cx = view.width / 2, cy = view.height / 2;
  return (v: Vec3): Projected | null => {
    const d = v[0] * f[0] + v[1] * f[1] + v[2] * f[2];
    if (d < -0.95) return null; // too close to the point behind the viewer, where stereographic blows up
    const k = 2 / (1 + d);
    return {
      x: cx + (v[0] * r[0] + v[1] * r[1] + v[2] * r[2]) * k * R,
      y: cy - (v[0] * u[0] + v[1] * u[1] + v[2] * u[2]) * k * R,
      s: k * R * DEG,
    };
  };
}

// Stereographic projection maps circles to circles, so a circle of constant altitude is an exact screen circle
// (or a straight line when it passes through the point behind the viewer).
export type ScreenCircle =
  | { kind: 'circle'; cx: number; cy: number; r: number; aboveInside: boolean }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; aboveSide: number };

export function altitudeCircle(project: ReturnType<typeof makeProjector>, view: View, altDeg: number): ScreenCircle | null {
  const p1 = project(enuFromAltAz(view.az, altDeg));
  const p2 = project(enuFromAltAz(view.az + 90, altDeg));
  const p3 = project(enuFromAltAz(view.az - 90, altDeg));
  const zenith = project([0, 0, 1]);
  if (!p1 || !p2 || !p3 || !zenith) return null;
  const det = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
  const side = (x: number, y: number) => Math.sign((p3.x - p2.x) * (y - p2.y) - (p3.y - p2.y) * (x - p2.x));
  if (Math.abs(det) < 1e-6) {
    return { kind: 'line', x1: p2.x, y1: p2.y, x2: p3.x, y2: p3.y, aboveSide: side(zenith.x, zenith.y) };
  }
  const s1 = p1.x ** 2 + p1.y ** 2, s2 = p2.x ** 2 + p2.y ** 2, s3 = p3.x ** 2 + p3.y ** 2;
  const cx = (s1 * (p2.y - p3.y) + s2 * (p3.y - p1.y) + s3 * (p1.y - p2.y)) / det;
  const cy = (s1 * (p3.x - p2.x) + s2 * (p1.x - p3.x) + s3 * (p2.x - p1.x)) / det;
  const r = Math.hypot(p1.x - cx, p1.y - cy);
  if (r > 1e5) return { kind: 'line', x1: p2.x, y1: p2.y, x2: p3.x, y2: p3.y, aboveSide: side(zenith.x, zenith.y) };
  return { kind: 'circle', cx, cy, r, aboveInside: Math.hypot(zenith.x - cx, zenith.y - cy) < r };
}

// Solar system bodies, apparent position for the observer (with refraction), brightness and phase.
export const BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const;
export type BodyName = (typeof BODIES)[number];
export type BodyState = {
  name: BodyName; v: Vec3; alt: number; az: number; raHours: number; dec: number;
  mag: number; phaseAngle: number; illuminated: number; distAu: number;
};

export function bodyStates(date: Date, site: Site): BodyState[] {
  const observer = new A.Observer(site.lat, site.lon, 0);
  return BODIES.map((name) => {
    const body = A.Body[name];
    const eq = A.Equator(body, date, observer, true, true);
    const hor = A.Horizon(date, observer, eq.ra, eq.dec, 'normal');
    let mag = -26.7, phaseAngle = 0, illuminated = 1;
    if (name !== 'Sun') {
      const ill = A.Illumination(body, date);
      mag = ill.mag;
      phaseAngle = ill.phase_angle;
      illuminated = ill.phase_fraction;
    }
    return {
      name, v: enuFromAltAz(hor.azimuth, hor.altitude), alt: hor.altitude, az: hor.azimuth,
      raHours: eq.ra, dec: eq.dec, mag, phaseAngle, illuminated, distAu: eq.dist,
    };
  });
}

// Star colour from B-V colour index.
const BV_STOPS: [number, [number, number, number]][] = [
  [-0.4, [155, 176, 255]], [0, [202, 215, 255]], [0.3, [248, 247, 255]], [0.6, [255, 244, 234]],
  [0.9, [255, 222, 180]], [1.3, [255, 190, 120]], [2.0, [255, 150, 80]],
];
export function bvColor(bv: number): [number, number, number] {
  if (bv <= BV_STOPS[0][0]) return BV_STOPS[0][1];
  for (let i = 1; i < BV_STOPS.length; i++) {
    const [b1, c1] = BV_STOPS[i];
    if (bv <= b1) {
      const [b0, c0] = BV_STOPS[i - 1];
      const t = (bv - b0) / (b1 - b0);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * t)) as [number, number, number];
    }
  }
  return BV_STOPS[BV_STOPS.length - 1][1];
}

// Sky colour and star visibility by Sun altitude: night, the three twilights, then day.
const SKY_KEYS: [number, [number, number, number], [number, number, number], number][] = [
  // sunAlt, zenith rgb, horizon rgb, star visibility 0..1
  [-18, [2, 4, 12], [10, 16, 34], 1],
  [-12, [5, 10, 28], [22, 34, 70], 0.95],
  [-6, [14, 28, 70], [70, 80, 130], 0.6],
  [-2, [30, 60, 120], [190, 130, 110], 0.15],
  [3, [50, 105, 190], [170, 200, 235], 0],
  [20, [40, 100, 200], [150, 195, 240], 0],
];
export function skyState(sunAlt: number) {
  const k = SKY_KEYS;
  if (sunAlt <= k[0][0]) return { zenith: k[0][1], horizon: k[0][2], stars: k[0][3] };
  for (let i = 1; i < k.length; i++) {
    if (sunAlt <= k[i][0]) {
      const t = (sunAlt - k[i - 1][0]) / (k[i][0] - k[i - 1][0]);
      const mix = (a: number[], b: number[]) => a.map((x, j) => Math.round(x + (b[j] - x) * t)) as [number, number, number];
      return { zenith: mix(k[i - 1][1], k[i][1]), horizon: mix(k[i - 1][2], k[i][2]), stars: k[i - 1][3] + (k[i][3] - k[i - 1][3]) * t };
    }
  }
  const last = k[k.length - 1];
  return { zenith: last[1], horizon: last[2], stars: last[3] };
}

// Faintest magnitude drawn: more stars as you zoom in, fewer as the sky brightens.
export function limitingMagnitude(fov: number, starVisibility: number) {
  if (starVisibility < 0.05) return -Infinity;
  const base = fov <= 60 ? 6.0 : fov >= 180 ? 5.0 : 6.0 - ((fov - 60) / 120);
  return base - (1 - starVisibility) * 6;
}

export const formatRA = (hours: number) => {
  const h = ((hours % 24) + 24) % 24;
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60), ss = Math.round(((h - hh) * 60 - mm) * 60);
  return `${hh}h ${String(mm).padStart(2, '0')}m ${String(ss).padStart(2, '0')}s`;
};
export const formatDeg = (deg: number, signed = true) => {
  const sign = deg < 0 ? '−' : signed ? '+' : '';
  const a = Math.abs(deg), d = Math.floor(a), m = Math.round((a - d) * 60);
  return `${sign}${d}° ${String(m).padStart(2, '0')}′`;
};
