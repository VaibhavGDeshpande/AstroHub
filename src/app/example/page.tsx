'use client';

import { useMemo, useState } from 'react';
import SatelliteMap from '@/components/Satellite/SatelliteMap';

interface PresetSatellite {
  label: string;
  noradId: number;
  description: string;
}

const FAMOUS_SATELLITES: PresetSatellite[] = [
  {
    label: 'International Space Station (ISS)',
    noradId: 25544,
    description: 'Crewed orbital research laboratory'
  },
  {
    label: 'Hubble Space Telescope',
    noradId: 20580,
    description: 'Deep-space observatory since 1990'
  },
  {
    label: 'Landsat 9',
    noradId: 49260,
    description: 'Earth imaging mission for land change'
  },
  {
    label: 'Sentinel-2A',
    noradId: 40697,
    description: 'ESA multispectral climate sentinel'
  },
  {
    label: 'Terra (EOS AM-1)',
    noradId: 25994,
    description: 'Flagship Earth Observing System craft'
  }
];

export default function ExamplePage() {
  const [selectedPreset, setSelectedPreset] = useState<(typeof FAMOUS_SATELLITES)[number]>(FAMOUS_SATELLITES[0]);
  const [customNorad, setCustomNorad] = useState('');

  const activeSatellite = useMemo(() => {
    const trimmed = customNorad.trim();
    if (trimmed.length > 0) {
      const parsed = Number(trimmed);
      if (!Number.isNaN(parsed)) {
        return {
          label: `NORAD ${parsed}`,
          description: 'Custom NORAD selection',
          noradId: parsed
        };
      }
    }
    return selectedPreset;
  }, [customNorad, selectedPreset]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <section className="space-y-6 rounded-2xl bg-slate-900/70 p-6 shadow-xl ring-1 ring-white/10 lg:w-80">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-300/80">Featured Missions</p>
            <h1 className="text-2xl font-semibold">Select a Satellite</h1>
            <p className="mt-2 text-sm text-slate-300">
              Choose one of the iconic spacecraft below or enter any NORAD catalog number to see the live track.
            </p>
          </div>

          <div className="space-y-3">
            {FAMOUS_SATELLITES.map((sat) => {
              const isActive = activeSatellite.noradId === sat.noradId;
              return (
                <button
                  key={sat.noradId}
                  onClick={() => {
                    setSelectedPreset(sat);
                    setCustomNorad('');
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                    isActive ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <p className="text-sm font-semibold">{sat.label}</p>
                  <p className="text-xs text-slate-300">{sat.description}</p>
                  <span className="mt-1 block text-xs text-emerald-300/80">NORAD {sat.noradId}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Custom NORAD ID</label>
            <input
              value={customNorad}
              onChange={(event) => setCustomNorad(event.target.value)}
              placeholder="Enter NORAD catalog number"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-400">Example: 43013 (NOAA 20)</p>
          </div>
        </section>

        <section className="flex-1 rounded-2xl bg-slate-900/60 p-4 shadow-xl ring-1 ring-white/10 min-h-[620px]">
          <SatelliteMap noradId={activeSatellite.noradId} satelliteName={activeSatellite.label} />
        </section>
      </div>
    </div>
  );
}
