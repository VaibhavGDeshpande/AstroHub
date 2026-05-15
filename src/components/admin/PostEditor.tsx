"use client";

import { useState, useEffect } from "react";
import type { Blog, ContentType, DifficultyLevel, SkyEvent, VisualAid } from "@/lib/blogsDb";
import { TOPIC_CATEGORIES, MONTHS } from "@/lib/blogsDb";
import RichTextEditor from "@/components/RichTextEditor";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";

interface PostEditorProps {
  blog: Partial<Blog>;
  onSave: (blog: Partial<Blog>) => Promise<void>;
  onCancel: () => void;
  existingWhatsUpPosts: { slug: string; title: string }[];
}

const inputClass = "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors";
const labelClass = "block text-sm font-medium text-slate-400 mb-2";
const selectClass = "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer";

export default function PostEditor({ blog, onSave, onCancel, existingWhatsUpPosts }: PostEditorProps) {
  const [form, setForm] = useState<Partial<Blog>>({
    contentType: "explainer",
    published: false,
    author: " ",
    skyEvents: [],
    toolsNeeded: [],
    keyConcepts: [],
    visualAids: [],
    ...blog,
  });
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [conceptInput, setConceptInput] = useState("");

  useEffect(() => {
    setForm({
      contentType: "explainer",
      published: false,
      author: " ",
      skyEvents: [],
      toolsNeeded: [],
      keyConcepts: [],
      visualAids: [],
      ...blog,
    });
  }, [blog]);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm({ ...form, title, slug: form.id ? form.slug : slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  // Sky events helpers
  const addSkyEvent = () => {
    setForm({
      ...form,
      skyEvents: [...(form.skyEvents || []), { title: "", date: "", description: "", visibility: "" }],
    });
  };
  const updateSkyEvent = (idx: number, field: keyof SkyEvent, value: string) => {
    const events = [...(form.skyEvents || [])];
    events[idx] = { ...events[idx], [field]: value };
    setForm({ ...form, skyEvents: events });
  };
  const removeSkyEvent = (idx: number) => {
    setForm({ ...form, skyEvents: (form.skyEvents || []).filter((_, i) => i !== idx) });
  };

  // Visual aids helpers
  const addVisualAid = () => {
    setForm({ ...form, visualAids: [...(form.visualAids || []), { url: "", caption: "" }] });
  };
  const updateVisualAid = (idx: number, field: keyof VisualAid, value: string) => {
    const aids = [...(form.visualAids || [])];
    aids[idx] = { ...aids[idx], [field]: value };
    setForm({ ...form, visualAids: aids });
  };
  const removeVisualAid = (idx: number) => {
    setForm({ ...form, visualAids: (form.visualAids || []).filter((_, i) => i !== idx) });
  };

  // Tag helpers
  const addTag = (type: "toolsNeeded" | "keyConcepts", input: string, setInput: (v: string) => void) => {
    const val = input.trim();
    if (!val) return;
    const arr = [...(form[type] || [])];
    if (!arr.includes(val)) arr.push(val);
    setForm({ ...form, [type]: arr });
    setInput("");
  };
  const removeTag = (type: "toolsNeeded" | "keyConcepts", idx: number) => {
    setForm({ ...form, [type]: (form[type] || []).filter((_, i) => i !== idx) });
  };

  const contentType = form.contentType || "explainer";

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          {form.id ? "Edit Post" : "Create New Post"}
        </h2>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Type Selector */}
        <div>
          <label className={labelClass}>Content Type</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: "whats-up", label: "Eyes on the Sky", color: "blue" },
              { value: "tutorial", label: "Tutorial", color: "emerald" },
              { value: "explainer", label: "Explainer", color: "purple" },
            ] as const).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, contentType: t.value as ContentType })}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  contentType === t.value
                    ? t.color === "blue" ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : t.color === "emerald" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-purple-500/20 border-purple-500/50 text-purple-400"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Title *</label>
            <input type="text" required value={form.title || ""} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>URL Slug</label>
            <input type="text" required value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={`${inputClass} font-mono text-sm`} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Author</label>
            <input type="text" value={form.author ?? ""} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="AstroHub" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Publish Date</label>
            <input type="date" value={form.publishDate ? new Date(form.publishDate).toISOString().slice(0, 10) : ""} onChange={(e) => setForm({ ...form, publishDate: e.target.value ? new Date(e.target.value).toISOString() : null })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input type="url" value={form.coverImage || ""} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://images.unsplash.com/..." className={inputClass} />
          {form.coverImage && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 h-40">
              <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Short Excerpt *</label>
          <textarea required rows={2} value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={`${inputClass} resize-none`} />
        </div>

        {/* ========== WHAT'S UP SPECIFIC ========== */}
        {contentType === "whats-up" && (
          <div className="space-y-6 p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <h3 className="text-lg font-semibold text-blue-400">Sky Update Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className={labelClass}>Month *</label>
                <select value={form.skyMonth ?? ""} onChange={(e) => setForm({ ...form, skyMonth: parseInt(e.target.value) })} className={selectClass}>
                  <option value="">Select Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-10 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <label className={labelClass}>Year *</label>
                <select value={form.skyYear ?? ""} onChange={(e) => setForm({ ...form, skyYear: parseInt(e.target.value) })} className={selectClass}>
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-10 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <label className={labelClass}>Previous Month Post</label>
              <select value={form.previousMonthSlug || ""} onChange={(e) => setForm({ ...form, previousMonthSlug: e.target.value })} className={selectClass}>
                <option value="">Auto-detect or none</option>
                {existingWhatsUpPosts.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-10 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Sky Events Repeater */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass + " mb-0"}>Sky Events</label>
                <button type="button" onClick={addSkyEvent} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Event
                </button>
              </div>
              <div className="space-y-4">
                {(form.skyEvents || []).map((evt, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Event title" value={evt.title} onChange={(e) => updateSkyEvent(idx, "title", e.target.value)} className={inputClass + " text-sm"} />
                        <input type="text" placeholder="Date (e.g. May 5)" value={evt.date} onChange={(e) => updateSkyEvent(idx, "date", e.target.value)} className={inputClass + " text-sm"} />
                      </div>
                      <button type="button" onClick={() => removeSkyEvent(idx)} className="text-slate-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea placeholder="Description" rows={2} value={evt.description} onChange={(e) => updateSkyEvent(idx, "description", e.target.value)} className={`${inputClass} text-sm resize-none`} />
                    <input type="text" placeholder="Visibility (optional)" value={evt.visibility || ""} onChange={(e) => updateSkyEvent(idx, "visibility", e.target.value)} className={inputClass + " text-sm"} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== TUTORIAL SPECIFIC ========== */}
        {contentType === "tutorial" && (
          <div className="space-y-6 p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-lg font-semibold text-emerald-400">Tutorial Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className={labelClass}>Difficulty Level</label>
                <select value={form.difficultyLevel || ""} onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value as DifficultyLevel })} className={selectClass}>
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDown className="absolute right-4 top-10 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div>
                <label className={labelClass}>Estimated Read Time (min)</label>
                <input type="number" min={1} value={form.estimatedReadTime || ""} onChange={(e) => setForm({ ...form, estimatedReadTime: parseInt(e.target.value) || undefined })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Tools / Equipment Needed</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("toolsNeeded", tagInput, setTagInput); } }} placeholder="Type and press Enter" className={inputClass + " text-sm"} />
                <button type="button" onClick={() => addTag("toolsNeeded", tagInput, setTagInput)} className="px-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-sm shrink-0">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.toolsNeeded || []).map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    {t} <button type="button" onClick={() => removeTag("toolsNeeded", i)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== EXPLAINER SPECIFIC ========== */}
        {contentType === "explainer" && (
          <div className="space-y-6 p-5 rounded-xl border border-purple-500/20 bg-purple-500/5">
            <h3 className="text-lg font-semibold text-purple-400">Explainer Details</h3>
            <div className="relative">
              <label className={labelClass}>Topic Category</label>
              <select value={form.topicCategory || ""} onChange={(e) => setForm({ ...form, topicCategory: e.target.value })} className={selectClass}>
                <option value="">Select Category</option>
                {TOPIC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-10 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div>
              <label className={labelClass}>Key Concepts</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={conceptInput} onChange={(e) => setConceptInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("keyConcepts", conceptInput, setConceptInput); } }} placeholder="Type and press Enter" className={inputClass + " text-sm"} />
                <button type="button" onClick={() => addTag("keyConcepts", conceptInput, setConceptInput)} className="px-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-sm shrink-0">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.keyConcepts || []).map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    {c} <button type="button" onClick={() => removeTag("keyConcepts", i)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            {/* Visual Aids */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass + " mb-0"}>Visual Aids</label>
                <button type="button" onClick={addVisualAid} className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Visual
                </button>
              </div>
              {(form.visualAids || []).map((aid, idx) => (
                <div key={idx} className="flex gap-3 mb-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input type="url" placeholder="Image URL" value={aid.url} onChange={(e) => updateVisualAid(idx, "url", e.target.value)} className={inputClass + " text-sm"} />
                    <input type="text" placeholder="Caption" value={aid.caption} onChange={(e) => updateVisualAid(idx, "caption", e.target.value)} className={inputClass + " text-sm"} />
                  </div>
                  <button type="button" onClick={() => removeVisualAid(idx)} className="text-slate-500 hover:text-red-400 p-1 mt-3"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rich Text Content */}
        <div>
          <label className={labelClass}>Content *</label>
          <RichTextEditor content={form.content || ""} onChange={(html) => setForm({ ...form, content: html })} />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published || false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-5 h-5 rounded border-slate-700 bg-slate-900 focus:ring-blue-500 accent-blue-500" />
          <label htmlFor="published" className="text-white font-medium cursor-pointer">
            {form.publishDate && new Date(form.publishDate) > new Date()
              ? `Schedule post (will go live on ${new Date(form.publishDate).toLocaleDateString()})`
              : "Publish to live website"}
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-800">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50">
            {saving ? "Saving..." : (form.published && form.publishDate && new Date(form.publishDate) > new Date() ? "Schedule Post" : "Save Post")}
          </button>
        </div>
      </form>
    </div>
  );
}
