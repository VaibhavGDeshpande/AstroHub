// Canvas renderer for the Stellarium-style sky view. Pure drawing: the React component owns state and input.
import {
  altitudeCircle, bodyStates, bvColor, enuFromAltAz, eqVec, formatDeg, formatRA, horizonMatrix, limitingMagnitude,
  makeProjector, refract, skyState, type BodyName, type BodyState, type ScreenCircle, type Site, type Vec3, type View,
} from '@/lib/sky/skyEngine';

export type RawSky = {
  stars: { stars: number[][]; names: Record<string, string> };
  constellations: { lines: number[][][]; labels: (string | number)[][] };
  messier: (string | number | null)[][];
  milkyWay: number[][];
};

export type Catalog = ReturnType<typeof buildCatalog>;

export function buildCatalog(raw: RawSky) {
  const stars = raw.stars.stars.map(([ra, dec, mag, bv], i) => ({
    i, ra, dec, mag, v: eqVec(ra, dec), sprite: spriteIndex(bv), name: raw.stars.names[i] as string | undefined,
  }));
  return {
    stars,
    lines: raw.constellations.lines.map((l) => l.map(([ra, dec]) => eqVec(ra, dec))),
    constellations: raw.constellations.labels.map(([name, ra, dec]) => ({ name: name as string, ra: ra as number, dec: dec as number, v: eqVec(ra as number, dec as number) })),
    messier: raw.messier.map(([id, name, type, mag, ra, dec]) => ({
      id: id as string, name: name as string, type: type as string, mag: mag as number | null, ra: ra as number, dec: dec as number, v: eqVec(ra as number, dec as number),
    })),
    milkyWay: raw.milkyWay.map(([ra, dec, level]) => ({ v: eqVec(ra, dec), level })),
  };
}

export type Layers = {
  constellationLines: boolean; constellationNames: boolean; starLabels: boolean; deepSky: boolean;
  milkyWay: boolean; grid: boolean; ground: boolean; atmosphere: boolean; cardinals: boolean;
};

export type Selection =
  | { kind: 'star'; i: number } | { kind: 'body'; name: BodyName } | { kind: 'dso'; i: number } | { kind: 'con'; i: number };

export type Hit = { x: number; y: number; mag: number; sel: Selection };

export type Info = { title: string; subtitle: string; rows: [string, string][]; az: number; alt: number };

// --- sprites: soft star glows, one per colour bucket, drawn scaled (much faster than a gradient per star)
const BUCKETS = [-0.3, 0, 0.25, 0.5, 0.75, 1.0, 1.3, 1.7];
function spriteIndex(bv: number) {
  let best = 0;
  for (let k = 1; k < BUCKETS.length; k++) if (Math.abs(BUCKETS[k] - bv) < Math.abs(BUCKETS[best] - bv)) best = k;
  return best;
}
let spriteCache: HTMLCanvasElement[] | null = null;
function glowSprite(color: [number, number, number], core = true) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  const [r, gg, b] = color;
  if (core) grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(core ? 0.12 : 0, `rgba(${r},${gg},${b},1)`);
  grad.addColorStop(0.3, `rgba(${r},${gg},${b},0.35)`);
  grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}
function sprites() {
  return (spriteCache ??= [...BUCKETS.map((bv) => glowSprite(bvColor(bv))), glowSprite([150, 165, 200], false)]);
}
const MW_SPRITE = BUCKETS.length;

const rgb = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mixRgb = (a: number[], b: number[], t: number) => a.map((x, i) => Math.round(x + (b[i] - x) * t));

// Region of the sky above (or below) an altitude, as a canvas path. Exact because altitude circles stay circles.
function capPath(ctx: CanvasRenderingContext2D, c: ScreenCircle, above: boolean, w: number, h: number): CanvasFillRule {
  ctx.beginPath();
  if (c.kind === 'circle') {
    const inside = c.aboveInside === above;
    if (!inside) ctx.rect(-10, -10, w + 20, h + 20);
    ctx.moveTo(c.cx + c.r, c.cy);
    ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
    return 'evenodd';
  }
  // Straight horizon: a huge half-plane on the requested side.
  const dx = c.x2 - c.x1, dy = c.y2 - c.y1, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  // Same side test as altitudeCircle uses for the zenith: sign of cross(line, point - p1).
  let nx = -uy, ny = ux;
  const normalSide = Math.sign(ux * ny - uy * nx);
  if ((normalSide === c.aboveSide) !== above) { nx = -nx; ny = -ny; }
  const B = 1e5;
  ctx.moveTo(c.x1 - ux * B, c.y1 - uy * B);
  ctx.lineTo(c.x1 + ux * B, c.y1 + uy * B);
  ctx.lineTo(c.x1 + ux * B + nx * B, c.y1 + uy * B + ny * B);
  ctx.lineTo(c.x1 - ux * B + nx * B, c.y1 - uy * B + ny * B);
  ctx.closePath();
  return 'nonzero';
}

// Gentle hills on the horizon, in degrees of altitude, so the ground reads as a landscape.
const ridge = (az: number) => {
  const a = az * (Math.PI / 180);
  return Math.max(0, 1.1 + 0.9 * Math.sin(3 * a + 0.4) + 0.6 * Math.sin(7 * a + 1.3) + 0.35 * Math.sin(17 * a + 2.1) + 0.2 * Math.sin(41 * a));
};

const DSO_COLORS: Record<string, string> = { g: '#ff8a8a', n: '#7fdc8f', c: '#f2d96b', o: '#cfcfcf' };
const DSO_TYPES: Record<string, [string, string]> = {
  gg: ['g', 'Galaxy'], g: ['g', 'Galaxy'], s: ['g', 'Spiral galaxy'], sd: ['g', 'Spiral galaxy'], e: ['g', 'Elliptical galaxy'],
  i: ['g', 'Irregular galaxy'], l: ['g', 'Lenticular galaxy'], pn: ['n', 'Planetary nebula'], en: ['n', 'Emission nebula'],
  rn: ['n', 'Reflection nebula'], bn: ['n', 'Nebula'], snr: ['n', 'Supernova remnant'], sfr: ['n', 'Star-forming region'],
  dn: ['n', 'Dark nebula'], oc: ['c', 'Open cluster'], gc: ['c', 'Globular cluster'], ds: ['o', 'Double star'], as: ['o', 'Asterism'],
};
const dsoKind = (type: string) => DSO_TYPES[type] ?? ['o', 'Deep-sky object'];

const PLANET_COLORS: Record<string, string> = {
  Mercury: '#d8c8b4', Venus: '#fff6dc', Mars: '#ff9466', Jupiter: '#f6dfb8', Saturn: '#eedba2', Uranus: '#bdeef0', Neptune: '#8fb0ff',
};

type Project = ReturnType<typeof makeProjector>;

export type Frame = {
  ctx: CanvasRenderingContext2D; width: number; height: number; date: Date; site: Site; view: Omit<View, 'width' | 'height'>;
  layers: Layers; catalog: Catalog; selected: Selection | null;
};

export function drawSky(f: Frame): { hits: Hit[]; info: Info | null; sunAlt: number } {
  const { ctx, width: w, height: h, date, site, layers, catalog } = f;
  const view: View = { ...f.view, width: w, height: h };
  const project = makeProjector(view);
  const toHor = horizonMatrix(date, site);
  const bodies = bodyStates(date, site);
  const sun = bodies[0];
  const sky = skyState(sun.alt);
  const starVis = layers.atmosphere ? sky.stars : 1;
  const lim = limitingMagnitude(view.fov, starVis);
  const hits: Hit[] = [];
  const tmp: Vec3 = [0, 0, 0];
  const onScreen = (x: number, y: number, m = 40) => x > -m && y > -m && x < w + m && y < h + m;
  const hidden = (v: Vec3) => layers.ground && v[2] < -0.005;
  // Label density follows degrees per pixel, so a phone at 70° isn't as crowded as a monitor at 70°.
  const fovN = (view.fov * 800) / w;

  // 1. Sky background: bands of constant altitude from horizon colour to zenith colour.
  if (layers.atmosphere) {
    ctx.fillStyle = rgb(sky.horizon);
    ctx.fillRect(0, 0, w, h);
    for (const a of [1, 3, 5, 8, 11, 15, 20, 26, 33, 41, 50, 60, 72, 84]) {
      const c = altitudeCircle(project, view, a);
      if (!c) continue;
      ctx.fillStyle = rgb(mixRgb(sky.horizon, sky.zenith, Math.pow(a / 90, 0.45)));
      ctx.fill(capPath(ctx, c, true, w, h));
    }
    // Glow around the Sun in twilight and daytime.
    if (sun.alt > -14) {
      const p = project(sun.v);
      if (p) {
        const strength = Math.min(1, (sun.alt + 14) / 14);
        const R = 45 * p.s;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
        g.addColorStop(0, `rgba(255,214,160,${0.55 * strength})`);
        g.addColorStop(0.35, `rgba(255,170,110,${0.18 * strength})`);
        g.addColorStop(1, 'rgba(255,170,110,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    }
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
  }

  const sp = sprites();

  // 2. Milky Way: soft overlapping glows, brighter toward the core.
  if (layers.milkyWay && starVis > 0.3) {
    ctx.globalCompositeOperation = 'lighter';
    const alpha = [0, 0.05, 0.07, 0.09, 0.11, 0.13];
    for (const m of catalog.milkyWay) {
      const v = toHor(m.v, tmp);
      if (v[2] < -0.1 && layers.ground) continue;
      const p = project(v);
      if (!p || !onScreen(p.x, p.y, 200)) continue;
      const size = 4.2 * p.s;
      ctx.globalAlpha = alpha[m.level] * starVis;
      ctx.drawImage(sp[MW_SPRITE], p.x - size / 2, p.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // 3. Alt-azimuth grid.
  if (layers.grid) {
    ctx.strokeStyle = 'rgba(200,90,80,0.35)';
    ctx.lineWidth = 1;
    for (const a of [15, 30, 45, 60, 75]) {
      const c = altitudeCircle(project, view, a);
      if (!c || c.kind !== 'circle') continue;
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let az = 0; az < 360; az += 15) polyline(ctx, project, Array.from({ length: 31 }, (_, k) => enuFromAltAz(az, k * 3)));
  }

  // 4. Constellation lines.
  if (layers.constellationLines) {
    ctx.strokeStyle = `rgba(90,140,215,${0.35 + 0.3 * starVis})`;
    ctx.lineWidth = 1;
    for (const line of catalog.lines) polyline(ctx, project, line.map((v) => toHor(v, [0, 0, 0])), layers.ground);
  }

  // 5. Constellation names.
  if (layers.constellationNames) {
    ctx.font = '500 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(130,175,235,${0.45 + 0.4 * starVis})`;
    catalog.constellations.forEach((c, i) => {
      const v = toHor(c.v, tmp);
      if (hidden(v)) return;
      const p = project(v);
      if (!p || !onScreen(p.x, p.y, 0)) return;
      ctx.fillText(c.name.toUpperCase(), p.x, p.y);
      hits.push({ x: p.x, y: p.y, mag: 10, sel: { kind: 'con', i } });
    });
  }

  // 6. Deep-sky objects (Messier).
  if (layers.deepSky && starVis > 0.3) {
    ctx.lineWidth = 1.2;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    catalog.messier.forEach((m, i) => {
      if (fovN > 120 && (m.mag ?? 9) > 7) return;
      const v = toHor(m.v, tmp);
      if (hidden(v)) return;
      const p = project(v);
      if (!p || !onScreen(p.x, p.y)) return;
      const [k] = dsoKind(m.type);
      ctx.strokeStyle = ctx.fillStyle = DSO_COLORS[k];
      ctx.globalAlpha = 0.8 * starVis;
      ctx.beginPath();
      if (k === 'g') ctx.ellipse(p.x, p.y, 5, 3, -0.5, 0, Math.PI * 2);
      else if (k === 'n') ctx.rect(p.x - 4, p.y - 4, 8, 8);
      else ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.stroke();
      if (fovN < 90) ctx.fillText(m.id, p.x + 7, p.y + 4);
      ctx.globalAlpha = 1;
      hits.push({ x: p.x, y: p.y, mag: m.mag ?? 9, sel: { kind: 'dso', i } });
    });
  }

  // 7. Stars, brightest first; stop at the limiting magnitude.
  const zoom = Math.min(1.7, Math.max(1, Math.pow(60 / view.fov, 0.3)));
  const labelLim = fovN > 120 ? 1.0 : fovN > 60 ? 2.0 : fovN > 25 ? 3.2 : 4.5;
  const labels: [string, number, number][] = [];
  ctx.globalCompositeOperation = 'lighter';
  for (const s of catalog.stars) {
    if (s.mag > lim) break;
    let v = toHor(s.v, tmp);
    if (v[2] < 0.2) v = refract(v);
    if (hidden(v)) continue;
    const p = project(v);
    if (!p || !onScreen(p.x, p.y)) continue;
    const b = lim - s.mag;
    const r = (0.7 + b * 0.62) * zoom;
    const size = r * 5;
    ctx.globalAlpha = Math.min(1, 0.4 + b * 0.28) * Math.max(starVis, 0.25);
    ctx.drawImage(sp[s.sprite], p.x - size / 2, p.y - size / 2, size, size);
    hits.push({ x: p.x, y: p.y, mag: s.mag, sel: { kind: 'star', i: s.i } });
    if (layers.starLabels && s.name && s.mag < labelLim) labels.push([s.name, p.x + r + 4, p.y - r - 2]);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = `rgba(205,222,255,${0.5 + 0.45 * starVis})`;
  for (const [t, x, y] of labels) ctx.fillText(t, x, y);

  // 8. Sun, Moon and planets.
  for (const b of bodies) drawBody(ctx, b, sun, project, lim, layers, hits, hidden);

  // 9. Ground and landscape.
  const horizon = altitudeCircle(project, view, 0);
  if (layers.ground) {
    ctx.fillStyle = rgb(mixRgb([44, 58, 40], [7, 10, 9], layers.atmosphere ? sky.stars : 1));
    if (horizon) ctx.fill(capPath(ctx, horizon, false, w, h));
    ctx.beginPath();
    for (let az = 0; az < 360; az += 2) {
      const pts = [enuFromAltAz(az, -0.2), enuFromAltAz(az + 2.2, -0.2), enuFromAltAz(az + 2.2, ridge(az + 2)), enuFromAltAz(az, ridge(az))].map(project);
      if (pts.some((q) => !q)) continue;
      ctx.moveTo(pts[0]!.x, pts[0]!.y);
      for (const q of pts.slice(1)) ctx.lineTo(q!.x, q!.y);
      ctx.closePath();
    }
    ctx.fill();
  } else if (horizon) {
    ctx.strokeStyle = 'rgba(80,200,120,0.6)';
    ctx.lineWidth = 1.2;
    polyline(ctx, project, Array.from({ length: 181 }, (_, k) => enuFromAltAz(k * 2, 0)));
  }

  // 10. Cardinal points, Stellarium-style red letters on the horizon.
  if (layers.cardinals) {
    ctx.textAlign = 'center';
    const points: [string, number, boolean][] = [
      ['N', 0, true], ['NE', 45, false], ['E', 90, true], ['SE', 135, false], ['S', 180, true], ['SW', 225, false], ['W', 270, true], ['NW', 315, false],
    ];
    for (const [label, az, major] of points) {
      const p = project(enuFromAltAz(az, ridge(az) + 1.5));
      if (!p || !onScreen(p.x, p.y, 0)) continue;
      ctx.font = major ? '700 20px system-ui, sans-serif' : '600 13px system-ui, sans-serif';
      ctx.fillStyle = major ? '#ff5a3c' : 'rgba(255,120,90,0.85)';
      ctx.fillText(label, p.x, p.y);
    }
  }

  // 11. Selection reticle and info.
  const info = f.selected ? describe(f.selected, catalog, toHor, bodies) : null;
  if (info) {
    const p = project(enuFromAltAz(info.az, info.alt));
    if (p && onScreen(p.x, p.y)) drawReticle(ctx, p.x, p.y);
  }

  return { hits, info, sunAlt: sun.alt };
}

// Draws a polyline, lifting the pen where points fall behind the viewer (or below ground when it hides them).
function polyline(ctx: CanvasRenderingContext2D, project: Project, pts: Vec3[], clipGround = false) {
  ctx.beginPath();
  let pen = false;
  for (const v of pts) {
    const p = clipGround && v[2] < -0.02 ? null : project(v);
    if (!p) { pen = false; continue; }
    if (pen) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
    pen = true;
  }
  ctx.stroke();
}

function drawBody(
  ctx: CanvasRenderingContext2D, b: BodyState, sun: BodyState, project: Project, lim: number,
  layers: Layers, hits: Hit[], hidden: (v: Vec3) => boolean,
) {
  if (hidden(b.v)) return;
  const p = project(b.v);
  if (!p) return;
  const isPlanet = b.name !== 'Sun' && b.name !== 'Moon';
  if (isPlanet && b.mag > Math.max(lim + 1, -4.8)) return; // planets show in twilight but not in daylight
  hits.push({ x: p.x, y: p.y, mag: b.mag, sel: { kind: 'body', name: b.name } });

  if (b.name === 'Sun') {
    const r = Math.max(7, 0.27 * p.s);
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
    g.addColorStop(0, 'rgba(255,250,230,1)');
    g.addColorStop(0.2, 'rgba(255,240,200,0.9)');
    g.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.name === 'Moon') {
    const r = Math.max(6, 0.26 * p.s);
    // Point the lit limb at the Sun: screen direction of a small step from the Moon toward the Sun.
    const step: Vec3 = [b.v[0] + (sun.v[0] - b.v[0]) * 0.01, b.v[1] + (sun.v[1] - b.v[1]) * 0.01, b.v[2] + (sun.v[2] - b.v[2]) * 0.01];
    const q = project(step);
    const angle = q ? Math.atan2(q.y - p.y, q.x - p.x) : 0;
    const halo = ctx.createRadialGradient(p.x, p.y, r, p.x, p.y, r * 4);
    halo.addColorStop(0, `rgba(230,230,215,${0.25 * b.illuminated})`);
    halo.addColorStop(1, 'rgba(230,230,215,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(40,42,48,0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    const k = Math.cos(b.phaseAngle * (Math.PI / 180)); // 1 = full, -1 = new
    ctx.fillStyle = '#f2efe2';
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.ellipse(0, 0, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k < 0);
    ctx.fill();
    ctx.restore();
  } else {
    const r = Math.max(1.6, 1.1 + (6 - b.mag) * 0.45);
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.3, PLANET_COLORS[b.name]);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  if (layers.starLabels || !isPlanet) {
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = isPlanet ? '#ffc27a' : '#f4e7c3';
    ctx.fillText(b.name, p.x + 10, p.y - 8);
  }
}

function drawReticle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const r = 14, l = 6;
  ctx.strokeStyle = '#f7c948';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    ctx.moveTo(x + sx * r, y + sy * (r - l));
    ctx.lineTo(x + sx * r, y + sy * r);
    ctx.lineTo(x + sx * (r - l), y + sy * r);
  }
  ctx.stroke();
}

const compass = (az: number) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(az / 45) % 8];

// Name, type and coordinates of the selected object right now. Also used to slew the view to it.
export function describe(sel: Selection, catalog: Catalog, toHor: ReturnType<typeof horizonMatrix>, bodies: BodyState[]): Info {
  const where = (v: Vec3) => {
    const r = refract(v);
    return { alt: Math.asin(r[2]) * (180 / Math.PI), az: ((Math.atan2(r[0], r[1]) * 180) / Math.PI + 360) % 360 };
  };
  const horizonRows = (alt: number, az: number): [string, string][] => [
    ['Az / Alt', `${formatDeg(az, false)} (${compass(az)}) / ${formatDeg(alt)}`],
    ['Visibility', alt > 0 ? 'Above the horizon' : 'Below the horizon'],
  ];
  if (sel.kind === 'body') {
    const b = bodies.find((x) => x.name === sel.name)!;
    const rows: [string, string][] = [
      ['Magnitude', b.mag.toFixed(2)],
      ['RA / Dec (of date)', `${formatRA(b.raHours)} / ${formatDeg(b.dec)}`],
      ...horizonRows(b.alt, b.az),
      ['Distance', b.name === 'Moon' ? `${Math.round(b.distAu * 149597870.7).toLocaleString()} km` : `${b.distAu.toFixed(3)} AU`],
    ];
    if (b.name !== 'Sun') rows.splice(1, 0, ['Illuminated', `${Math.round(b.illuminated * 100)}%`]);
    return { title: b.name, subtitle: b.name === 'Sun' ? 'Star' : b.name === 'Moon' ? 'Natural satellite' : 'Planet', rows, alt: b.alt, az: b.az };
  }
  if (sel.kind === 'star') {
    const s = catalog.stars[sel.i];
    const { alt, az } = where(toHor(s.v, [0, 0, 0]));
    return {
      title: s.name ?? `Star (mag ${s.mag.toFixed(1)})`, subtitle: 'Star',
      rows: [['Magnitude', s.mag.toFixed(2)], ['RA / Dec (J2000)', `${formatRA(s.ra / 15)} / ${formatDeg(s.dec)}`], ...horizonRows(alt, az)],
      alt, az,
    };
  }
  if (sel.kind === 'dso') {
    const m = catalog.messier[sel.i];
    const { alt, az } = where(toHor(m.v, [0, 0, 0]));
    return {
      title: m.name ? `${m.id} · ${m.name}` : m.id, subtitle: dsoKind(m.type)[1],
      rows: [
        ...(m.mag != null ? [['Magnitude', m.mag.toFixed(1)] as [string, string]] : []),
        ['RA / Dec (J2000)', `${formatRA(m.ra / 15)} / ${formatDeg(m.dec)}`], ...horizonRows(alt, az),
      ],
      alt, az,
    };
  }
  const c = catalog.constellations[sel.i];
  const { alt, az } = where(toHor(c.v, [0, 0, 0]));
  return { title: c.name, subtitle: 'Constellation', rows: horizonRows(alt, az), alt, az };
}

// Current alt/az of any selection, for slewing the view without drawing a frame.
export function locate(sel: Selection, catalog: Catalog, date: Date, site: Site) {
  const info = describe(sel, catalog, horizonMatrix(date, site), sel.kind === 'body' ? bodyStates(date, site) : []);
  return { az: info.az, alt: info.alt };
}
