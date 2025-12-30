import { MessierApiResponse } from "@/types/messier";

export async function getMessierCatalog(): Promise<MessierApiResponse> {
  const response = await fetch("/api/messier", { cache: "no-store" });
  const data = (await response.json()) as MessierApiResponse;

  if (!response.ok || data.success === false) {
    const message = data.error || "Failed to load Messier catalog";
    throw new Error(message);
  }

  return data;
}
