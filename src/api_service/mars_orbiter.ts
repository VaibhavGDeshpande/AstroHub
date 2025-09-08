interface MarsOrbiter {
  id: number;
  sol: number;
  camera: { name: string; full_name: string };
  img_src: string;
  earth_date: string;
}

interface MarsPhotosResponse {
  photos: MarsOrbiter[];
}

export async function getMarsPhotos(
  rover: 'curiosity' ,
  earthDate?: string,
  startDate?: string,
  endDate?: string
): Promise<MarsPhotosResponse> {
  try {
    // Build query parameters
    const qs = new URLSearchParams();
    if (earthDate) {
      qs.set('earth_date', earthDate);
    }
    if (startDate && endDate) {
      qs.set('start_date', startDate);
      qs.set('end_date', endDate);
    }

    // Construct the API URL
    const url = `/api/nasa/mars-photos/${rover}?${qs.toString()}`;
    
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MarsPhotosResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Mars photos:', error);
    throw error;
  }
}
