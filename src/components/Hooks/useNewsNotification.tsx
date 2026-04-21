'use client';

import { useEffect } from "react";
import { toast } from 'react-toastify';
import { Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export const useNewsNotification = () => {
  const router = useRouter();

  useEffect(() => {
    const checkForNewNews = async () => {
      try {
        const response = await fetch('/api/spacenews', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.success || !data.data.items || data.data.items.length === 0) return;

        const latestArticle = data.data.items[0];

        // localStorage.setItem('lastNewsLink','https://spacenews.com/artemis-accords-nations-mark-fifth-anniversary/')

        const lastSeenLink = localStorage.getItem('lastNewsLink');

        if (lastSeenLink && lastSeenLink !== latestArticle.link) {
          toast.success(
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              width: '100%'
            }}>
              <Newspaper style={{ 
                width: '20px', 
                height: '20px', 
                flexShrink: 0, 
                color: '#93c5fd' 
              }} />
              <div style={{ 
                overflow: 'hidden', 
                minWidth: 0,
                flex: 1
              }}>
                <p style={{ 
                  fontWeight: '600', 
                  fontSize: '14px', 
                  margin: 0, 
                  lineHeight: '1.4',
                  marginBottom: '2px'
                }}>
                  New Space News!
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  opacity: 0.85, 
                  margin: 0, 
                  lineHeight: '1.4',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {latestArticle.title}
                </p>
              </div>
            </div>,
            {
              position: 'top-right',
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              icon: false,
              className: 'custom-news-toast',
              onClick: () => router.push('/space-news'),
            }
          );
        }

        localStorage.setItem('lastNewsLink', latestArticle.link);
      } catch (error) {
        console.error('Error checking news:', error);
      }
    };

    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let started = false;

    const startPolling = () => {
      if (started) return;
      started = true;
      checkForNewNews();
      pollInterval = setInterval(checkForNewNews, 600000);
    };

    if (typeof window !== 'undefined') {
      const win = window as IdleWindow;
      if (typeof win.requestIdleCallback === 'function') {
        idleHandle = win.requestIdleCallback(startPolling, { timeout: 2000 });
      } else {
        timeoutHandle = setTimeout(startPolling, 1500);
      }
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      if (idleHandle !== null && typeof window !== 'undefined') {
        const win = window as IdleWindow;
        if (typeof win.cancelIdleCallback === 'function') {
          win.cancelIdleCallback(idleHandle);
        }
      }
    };
  }, [router]);
};
