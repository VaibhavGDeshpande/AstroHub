import axios from "axios";
import { NivlSearchResponse, NivlSearchParams, NivlAssetResponse } from "../types/nivl";

// Create HTTP client for NASA NIVL API
const http = axios.create({
  baseURL: "https://images-api.nasa.gov",
  timeout: 15000,
});

// Search NASA API by query (param comes from frontend)
export const searchNivl = async (
  params: NivlSearchParams
): Promise<{ data: NivlSearchResponse; href: string }> => {
  try {
    const res = await http.get<NivlSearchResponse>("/search", { params });
    const href = res.data.collection.href;
    return { data: res.data, href };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`NIVL API Error: ${error.response?.statusText || error.message}`);
    }
    throw new Error("Network error occurred while searching NIVL");
  }
};

// Fetch data from href (chained call)
export const fetchFromHref = async (query: string) => {
  try {
    const { href, data } = await searchNivl({q: query});

    // Call the href directly
    const res = await axios.get(href);

    return { searchResults: data, hrefData: res.data };
  } catch (error) {
    console.error("Error in fetchFromHref:", error);
    throw error;
  }
};

// Get asset details by NASA ID
export const getNivlAsset = async (nasaId: string): Promise<NivlAssetResponse> => {
  try {
    const res = await http.get<NivlAssetResponse>(`/asset/${encodeURIComponent(nasaId)}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`NIVL Asset Error: ${error.response?.statusText || error.message}`);
    }
    throw new Error('Network error occurred while fetching asset');
  }
};

// Get asset metadata by NASA ID (best-effort; API may return a JSON with a URL to a metadata file)
export const getNivlMetadata = async (nasaId: string) => {
  try {
    const res = await http.get(`/metadata/${encodeURIComponent(nasaId)}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`NIVL Metadata Error: ${error.response?.statusText || error.message}`);
    }
    throw new Error('Network error occurred while fetching metadata');
  }
};
