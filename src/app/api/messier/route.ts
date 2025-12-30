import { NextResponse } from "next/server";
import { MessierEntry, MessierObject, MessierInfo } from "@/types/messier";

const MESSIER_SOURCE = "https://osricdienda.com/messier-api/messier.json";

export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await fetch(MESSIER_SOURCE, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": "astrohub/messier-proxy" },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch Messier catalog",
          details: body || `Status ${response.status}`,
        },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as {
      data?: Record<string, MessierObject>;
      info?: MessierInfo;
    };

    const catalog = (payload?.data ?? {}) as Record<string, MessierObject>;

    const normalized: MessierEntry[] = Object.entries(catalog)
      .map(([id, value]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => a.messierNumber - b.messierNumber);

    return NextResponse.json({
      success: true,
      data: normalized,
      info: payload?.info ?? null,
    });
  } catch (error) {
    console.error("Messier API proxy failed:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected server error while loading Messier catalog" },
      { status: 500 },
    );
  }
}
