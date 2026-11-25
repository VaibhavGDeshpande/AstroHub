"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import PhotoCard, { type GalleryPhoto } from "@/components/Gallery/PhotoCard";

type Pending = GalleryPhoto & { created_at: string };

export default function GalleryModerationPage() {
  const [photos, setPhotos] = useState<Pending[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(async (res) => {
        if (res.status === 401) throw new Error("Only admins can moderate the gallery.");
        if (!res.ok) throw new Error("Could not load submissions.");
        setPhotos(await res.json());
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  async function act(id: string, method: "PATCH" | "DELETE") {
    if (method === "DELETE" && !confirm("Reject this photo? The submission and its image file are deleted permanently.")) return;
    setBusy(id);
    const res = await fetch(`/api/gallery/${id}`, { method });
    setBusy(null);
    if (res.ok) setPhotos((list) => list?.filter((p) => p.id !== id) ?? null);
    else setError(method === "PATCH" ? "Approving failed, please try again." : "Rejecting failed, please try again.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Gallery queue</h1>
        <p className="text-slate-400 mb-8">Approve photos to publish them on <Link href="/gallery" className="text-cyan-400 hover:underline">/gallery</Link>. Rejecting deletes them.</p>

        {error && <p className="text-red-400 mb-6" role="alert">{error}</p>}
        {!photos && !error && <p className="text-slate-500">Loading…</p>}
        {photos?.length === 0 && <p className="text-slate-400">Nothing waiting for review.</p>}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {photos?.map((photo) => (
            <PhotoCard key={photo.id} photo={photo}>
              <p className="text-xs text-slate-500">Submitted {new Date(photo.created_at).toLocaleString()}</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => act(photo.id, "PATCH")}
                  disabled={busy === photo.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-50"
                >
                  <Check className="w-4 h-4" aria-hidden /> Approve
                </button>
                <button
                  onClick={() => act(photo.id, "DELETE")}
                  disabled={busy === photo.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-sm font-semibold disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" aria-hidden /> Reject
                </button>
              </div>
            </PhotoCard>
          ))}
        </div>
      </div>
    </main>
  );
}
