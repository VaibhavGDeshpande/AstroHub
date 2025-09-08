// lib/api/nasa.ts (or wherever your API functions are located)
import { NEOResponse } from "../types/neo";

export async function getNEO(start_date: string, end_date: string): Promise<NEOResponse> {
    try {
        // Use your internal API route instead of direct NASA API
        const url = `/api/nasa/neo?start_date=${start_date}&end_date=${end_date}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            // Parse error response from your API route
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`API error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching NEO:', error);
        throw error;
    }
}
