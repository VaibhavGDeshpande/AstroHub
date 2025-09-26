export async function getAPOD(date?: string, startDate?: string, endDate?: string) {
  try {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    const url = `/api/nasa/apod${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    const result = await response.json();
    if (!response.ok) {
      let message = result.error || "Unknown error";
      if (response.status === 403)
        message = "Access denied: NASA API key issue or rate limit exceeded";
      throw new Error(message);
    }
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch APOD.");
  }
}
