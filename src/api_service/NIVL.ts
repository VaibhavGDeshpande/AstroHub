import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  NivlSearchParams,
  NivlSearchResponse,
  NivlAssetResponse,
  NivlItem
} from '../types/nivl'; // Adjust import path as needed



// Create axios instance with default config
const nasaApi = axios.create({
  baseURL: 'https://images-api.nasa.gov',
  timeout: 30000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for logging and error handling
nasaApi.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
nasaApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Search NASA media collection with robust error handling and typing
 */
export async function searchNasaMedia(
  params: NivlSearchParams
): Promise<NivlSearchResponse> {
  try {
    // Validate parameters
    if (!params.q && Object.keys(params).length === 0) {
      throw new Error('At least one search parameter is required');
    }

    const response: AxiosResponse<NivlSearchResponse> = await nasaApi.get('/search', {
      params: {
        ...params,
        page: params.page || 1,
        page_size: params.page_size || 100,
      },
      paramsSerializer: {
        indexes: null, // Prevents array parameters from using bracket notation
      },
    });

    // Validate response structure
    if (!response.data?.collection?.items) {
      throw new Error('Invalid response structure from NASA API');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        `NASA API search failed: ${axiosError.response?.status} - ${axiosError.response?.statusText}`
      );
    }
    throw new Error(`NASA API search failed: ${(error as Error).message}`);
  }
}

/**
 * Get asset URLs for a specific NASA item
 */
export async function getNasaAssets(nasaId: string): Promise<string[]> {
  try {
    if (!nasaId || typeof nasaId !== 'string') {
      throw new Error('Valid NASA ID is required');
    }

    const response: AxiosResponse<NivlAssetResponse> = await nasaApi.get(`/asset/${nasaId}`);

    if (!response.data?.collection?.items) {
      throw new Error('Invalid asset response structure');
    }

    // Extract asset URLs
    const assetUrls = response.data.collection.items
      .filter(item => item.href)
      .map(item => item.href);

    if (assetUrls.length === 0) {
      throw new Error('No assets found for the given NASA ID');
    }

    return assetUrls;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        `Failed to fetch assets: ${axiosError.response?.status} - ${axiosError.response?.statusText}`
      );
    }
    throw new Error(`Failed to fetch assets: ${(error as Error).message}`);
  }
}

/**
 * Get metadata for a specific NASA item
 */
export async function getNasaMetadata(nasaId: string): Promise<NivlItem> {
  try {
    if (!nasaId || typeof nasaId !== 'string') {
      throw new Error('Valid NASA ID is required');
    }

    const response: AxiosResponse<NivlSearchResponse> = await nasaApi.get('/search', {
      params: {
        nasa_id: nasaId,
      },
    });

    if (!response.data?.collection?.items?.[0]) {
      throw new Error('No metadata found for the given NASA ID');
    }

    return response.data.collection.items[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        `Failed to fetch metadata: ${axiosError.response?.status} - ${axiosError.response?.statusText}`
      );
    }
    throw new Error(`Failed to fetch metadata: ${(error as Error).message}`);
  }
}

/**
 * Comprehensive search with pagination support
 */
export async function comprehensiveSearch(
  params: NivlSearchParams & { maxResults?: number }
): Promise<{ items: NivlItem[]; totalHits: number }> {
  const { maxResults, ...searchParams } = params;
  const pageSize = Math.min(searchParams.page_size || 100, 100); // NASA API max is 100
  let allItems: NivlItem[] = [];
  let currentPage = searchParams.page || 1;
  let totalHits = 0;

  try {
    while (true) {
      const response = await searchNasaMedia({
        ...searchParams,
        page: currentPage,
        page_size: pageSize,
      });

      if (currentPage === 1) {
        totalHits = response.collection.metadata.total_hits;
      }

      const items = response.collection.items;
      allItems = [...allItems, ...items];

      // Break conditions
      const hasMorePages = items.length === pageSize;
      const reachedMaxResults = maxResults && allItems.length >= maxResults;

      if (!hasMorePages || reachedMaxResults) {
        break;
      }

      currentPage++;
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Trim to max results if specified
    if (maxResults && allItems.length > maxResults) {
      allItems = allItems.slice(0, maxResults);
    }

    return { items: allItems, totalHits };
  } catch (error) {
    throw new Error(`Comprehensive search failed: ${(error as Error).message}`);
  }
}

// Utility function to create search parameters from filters
export function createSearchParams(filters: {
  query: string;
  mediaType: 'all' | 'image' | 'video' | 'audio';
  center: string;
  yearStart: string;
  yearEnd: string;
  keywords: string;
  photographer: string;
  location: string;
}): NivlSearchParams {
  const params: NivlSearchParams = {};

  if (filters.query) params.q = filters.query;
  if (filters.mediaType !== 'all') params.media_type = filters.mediaType;
  if (filters.center) params.center = filters.center;
  if (filters.yearStart) params.year_start = filters.yearStart;
  if (filters.yearEnd) params.year_end = filters.yearEnd;
  if (filters.keywords) params.keywords = filters.keywords;
  if (filters.photographer) params.photographer = filters.photographer;
  if (filters.location) params.location = filters.location;

  return params;
}
