// api_service/nivlCollection.ts
import axios from "axios";

export async function getNivlCollection(collectionUrl: string): Promise<string[]> {
  try {
    const response = await axios.get<string[]>(collectionUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // array of URLs (videos, images, metadata, etc.)
  } catch (error) {
    console.error("Error fetching NIVL collection:", error);
    throw error;
  }
}
