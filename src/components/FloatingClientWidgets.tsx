'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const NightModeToggle = dynamic(() => import('@/components/NightModeToggle'), {
  ssr: false,
  loading: () => null,
});

const AstroBot = dynamic(() => import('@/components/AstroBot'), {
  ssr: false,
  loading: () => null,
});

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export default function FloatingClientWidgets() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

    const start = () => setShouldRender(true);

    if (typeof window === 'undefined') {
      return;
    }

    const win = window as IdleWindow;

    if (typeof win.requestIdleCallback === 'function') {
      idleHandle = win.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutHandle = setTimeout(start, 2000);
    }

    return () => {
      if (idleHandle !== null && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <NightModeToggle />
      <AstroBot />
    </>
  );
}

