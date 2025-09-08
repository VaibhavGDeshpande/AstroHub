interface APODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

// api_service/APOD.ts
export async function getAPOD(date?: string, startDate?: string, endDate?: string): Promise<APODResponse> {
  try {
    const qs = new URLSearchParams();
    if (startDate && endDate) {
      qs.set('start_date', startDate);
      qs.set('end_date', endDate);
    } else if (date) {
      qs.set('date', date);
    }

    const url = qs.toString() ? `/api/nasa/apod?${qs.toString()}` : `/api/nasa/apod`;
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
}

