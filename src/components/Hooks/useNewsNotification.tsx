'use client';

import { useEffect } from "react";
import { toast } from 'react-toastify';
import { Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ArticlesResponse } from '@/api_service/space_news';

export const useNewsNotification = () => {
  const router = useRouter();

  useEffect(() => {
    const checkForNewNews = async () => {
      try {
        const response = await fetch('https://api.spaceflightnewsapi.net/v4/articles?limit=1&ordering=-published_at');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data: ArticlesResponse = await response.json();
        if (!data.results || data.results.length === 0) return;

        const latestArticle = data.results[0];
        console.log('Latest article:', latestArticle);

        const lastSeenId = localStorage.getItem('lastNewsId');
        console.log('Last seen ID:', lastSeenId);

        if (lastSeenId && lastSeenId !== String(latestArticle.id)) {
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
              position: 'bottom-right',
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              icon: false,
              className:'custom-news-toast',
              onClick: () => router.push('/space-news'),
            }
          );
        }

        localStorage.setItem('lastNewsId', String(latestArticle.id));
      } catch (error) {
        console.error('Error checking news:', error);
      }
    };

    checkForNewNews();
    const interval = setInterval(checkForNewNews, 60000);
    return () => clearInterval(interval);
  }, [router]);
};