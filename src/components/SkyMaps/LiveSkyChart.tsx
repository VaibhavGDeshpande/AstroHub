'use client';

import { useEffect, useState } from 'react';

const CDN = 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35';
// Order matters: celestial needs d3 v3 and its geo projection plugin first.
const SCRIPTS = ['lib/d3.min.js', 'lib/d3.geo.projection.min.js', 'celestial.min.js'];

/* eslint-disable @typescript-eslint/no-explicit-any */
const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

export default function LiveSkyChart() {
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${CDN}/celestial.css`;
    document.head.appendChild(link);

    (async () => {
      try {
        // Sequential on purpose: each script depends on the previous one.
        for (const f of SCRIPTS) await loadScript(`${CDN}/${f}`);
        if (cancelled) return;
        const C = (window as any).Celestial;
        C.display({
          container: 'celestial-map',
          form: true,
          location: true,
          follow: 'zenith',
          projection: 'stereographic',
          interactive: true,
          settimezone: false, // avoids a third-party timezone lookup
          datapath: `${CDN}/data/`,
          width: 0,
          stars: { limit: 6, designation: true, propername: true },
          dsos: { show: true, limit: 6 },
          constellations: { names: true, lines: true },
          mw: { show: true },
        });
        const view = (loc: [number, number]) =>
          C.skyview({ date: new Date(), location: loc, timezone: -new Date().getTimezoneOffset() });
        // Fall back to the equator if location is denied, so the chart still renders.
        navigator.geolocation?.getCurrentPosition(
          (p) => view([p.coords.latitude, p.coords.longitude]),
          () => view([0, 0]),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load sky chart');
      }
    })();

    return () => {
      cancelled = true;
      link.remove();
    };
  }, []);

  if (error) return <p className="text-red-400 text-center p-8">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10 text-white">
      <h1 className="text-3xl font-bold mb-2">Live Sky Chart</h1>
      <p className="text-slate-400 mb-4">
        The sky above you right now. Drag to pan, scroll to zoom, and use the form to change time or location.
      </p>
      <div id="celestial-map" className="w-full" />
      <div id="celestial-form" />
    </div>
  );
}
