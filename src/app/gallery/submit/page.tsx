'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { CheckCircle, Upload } from 'lucide-react';
import PageShell from '@/components/PageShell';

// Same field style as the Space Quiz settings card.
const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-600/40 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all';
const labelClass = 'block text-sm font-semibold text-gray-300 mb-2';

const OPTIONAL_FIELDS = [
  { name: 'target', label: 'Target', placeholder: 'M42, the Orion Nebula', max: 120 },
  { name: 'telescope', label: 'Telescope or lens', placeholder: '80 mm f/6 refractor', max: 160 },
  { name: 'camera', label: 'Camera', placeholder: 'ZWO ASI533MC Pro', max: 160 },
  { name: 'mount', label: 'Mount', placeholder: 'Sky-Watcher EQ6-R', max: 160 },
  { name: 'exposure', label: 'Exposure', placeholder: '60 × 120 s, gain 100, Bortle 5', max: 200 },
  { name: 'location', label: 'Location (optional, keep it general)', placeholder: 'Pune, India', max: 120 },
];

export default function GallerySubmitPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus('sending');
    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: new FormData(e.currentTarget) });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong, please try again');
      }
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong, please try again');
      setStatus('idle');
    }
  }

  return (
    <PageShell
      title="Submit an Astrophoto"
      subtitle="Share your shot and the setup behind it. Location data is stripped from the file before it is stored."
      backHref="/gallery"
      width="max-w-3xl"
    >
        {status === 'done' ? (
          <div className="text-center py-16 px-6 bg-slate-800/50 backdrop-blur-sm border border-emerald-500/40 rounded-lg" role="status">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" aria-hidden />
            <h2 className="text-2xl font-bold text-white">Thanks, your photo is in the queue</h2>
            <p className="text-slate-400 mt-2">An admin reviews every submission before it appears in the gallery.</p>
            <Link href="/gallery" className="inline-block mt-6 text-blue-400 hover:underline">Browse the gallery</Link>
          </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-6 sm:p-8">
              {/* Honeypot: hidden from people and screen readers, filled only by bots */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div>
                <label htmlFor="image" className={labelClass}>Image (JPEG, PNG, WebP or TIFF, up to 15 MB) *</label>
                <input id="image" name="image" type="file" required accept="image/jpeg,image/png,image/webp,image/tiff"
                  className="block w-full text-sm text-slate-300 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white file:font-semibold file:cursor-pointer" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="title" className={labelClass}>Title *</label>
                  <input id="title" name="title" required maxLength={120} className={inputClass} placeholder="The Great Orion Nebula" />
                </div>
                <div>
                  <label htmlFor="photographer" className={labelClass}>Your name (shown publicly) *</label>
                  <input id="photographer" name="photographer" required maxLength={80} className={inputClass} />
                </div>
                {OPTIONAL_FIELDS.map((f) => (
                  <div key={f.name}>
                    <label htmlFor={f.name} className={labelClass}>{f.label}</label>
                    <input id={f.name} name={f.name} maxLength={f.max} className={inputClass} placeholder={f.placeholder} />
                  </div>
                ))}
                <div>
                  <label htmlFor="captured_on" className={labelClass}>Date captured</label>
                  <input id="captured_on" name="captured_on" type="date" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>Processing notes or story</label>
                <textarea id="description" name="description" rows={4} maxLength={1500} className={inputClass}
                  placeholder="Stacked in Siril, stretched in GIMP…" />
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-300">
                <input type="checkbox" name="consent" required className="mt-0.5 w-5 h-5 rounded text-blue-500 bg-slate-700 border-slate-500 focus:ring-1 focus:ring-blue-500/50" />
                <span>I took this photo, and I agree to AstroHub showing it in the gallery with my name.</span>
              </label>

              {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Upload className="w-4 h-4" aria-hidden /> {status === 'sending' ? 'Uploading…' : 'Submit for review'}
              </button>
            </form>
        )}
    </PageShell>
  );
}
