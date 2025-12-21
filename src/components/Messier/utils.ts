import { MessierEntry } from "@/types/messier";

export type SortOption = "number" | "brightness" | "distance";

export const formatLabel = (value: string) => {
  const trimmed = (value || "").trim();
  if (!trimmed) return "Unknown";
  return trimmed
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export const difficultyTone = (value: string) => {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("easy")) return "bg-emerald-500/15 text-emerald-200 border-emerald-500/30";
  if (normalized.includes("moderate")) return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  return "bg-rose-500/15 text-rose-200 border-rose-500/30";
};

export const seasonTone = (value: string) => {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("winter")) return "bg-sky-500/15 text-sky-200 border-sky-500/30";
  if (normalized.includes("spring")) return "bg-green-500/15 text-green-200 border-green-500/30";
  if (normalized.includes("summer")) return "bg-orange-500/15 text-orange-200 border-orange-500/30";
  if (normalized.includes("autumn") || normalized.includes("fall")) return "bg-purple-500/15 text-purple-200 border-purple-500/30";
  return "bg-slate-500/15 text-slate-200 border-slate-500/30";
};

export const sortCatalog = (items: MessierEntry[], sortBy: SortOption) => {
  return [...items].sort((a, b) => {
    if (sortBy === "brightness") {
      return (a.magnitude ?? Number.MAX_SAFE_INTEGER) - (b.magnitude ?? Number.MAX_SAFE_INTEGER);
    }
    if (sortBy === "distance") {
      return (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER);
    }
    return a.messierNumber - b.messierNumber;
  });
};

export const formatMagnitude = (value?: number) => (typeof value === "number" ? value.toFixed(1) : "N/A");

export const formatDistance = (value?: number) =>
  typeof value === "number" ? `${value.toLocaleString()} ly` : "N/A";

export const buildOptionMap = (items: MessierEntry[], getValue: (item: MessierEntry) => string) => {
  const lookup = new Map<string, string>();
  items.forEach((item) => {
    const rawValue = getValue(item);
    const normalized = (rawValue || "").toLowerCase();
    if (!normalized) return;
    lookup.set(normalized, rawValue);
  });
  return lookup;
};

