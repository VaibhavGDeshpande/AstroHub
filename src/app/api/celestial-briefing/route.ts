import { NextResponse } from 'next/server';

const GEMINI_KEY = process.env.GEMINI_KEY;

export const dynamic = 'force-dynamic';

let cachedBriefing: unknown = null;
let lastCacheDate: string | null = null;

export async function GET() {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: 'Missing GEMINI_KEY' }, { status: 500 });
  }

  const todayRaw = new Date();
  const todayKey = todayRaw.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // Return cached briefing if the date hasn't changed (changes exactly at 00:00)
  if (cachedBriefing && lastCacheDate === todayKey) {
    return NextResponse.json(cachedBriefing);
  }

  const todayStr = todayRaw.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  try {
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
      const error = await response.json();
      return NextResponse.json({ error: 'Gemini API failed', details: error }, { status: response.status });
    }

    const result = await response.json();
    const content = result.candidates[0].content.parts[0].text;
    
    // Parse the JSON from Gemini's response
    try {
      const briefing = JSON.parse(content);
      
      // Cache the result for today
      cachedBriefing = briefing;
      lastCacheDate = todayKey;
      
      return NextResponse.json(briefing);
    } catch {
      console.error('Failed to parse Gemini response:', content);
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Celestial Briefing Error:', error);
    return NextResponse.json({ error: 'Failed to fetch briefing' }, { status: 500 });
  }
}
