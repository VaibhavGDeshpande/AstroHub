// api/epicImage.ts
import { getEPIC } from "./epic";

// const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

export async function getEpicThumbsImage(date?: string, imageIndex: number = 0): Promise<string> {
    try {
        const epicData = await getEPIC(date);
        
        if (!epicData || epicData.length === 0) {
            throw new Error("No EPIC data available for this date");
        }

        const { image, date: imageDate } = epicData[imageIndex];
        
        // Format date for the archive URL (YYYY/MM/DD)
        const formattedDate = imageDate.split(' ')[0].replace(/-/g, '/');
        
        return `https://epic.gsfc.nasa.gov/archive/natural/${formattedDate}/thumbs/${image}.jpg`;
    } catch (error) {
        console.error("Error generating EPIC image URL:", error);
        throw error;
    }
}

export async function getEpicData(date?: string): Promise<{ images: { image: string; date: string }[], imageUrls: string[] }> {
    try {
        const epicData = await getEPIC(date);
        
        if (!epicData || epicData.length === 0) {
            return { images: [], imageUrls: [] };
        }

        const imageUrls = await Promise.all(
            epicData.map(async (_, index) => {
                return await getEpicThumbsImage(date, index);
            })
        );

        return {
            images: epicData,
            imageUrls
        };
    } catch (error) {
        console.error("Error fetching EPIC data:", error);
        throw error;
    }
}

export default getEpicThumbsImage;
