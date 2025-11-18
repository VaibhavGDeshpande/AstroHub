'use client';

import { useMemo, useState } from 'react';
import SatelliteMap from '@/components/Satellite/SatelliteMap';

interface PresetSatellite {
  label: string;
  noradId: number;
  description: string;
}

const PRESET_SATELLITES: PresetSatellite[] = [
  {
    label: 'International Space Station (ISS)',
    noradId: 25544,
    description: 'Low Earth Orbit research laboratory crewed year-round.'
  },
  {
    label: 'Hubble Space Telescope',
    noradId: 20580,
    description: 'NASA/ESA optical telescope studying the deep universe.'
  },
  {
    label: 'Landsat 8',
    noradId: 39084,
    description: 'Earth-observing satellite capturing multispectral imagery.'
  },
  {
    label: 'NOAA 20 (JPSS-1)',
    noradId: 43013,
    description: 'Polar-orbiting weather satellite monitoring global climate.'
  }
];

export default function SatelliteMapPage() {
  const [customId, setCustomId] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<PresetSatellite | null>(PRESET_SATELLITES[0]);

  const activeSatellite = useMemo(() => {
    if (customId.trim().length > 0) {
      const parsed = Number(customId.trim());
      if (!Number.isNaN(parsed)) {
        return { label: `NORAD ${parsed}`, noradId: parsed };
      }
    }

    return selectedPreset ?? PRESET_SATELLITES[0];
  }, [customId, selectedPreset]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <section className="space-y-6 rounded-2xl bg-slate-900/70 p-6 shadow-xl ring-1 ring-white/10 lg:w-80">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-300/80">Satellite Tracker</p>
            <h1 className="text-2xl font-semibold">Live Orbit Viewer</h1>
            <p className="mt-2 text-sm text-slate-300">
              Choose a preset satellite or enter a NORAD catalog number to visualize its real-time position.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Preset Satellites
              </label>
              <div className="mt-2 space-y-2">
                {PRESET_SATELLITES.map((sat) => (
                  <button
                    key={sat.noradId}
                    onClick={() => {
                      setSelectedPreset(sat);
                      setCustomId('');
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      activeSatellite.noradId === sat.noradId
                        ? 'border-emerald-400/40 bg-emerald-400/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <p className="text-sm font-semibold">{sat.label}</p>
                    <p className="text-xs text-slate-300">{sat.description}</p>
                    <p className="mt-1 text-xs text-emerald-300/80">NORAD {sat.noradId}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Custom NORAD ID
              </label>
              <input
                value={customId}
                onChange={(event) => setCustomId(event.target.value)}
                placeholder="e.g. 43013"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                Enter a numeric NORAD catalog number to track any satellite.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            Fetches fresh TLE data via `/api/satellite/tle` and updates the Leaflet map in real time.
          </div>
        </section>

        <section className="flex-1 rounded-2xl bg-slate-900/60 p-4 shadow-xl ring-1 ring-white/10">
          <SatelliteMap noradId={activeSatellite.noradId} satelliteName={activeSatellite.label} />
        </section>
      </div>
    </div>
  );
}
