import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ageParam = searchParams.get('age');

  if (!ageParam) {
    return NextResponse.json({ error: 'Age parameter is required' }, { status: 400 });
  }

  const age = parseFloat(ageParam);
  if (isNaN(age) || age < 0) {
    return NextResponse.json({ error: 'Invalid age parameter' }, { status: 400 });
  }

  const apiKey = process.env.NINJA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  // We search for a star within +/- 1.0 light years of the age
  const minDistance = Math.max(0, age - 1.0).toFixed(2);
  const maxDistance = (age + 1.0).toFixed(2);

  try {
    const url = `https://api.api-ninjas.com/v1/stars?min_distance_light_year=${minDistance}&max_distance_light_year=${maxDistance}`;
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
      },
      // Ensure we don't cache this heavily since we want varied results
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('API Ninjas error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch from API Ninjas' }, { status: response.status });
    }

    const data = await response.json();
    
    // API Ninjas might return an array of stars. Let's find the one closest to the actual age.
    if (!data || data.length === 0) {
      return NextResponse.json({ stars: [] }); // Empty array indicates no matches
    }

    // Sort by closest distance
    data.sort((a: any, b: any) => {
      const distA = parseFloat(a.distance_light_year);
      const distB = parseFloat(b.distance_light_year);
      return Math.abs(distA - age) - Math.abs(distB - age);
    });

    return NextResponse.json({ stars: data });
  } catch (error) {
    console.error('Error fetching stars:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
