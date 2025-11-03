export async function getAstronomy(location: string, date?: string) {
  try {
    const params = new URLSearchParams({ location });
    if (date) params.set('date', date);
    const url = `/api/astronomy?${params.toString()}`;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      let message = result?.error || 'Unknown error';
      if (response.status === 400) message = 'Location is required';
      throw new Error(message);
    }

    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch astronomy data.');
  }
}

