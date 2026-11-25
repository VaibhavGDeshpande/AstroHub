'use client';

import { useEffect } from 'react';

// Registers /sw.js in production only: in dev a cached page would hide your edits.
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('Service worker registration failed:', err));
  }, []);
  return null;
}
