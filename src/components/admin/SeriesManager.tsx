"use client";

import { useState } from "react";
import type { CustomSeries } from "@/lib/blogsDb";
import { SERIES_ICONS } from "@/lib/blogsDb";
import {
  X, Plus, Trash2,
  Star, Telescope, Moon, Sun, Sparkles, Orbit,
  Globe, Rocket, Zap, Compass, Flame, Eye,
  Camera, Mountain, Cloud, Atom, Radio, Satellite,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star, telescope: Telescope, moon: Moon, sun: Sun,
  sparkles: Sparkles, orbit: Orbit, globe: Globe, rocket: Rocket,
  zap: Zap, compass: Compass, flame: Flame, eye: Eye,
  camera: Camera, mountain: Mountain, cloud: Cloud, atom: Atom,
  radio: Radio, satellite: Satellite,
};

const COLOR_OPTIONS = [
  "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#f97316", "#14b8a6", "#6366f1",
];

interface SeriesManagerProps {
  series: (CustomSeries & { postCount?: number })[];
  onCreateSeries: (series: Partial<CustomSeries>) => Promise<void>;
  onSelectSeries: (series: CustomSeries) => void;
  onDeleteSeries: (id: string) => Promise<void>;
}

export default function SeriesManager({
  series,
  onCreateSeries,
  onSelectSeries,
  onDeleteSeries,
}: SeriesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "star",
    color: "#8b5cf6",
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm({ ...form, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreateSeries(form);
      setForm({ name: "", slug: "", description: "", icon: "star", color: "#8b5cf6" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Custom Series</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Series"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 space-y-5 animate-in slide-in-from-top-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Series Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Deep Sky Diaries"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">URL Slug</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A brief description of this series..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {SERIES_ICONS.map((iconName) => {
                const IconComp = ICON_MAP[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setForm({ ...form, icon: iconName })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      form.icon === iconName
                        ? "border-purple-500 bg-purple-500/20 text-purple-400 scale-110"
                        : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                    }`}
                    title={iconName}
                  >
                    {IconComp && <IconComp className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Badge Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    form.color === c
                      ? "border-white scale-125 shadow-lg"
                      : "border-transparent hover:border-slate-600"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Series"}
            </button>
          </div>
        </form>
      )}

      {/* Series Grid */}
      {series.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-400 mb-1">No custom series yet</p>
          <p className="text-sm text-slate-500">Create a series to organize your posts into themed collections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {series.map((s) => {
            const IconComp = ICON_MAP[s.icon] || Star;
            return (
              <div
                key={s.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all group cursor-pointer"
                onClick={() => onSelectSeries(s)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}20`, color: s.color }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${s.name}" and all its posts?`)) {
                          onDeleteSeries(s.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{s.name}</h3>
                {s.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">{s.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${s.color}15`,
                      color: s.color,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    {s.postCount ?? 0} post{(s.postCount ?? 0) !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-slate-600 font-mono">/{s.slug}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
