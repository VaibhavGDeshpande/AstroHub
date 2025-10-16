import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type CustomFeed = {
  title: string;
  description: string;
  link: string;
};

type MediaContent = {
  $?: {
    url: string;
  };
  url?: string;
};

type CustomItem = {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  creator: string;
  categories: string[];
  'content:encoded': string;
  enclosure?: {
    url: string;
    type: string;
  };
  'media:content'?: MediaContent;
};

// Function to extract image from HTML content
function extractImageUrl(htmlContent: string): string | null {
  if (!htmlContent) return null;
  
  // Regex to find img tags with src attribute
  const imgRegex = /<img[^>]+src="([^">]+)"/gi;
  const match = imgRegex.exec(htmlContent);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

export async function GET() {
  try {
    const parser: Parser<CustomFeed, CustomItem> = new Parser({
      customFields: {
        item: [
          'creator',
          'content',
          'contentSnippet',
          ['content:encoded', 'contentEncoded'],
          ['media:content', 'mediaContent']
        ]
      }
    });

    const feed = await parser.parseURL('https://spacenews.com/feed');

    return NextResponse.json({
      success: true,
      data: {
        title: feed.title,
        description: feed.description,
        items: feed.items.map(item => {
          // Try multiple methods to get image
          let imageUrl: string | null = null;
          
          // Method 1: Check enclosure (common for podcast/media feeds)
          if (item.enclosure?.url) {
            imageUrl = item.enclosure.url;
          }
          
          // Method 2: Check media:content
          if (!imageUrl && item['media:content']) {
            const mediaContent = item['media:content'] as MediaContent;
            imageUrl = mediaContent?.$?.url || mediaContent?.url || null;
          }
          
          // Method 3: Extract from content:encoded
          if (!imageUrl && item['content:encoded']) {
            imageUrl = extractImageUrl(item['content:encoded']);
          }
          
          // Method 4: Extract from content
          if (!imageUrl && item.content) {
            imageUrl = extractImageUrl(item.content);
          }

          return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            content: item.contentSnippet || item.content,
            creator: item.creator,
            categories: item.categories || [],
            imageUrl: imageUrl
          };
        })
      }
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch space news' },
      { status: 500 }
    );
  }
}
