import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const GEMINI_KEY = process.env.GEMINI_KEY;

export const dynamic = 'force-dynamic';

// One Gemini call per UTC day, shared across every server instance; a throw is never cached
const getBriefing = unstable_cache(
  async (todayKey: string) => {
    const todayStr = new Date(`${todayKey}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are an expert astronomer. Provide a daily briefing for ${todayStr}. \nReturn ONLY a JSON object with this exact structure:\n{\n  "visible_planets": ["Planet 1", "Planet 2"],\n  "deep_sky_targets": ["Target 1", "Target 2"],\n  "fact": "One interesting space fact.",\n  "history": "One 'Today in History' space event."\n}\nKeep descriptions concise and engaging for a premium astronomy dashboard.\n\nUser: What's happening in the sky today, ${todayStr}?` }]
        }],
        generationConfig: {
          temperature: 0.5,
          responseMimeType: "application/json",
        }
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Gemini API failed (${response.status}): ${details}`);
    }

    const result = await response.json();
    const content = result.candidates[0].content.parts[0].text;
    try {
      return JSON.parse(content);
    } catch {
      throw new Error(`Invalid response format from AI: ${content}`);
    }
  },
  ['celestial-briefing'],
  { revalidate: 86400 }
);

export async function GET() {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: 'Missing GEMINI_KEY' }, { status: 500 });
  }

  const todayKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD, changes at 00:00 UTC

  try {
    const briefing = await getBriefing(todayKey);
    return NextResponse.json(briefing, {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=3600' },
    });
  } catch (error: unknown) {
    console.error('Celestial Briefing Error:', error);
    return NextResponse.json({ error: 'Failed to fetch briefing' }, { status: 500 });
  }
}
