import { NEOResponse } from "../types/neo";

export async function getNEO(start_date:string, end_date:string): Promise<NEOResponse>{
    try {
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`;        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching NEO:', error);
        throw error;
    }
}