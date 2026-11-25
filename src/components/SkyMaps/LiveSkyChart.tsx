'use client';

// Stellarium-style live sky: you stand on the ground and look around. Drag to look, scroll or pinch to zoom,
// click anything for details. All data is bundled, so it keeps working offline once the page has loaded.
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Clock, CloudSun, Compass, FastForward, Grid3x3, LocateFixed, MapPin, Maximize, Minimize, Mountain,
  Pause, Play, Rewind, Search, Sparkles, Tag, Type, Waves, Waypoints, X,
} from 'lucide-react';
import starsJson from '@/data/sky/stars.json';
import constellationsJson from '@/data/sky/constellations.json';
import messierJson from '@/data/sky/messier.json';
import milkyWayJson from '@/data/sky/milkyway.json';
import { BODIES, type Site } from '@/lib/sky/skyEngine';
import { buildCatalog, drawSky, locate, type Hit, type Info, type Layers, type RawSky, type Selection } from './skyRenderer';

const DEFAULT_SITE: Site & { label: string } = { lat: 51.4779, lon: 0, label: 'Greenwich (default)' };
const DEFAULT_LAYERS: Layers = {
  constellationLines: true, constellationNames: true, starLabels: true, deepSky: true,
  milkyWay: true, grid: false, ground: true, atmosphere: true, cardinals: true,
};
const RATES = [-3600, -600, -60, -10, -1, 0, 1, 10, 60, 600, 3600];
const LAYER_BUTTONS: { key: keyof Layers; label: string; Icon: typeof Type }[] = [
  { key: 'constellationLines', label: 'Constellation lines', Icon: Waypoints },
  { key: 'constellationNames', label: 'Constellation names', Icon: Type },
  { key: 'starLabels', label: 'Star and planet names', Icon: Tag },
  { key: 'deepSky', label: 'Deep-sky objects (Messier)', Icon: Sparkles },
  { key: 'milkyWay', label: 'Milky Way', Icon: Waves },
  { key: 'grid', label: 'Altitude/azimuth grid', Icon: Grid3x3 },
  { key: 'ground', label: 'Ground', Icon: Mountain },
  { key: 'atmosphere', label: 'Atmosphere', Icon: CloudSun },
  { key: 'cardinals', label: 'Cardinal points', Icon: Compass },
];

const readStored = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const store = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: settings just won't persist.
  }
};

const rateLabel = (r: number) => {
  if (r === 1) return 'Real time';
  if (r === 0) return 'Paused';
  const a = Math.abs(r);
  const txt = a >= 3600 ? `${a / 3600} h/s` : a >= 60 ? `${a / 60} min/s` : `${a}×`;
  return `${r < 0 ? '◀ ' : ''}${txt}`;
};
const siteLabel = (s: Site & { label?: string }) =>
  s.label || `${Math.abs(s.lat).toFixed(2)}°${s.lat >= 0 ? 'N' : 'S'}, ${Math.abs(s.lon).toFixed(2)}°${s.lon >= 0 ? 'E' : 'W'}`;
const pad = (n: number) => String(n).padStart(2, '0');
const localInputValue = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const wrapAz = (a: number) => ((a % 360) + 360) % 360;

export default function LiveSkyChart() {
  const catalog = useMemo(
    () => buildCatalog({ stars: starsJson, constellations: constellationsJson, messier: messierJson, milkyWay: milkyWayJson } as unknown as RawSky),
    [],
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const timeLabelRef = useRef<HTMLButtonElement>(null);

  const [site, setSite] = useState<Site & { label?: string }>(DEFAULT_SITE);
  const [layers, setLayers] = useState<Layers>(DEFAULT_LAYERS);
  const [rate, setRateState] = useState(1);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [panel, setPanel] = useState<'location' | 'time' | null>(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Everything the render loop reads lives in refs, so drawing never waits on React.
  const view = useRef({ az: 180, alt: 25, fov: 100, ready: false });
  const time = useRef({ anchorReal: 0, anchorSim: 0, rate: 1 });
  const live = useRef({ site, layers, selected });
  live.current = { site, layers, selected };
  const dirty = useRef(true);
  const hits = useRef<Hit[]>([]);
  const slew = useRef<{ fromAz: number; fromAlt: number; toAz: number; toAlt: number; start: number } | null>(null);
  const lastInfo = useRef(0);
  const hadInfo = useRef(false);

  const simNow = () => {
    const t = time.current;
    return new Date(t.anchorSim + (performance.now() - t.anchorReal) * t.rate);
  };
  const setClock = useCallback((simMs: number, r: number) => {
    time.current = { anchorReal: performance.now(), anchorSim: simMs, rate: r };
    setRateState(r);
    dirty.current = true;
  }, []);

  // Restore settings and location; ask for GPS only when nothing is saved.
  useEffect(() => {
    time.current = { anchorReal: performance.now(), anchorSim: Date.now(), rate: 1 };
    const savedLayers = readStored<Partial<Layers>>('astrohub-sky-layers');
    if (savedLayers) setLayers({ ...DEFAULT_LAYERS, ...savedLayers });
    const savedSite = readStored<Site & { label?: string }>('astrohub-sky-site');
    if (savedSite && Number.isFinite(savedSite.lat) && Number.isFinite(savedSite.lon)) {
      setSite(savedSite);
      view.current.az = savedSite.lat >= 0 ? 180 : 0;
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const s = { lat: p.coords.latitude, lon: p.coords.longitude };
          setSite(s);
          store('astrohub-sky-site', s);
          view.current.az = s.lat >= 0 ? 180 : 0;
          dirty.current = true;
        },
        () => setNotice('Showing the sky from Greenwich. Set your location with the pin button.'),
        { timeout: 10000 },
      );
    }
  }, []);

  useEffect(() => {
    dirty.current = true;
  }, [site, layers, selected]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    if (!view.current.ready) {
      // Portrait screens see far more sky vertically, so look higher to keep the horizon near the bottom.
      view.current.fov = w < h ? 70 : 100;
      view.current.alt = w < h ? 45 : 25;
      view.current.ready = true;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const date = simNow();
    const { site: s, layers: l, selected: sel } = live.current;
    const res = drawSky({ ctx, width: w, height: h, date, site: s, view: view.current, layers: l, catalog, selected: sel });
    hits.current = res.hits;

    if (statusRef.current) statusRef.current.textContent = `${siteLabel(s)} · FOV ${view.current.fov.toFixed(view.current.fov < 10 ? 1 : 0)}°`;
    if (timeLabelRef.current) {
      timeLabelRef.current.textContent = date.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    }
    // The info panel re-renders at most 4 times a second, or at once when a selection appears or clears.
    const now = performance.now();
    if (now - lastInfo.current > 250 || !!res.info !== hadInfo.current) {
      lastInfo.current = now;
      hadInfo.current = !!res.info;
      setInfo(res.info);
    }
  }, [catalog]);

  // Render loop: every frame while time runs fast or the view moves, about once a second in real time.
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const sl = slew.current;
      if (sl) {
        const k = Math.min(1, (t - sl.start) / 700);
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const dAz = ((sl.toAz - sl.fromAz + 540) % 360) - 180;
        view.current.az = wrapAz(sl.fromAz + dAz * e);
        view.current.alt = sl.fromAlt + (sl.toAlt - sl.fromAlt) * e;
        if (k >= 1) slew.current = null;
        dirty.current = true;
      }
      const r = time.current.rate;
      const fastTime = r !== 0 && r !== 1;
      if (!dirty.current && !fastTime && !(r === 1 && t - last > 1000)) return;
      dirty.current = false;
      last = t;
      draw();
    };
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => { dirty.current = true; });
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw]);

  // --- input: drag to look, wheel/pinch to zoom, tap to select
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: 0, pinchDist: 0, pinchFov: 0, downAt: 0 });

  const zoomBy = (factor: number) => {
    view.current.fov = Math.min(180, Math.max(1, view.current.fov * factor));
    dirty.current = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      view.current.fov = Math.min(180, Math.max(1, view.current.fov * Math.exp(e.deltaY * 0.0012)));
      dirty.current = true;
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    slew.current = null;
    if (pointers.current.size === 1) gesture.current = { moved: 0, pinchDist: 0, pinchFov: 0, downAt: performance.now() };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.pinchFov = view.current.fov;
      gesture.current.moved = 99; // a pinch is never a tap
    }
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (gesture.current.pinchDist > 0 && d > 0) {
        view.current.fov = Math.min(180, Math.max(1, gesture.current.pinchFov * (gesture.current.pinchDist / d)));
        dirty.current = true;
      }
      return;
    }
    const dx = cur.x - prev.x, dy = cur.y - prev.y;
    gesture.current.moved += Math.abs(dx) + Math.abs(dy);
    // Grab-and-drag the sky, like Stellarium: the sky follows the pointer.
    const degPerPx = view.current.fov / (canvasRef.current?.clientWidth || 1);
    view.current.az = wrapAz(view.current.az - dx * degPerPx);
    view.current.alt = Math.min(90, Math.max(-10, view.current.alt + dy * degPerPx));
    dirty.current = true;
  };
  const onPointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size === 0 && g.moved < 6 && performance.now() - g.downAt < 500) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      let best: Hit | null = null, bestScore = Infinity;
      for (const h of hits.current) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d > 18) continue;
        const score = d + Math.max(-3, h.mag) * 1.2; // nearest wins, brighter breaks ties
        if (score < bestScore) { bestScore = score; best = h; }
      }
      setSelected(best?.sel ?? null);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget && e.target !== canvasRef.current) return;
    const v = view.current;
    const step = v.fov / 20;
    if (e.key === 'ArrowLeft') v.az = wrapAz(v.az - step);
    else if (e.key === 'ArrowRight') v.az = wrapAz(v.az + step);
    else if (e.key === 'ArrowUp') v.alt = Math.min(90, v.alt + step);
    else if (e.key === 'ArrowDown') v.alt = Math.max(-10, v.alt - step);
    else if (e.key === '+' || e.key === '=') zoomBy(0.85);
    else if (e.key === '-') zoomBy(1 / 0.85);
    else if (e.key === 'Escape') setSelected(null);
    else return;
    e.preventDefault();
    dirty.current = true;
  };

  // --- search
  // A few catalogue stars share a proper name; the first (brightest, as stars are sorted by magnitude) wins.
  const searchIndex = useMemo(() => [...new Map<string, Selection>([
    ...catalog.constellations.map((c, i) => [c.name, { kind: 'con', i }] as [string, Selection]),
    ...catalog.messier.map((m, i) => [m.name ? `${m.id} ${m.name}` : m.id, { kind: 'dso', i }] as [string, Selection]),
    ...[...catalog.stars].reverse().filter((s) => s.name).map((s) => [s.name!, { kind: 'star', i: s.i }] as [string, Selection]),
    ...BODIES.map((name) => [name, { kind: 'body', name }] as [string, Selection]),
  ]).entries()], [catalog]);

  const goTo = (sel: Selection) => {
    setSelected(sel);
    const { az, alt } = locate(sel, catalog, simNow(), live.current.site);
    slew.current = { fromAz: view.current.az, fromAlt: view.current.alt, toAz: az, toAlt: Math.min(90, Math.max(-10, alt)), start: performance.now() };
    if (alt < 0 && live.current.layers.ground) setNotice('That object is below your horizon right now. Turn off the ground to see it.');
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const hit = searchIndex.find(([n]) => n.toLowerCase() === q)
      ?? searchIndex.find(([n]) => n.toLowerCase().startsWith(q))
      ?? searchIndex.find(([n]) => n.toLowerCase().includes(q));
    if (hit) {
      goTo(hit[1]);
      setQuery('');
    } else {
      setNotice(`Nothing called “${query.trim()}” in this sky catalog.`);
    }
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  // --- controls
  const toggleLayer = (key: keyof Layers) => {
    setLayers((l) => {
      const next = { ...l, [key]: !l[key] };
      store('astrohub-sky-layers', next);
      return next;
    });
  };
  const stepRate = (dir: 1 | -1) => {
    const i = RATES.indexOf(time.current.rate);
    setClock(simNow().getTime(), RATES[Math.min(RATES.length - 1, Math.max(0, (i < 0 ? 6 : i) + dir))]);
  };

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else wrapRef.current?.requestFullscreen().catch(() => setNotice('Fullscreen is not available in this browser.'));
  };

  const saveSite = (s: Site & { label?: string }) => {
    setSite(s);
    store('astrohub-sky-site', s);
    setPanel(null);
  };
  const requestGps = () => {
    if (!navigator.geolocation) return setNotice('Location is not available in this browser.');
    navigator.geolocation.getCurrentPosition(
      (p) => saveSite({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setNotice('Location permission was denied. Enter coordinates instead.'),
      { timeout: 10000 },
    );
  };

  const btn = 'p-2 rounded-lg transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400';
  const btnIdle = 'text-slate-400 hover:text-white hover:bg-white/10';
  const btnOn = 'text-sky-300 bg-sky-400/15 hover:bg-sky-400/25';
  const bar = 'bg-black/55 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-black/40';

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="fixed inset-0 bg-black text-slate-200 select-none overflow-hidden focus:outline-none"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive view of the sky from your location. Drag to look around, scroll or pinch to zoom, click an object for details. Arrow keys pan, plus and minus zoom."
        className="absolute inset-0 w-full h-full touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {/* Top bar: back link and search */}
      <div className="absolute top-3 inset-x-3 flex items-center gap-2 pointer-events-none">
        <Link href="/" className={`${bar} pointer-events-auto flex items-center gap-1.5 px-3 py-2 text-sm text-slate-300 hover:text-white`}>
          <ArrowLeft className="w-4 h-4" aria-hidden /> <span className="hidden sm:inline">AstroHub</span>
        </Link>
        <h1 className="sr-only">Live Sky Chart</h1>
        <form onSubmit={onSearch} role="search" className={`${bar} pointer-events-auto ml-auto flex items-center gap-2 px-3 py-1.5 w-full max-w-[16rem]`}>
          <Search className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            list="sky-objects"
            placeholder="Search Jupiter, Vega, M42…"
            aria-label="Search for a star, planet, constellation or Messier object"
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          />
        </form>
        <datalist id="sky-objects">
          {searchIndex.map(([n]) => <option key={n} value={n} />)}
        </datalist>
      </div>

      {/* Selected object, Stellarium-style info in the top-left */}
      {info && (
        <section aria-live="polite" className={`${bar} absolute top-16 left-3 w-[min(20rem,calc(100%-1.5rem))] p-4`}>
          <button onClick={() => setSelected(null)} aria-label="Close object details" className={`${btn} ${btnIdle} absolute top-2 right-2 p-1`}>
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-white pr-6 leading-tight">{info.title}</h2>
          <p className="text-xs uppercase tracking-wider text-sky-300/80 mb-3">{info.subtitle}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            {info.rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-slate-200 tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {notice && (
        <p role="status" className={`${bar} absolute top-16 right-3 max-w-xs px-4 py-2.5 text-sm text-amber-100`}>{notice}</p>
      )}

      {/* Bottom: status line and toolbar; the right edge leaves room for the site's floating buttons */}
      <div className="absolute bottom-3 left-3 right-20 flex flex-col items-start gap-2 pointer-events-none">
        <div className={`${bar} pointer-events-auto flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 text-xs text-slate-300 max-w-full`}>
          <span ref={statusRef} className="tabular-nums" />
          <button
            ref={timeLabelRef}
            onClick={() => setPanel(panel === 'time' ? null : 'time')}
            className="tabular-nums text-slate-200 hover:text-white underline decoration-dotted underline-offset-4"
            aria-label="Change date and time"
          />
          <span className={rate === 1 ? 'text-slate-500' : 'text-amber-300'}>{rateLabel(rate)}</span>
        </div>

        <div className={`${bar} pointer-events-auto flex items-center gap-0.5 p-1 max-w-full overflow-x-auto`} role="toolbar" aria-label="Sky display controls">
          {LAYER_BUTTONS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => toggleLayer(key)} title={label} aria-label={label} aria-pressed={layers[key]} className={`${btn} ${layers[key] ? btnOn : btnIdle}`}>
              <Icon className="w-5 h-5" />
            </button>
          ))}
          <span className="w-px h-6 bg-white/10 mx-1 shrink-0" aria-hidden />
          <button onClick={() => stepRate(-1)} title="Slower / reverse time" aria-label="Slower or reverse time" className={`${btn} ${btnIdle}`}><Rewind className="w-5 h-5" /></button>
          <button
            onClick={() => setClock(simNow().getTime(), time.current.rate === 0 ? 1 : 0)}
            title={rate === 0 ? 'Resume' : 'Pause time'}
            aria-label={rate === 0 ? 'Resume time' : 'Pause time'}
            className={`${btn} ${rate === 0 ? btnOn : btnIdle}`}
          >
            {rate === 0 ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button onClick={() => stepRate(1)} title="Faster time" aria-label="Faster time" className={`${btn} ${btnIdle}`}><FastForward className="w-5 h-5" /></button>
          <button onClick={() => setClock(Date.now(), 1)} title="Back to now" aria-label="Back to the current time" className={`${btn} ${btnIdle}`}><Clock className="w-5 h-5" /></button>
          <span className="w-px h-6 bg-white/10 mx-1 shrink-0" aria-hidden />
          <button
            onClick={() => setPanel(panel === 'location' ? null : 'location')}
            title="Location"
            aria-label="Change location"
            aria-pressed={panel === 'location'}
            className={`${btn} ${panel === 'location' ? btnOn : btnIdle}`}
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button onClick={toggleFullscreen} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} className={`${btn} ${btnIdle}`}>
            {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {panel === 'location' && <LocationPanel site={site} onSave={saveSite} onGps={requestGps} onClose={() => setPanel(null)} className={bar} />}
      {panel === 'time' && (
        <TimePanel
          value={localInputValue(simNow())}
          onApply={(d) => { setClock(d.getTime(), time.current.rate); setPanel(null); }}
          onClose={() => setPanel(null)}
          className={bar}
        />
      )}
    </div>
  );
}

function LocationPanel({ site, onSave, onGps, onClose, className }: {
  site: Site; onSave: (s: Site) => void; onGps: () => void; onClose: () => void; className: string;
}) {
  const [lat, setLat] = useState(site.lat.toFixed(4));
  const [lon, setLon] = useState(site.lon.toFixed(4));
  const la = Number(lat), lo = Number(lon);
  const valid = lat.trim() !== '' && lon.trim() !== '' && Number.isFinite(la) && Number.isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180;
  const input = 'w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60';
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onSave({ lat: la, lon: lo }); }}
      className={`${className} absolute bottom-28 left-3 w-[min(19rem,calc(100%-1.5rem))] p-4 space-y-3`}
      aria-label="Observer location"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Location</h2>
        <button type="button" onClick={onClose} aria-label="Close location settings" className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X className="w-4 h-4" /></button>
      </div>
      <button type="button" onClick={onGps} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 text-sm font-medium">
        <LocateFixed className="w-4 h-4" aria-hidden /> Use my location
      </button>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <label>Latitude (−90 to 90)<input className={input} inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} /></label>
        <label>Longitude (−180 to 180)<input className={input} inputMode="decimal" value={lon} onChange={(e) => setLon(e.target.value)} /></label>
      </div>
      {!valid && <p className="text-xs text-red-300" role="alert">Latitude must be between −90 and 90 and longitude between −180 and 180.</p>}
      <button type="submit" disabled={!valid} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium disabled:opacity-40">Set location</button>
    </form>
  );
}

function TimePanel({ value, onApply, onClose, className }: {
  value: string; onApply: (d: Date) => void; onClose: () => void; className: string;
}) {
  const [v, setV] = useState(value);
  const d = new Date(v);
  const valid = !Number.isNaN(d.getTime());
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onApply(d); }}
      className={`${className} absolute bottom-28 left-3 w-[min(19rem,calc(100%-1.5rem))] p-4 space-y-3`}
      aria-label="Date and time"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Date &amp; time</h2>
        <button type="button" onClick={onClose} aria-label="Close date and time settings" className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X className="w-4 h-4" /></button>
      </div>
      <input
        type="datetime-local"
        value={v}
        onChange={(e) => setV(e.target.value)}
        aria-label="Date and time to show"
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-sky-400/60"
      />
      <button type="submit" disabled={!valid} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium disabled:opacity-40">Show this time</button>
    </form>
  );
}
