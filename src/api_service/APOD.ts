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
    let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`;
    
    // Add date parameters
    if (startDate && endDate) {
      url += `&start_date=${startDate}&end_date=${endDate}`;
    } else if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);

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

