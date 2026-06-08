"use client";

import { useState, useEffect } from "react";
import type { Blog, ContentType, CustomSeries } from "@/lib/blogsDb";
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, Clock,
  Telescope, BookOpen, Lightbulb, FileText, Eye, UserPlus, Sparkles,
  Star, Moon, Sun, Globe, Rocket, Zap, Compass, Flame,
  Camera, Mountain, Cloud, Atom, Radio, Satellite,
} from "lucide-react";
import PostEditor from "@/components/admin/PostEditor";
import SeriesManager from "@/components/admin/SeriesManager";
import AuthorBadge from "@/components/admin/AuthorBadge";
import LoaderWrapper from "@/components/Loader";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star, telescope: Telescope, moon: Moon, sun: Sun,
  sparkles: Sparkles, globe: Globe, rocket: Rocket,
  zap: Zap, compass: Compass, flame: Flame, eye: Eye,
  camera: Camera, mountain: Mountain, cloud: Cloud, atom: Atom,
  radio: Radio, satellite: Satellite,
};

const TYPE_CONFIG = {
  "whats-up": { label: "Eyes on the Sky", icon: Telescope, color: "blue" },
  tutorial: { label: "Tutorial", icon: BookOpen, color: "emerald" },
  explainer: { label: "Explainer", icon: Lightbulb, color: "purple" },
  "custom-series": { label: "Series", icon: Sparkles, color: "amber" },
} as const;

function TypeBadge({ type, seriesName, seriesColor }: { type: ContentType; seriesName?: string; seriesColor?: string }) {
  if (type === "custom-series" && seriesName) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
        style={{
          backgroundColor: `${seriesColor || '#f59e0b'}15`,
          color: seriesColor || '#f59e0b',
          borderColor: `${seriesColor || '#f59e0b'}30`,
        }}
      >
        <Sparkles className="w-3 h-3" /> {seriesName}
      </span>
    );
  }

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.explainer;
  const Icon = cfg.icon;
  const colors = cfg.color === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
    : cfg.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : cfg.color === "amber" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-purple-500/10 text-purple-400 border-purple-500/20";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

interface AuthorSession {
  author_id: string;
  author_name: string;
  display_name: string;
  role: 'author' | 'admin';
}

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [filterType, setFilterType] = useState<ContentType | "all">("all");
  const [session, setSession] = useState<AuthorSession | null>(null);
  const [customSeries, setCustomSeries] = useState<(CustomSeries & { postCount?: number })[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "series" | "authors">("posts");
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: "", password: "", display_name: "", role: "author" });
  const [addingAuthor, setAddingAuthor] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchBlogs();
    fetchSeries();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) setSession(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs?all=true");
      if (res.ok) setBlogs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchSeries = async () => {
    try {
      const res = await fetch("/api/series");
      if (res.ok) setCustomSeries(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSave = async (blog: Partial<Blog>) => {
    const isNew = !blog.id;

    // For custom series new posts, use the series-specific endpoint
    if (isNew && blog.contentType === "custom-series" && blog.series_id) {
      const series = customSeries.find((s) => s.id === blog.series_id);
      if (series) {
        try {
          const res = await fetch(`/api/series/${series.slug}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog),
          });
          if (res.ok) { setEditingBlog(null); fetchBlogs(); fetchSeries(); }
          else alert("Error saving post. Slug might already exist.");
        } catch { alert("Error saving post"); }
        return;
      }
    }

    const url = isNew ? "/api/blogs" : `/api/blogs/${blog.slug}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(blog) });
      if (res.ok) { setEditingBlog(null); fetchBlogs(); fetchSeries(); }
      else alert("Error saving post. Slug might already exist.");
    } catch { alert("Error saving post"); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (res.ok) { fetchBlogs(); fetchSeries(); }
      else alert("Error deleting post");
    } catch (e) { console.error(e); }
  };

  const handleCreateSeries = async (seriesData: Partial<CustomSeries>) => {
    try {
      const res = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seriesData),
      });
      if (res.ok) fetchSeries();
      else {
        const data = await res.json();
        alert(data.error || "Error creating series");
      }
    } catch { alert("Error creating series"); }
  };

  const handleDeleteSeries = async (id: string) => {
    try {
      // We'll delete via supabase directly through the API
      const res = await fetch(`/api/series?id=${id}`, { method: "DELETE" });
      if (res.ok) { fetchSeries(); fetchBlogs(); }
    } catch (e) { console.error(e); }
  };

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAuthor(true);
    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAuthor),
      });
      if (res.ok) {
        setNewAuthor({ name: "", password: "", display_name: "", role: "author" });
        setShowAddAuthor(false);
        alert("Author created successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Error creating author");
      }
    } catch { alert("Error creating author"); }
    finally { setAddingAuthor(false); }
  };

  const filteredBlogs = filterType === "all" ? blogs : blogs.filter((b) => b.contentType === filterType);
  const totalPosts = blogs.length;
  const scheduledPosts = blogs.filter((b) => b.published && b.publishDate && new Date(b.publishDate) > new Date()).length;
  const publishedPosts = blogs.filter((b) => b.published && !(b.publishDate && new Date(b.publishDate) > new Date())).length;
  const draftPosts = totalPosts - publishedPosts - scheduledPosts;
  const whatsUpPosts = blogs.filter((b) => b.contentType === "whats-up");

  // Find series info from the blogs' metadata
  const getSeriesInfo = (blog: Blog) => {
    if (blog.contentType !== "custom-series") return {};
    const series = customSeries.find((s) => s.id === blog.series_id);
    return { seriesName: blog.seriesName || series?.name, seriesColor: series?.color };
  };

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Publishing Dashboard</h1>
            <p className="text-slate-400">Manage your AstroHub articles and posts.</p>
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <AuthorBadge
                authorName={session.author_name}
                displayName={session.display_name}
                role={session.role}
              />
            )}
          </div>
        </div>

        {editingBlog !== null ? (
          <PostEditor
            blog={editingBlog}
            onSave={handleSave}
            onCancel={() => setEditingBlog(null)}
            existingWhatsUpPosts={whatsUpPosts.map((p) => ({ slug: p.slug, title: p.title }))}
            customSeries={customSeries}
            authorName={session?.display_name || session?.author_name}
          />
        ) : (
          <>
            {/* Main Navigation Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5 w-fit">
              {([
                { key: "posts", label: "Posts", icon: FileText },
                { key: "series", label: "Series", icon: Sparkles },
                ...(session?.role === "admin" ? [{ key: "authors", label: "Authors", icon: UserPlus }] : []),
              ] as { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "posts" | "series" | "authors")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ========== POSTS TAB ========== */}
            {activeTab === "posts" && (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                  {[
                    { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-slate-400" },
                    { label: "Published", value: publishedPosts, icon: Eye, color: "text-emerald-400" },
                    { label: "Scheduled", value: scheduledPosts, icon: Clock, color: "text-blue-400" },
                    { label: "Drafts", value: draftPosts, icon: Edit2, color: "text-amber-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <s.icon className={`w-4 h-4 md:w-5 md:h-5 ${s.color}`} />
                        <span className="text-xs md:text-sm text-slate-400 truncate">{s.label}</span>
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
                  {([
                    { type: "whats-up" as ContentType, label: "Eyes on the Sky", desc: "Monthly sky guide", icon: Telescope, gradient: "from-blue-600 to-cyan-600" },
                    { type: "tutorial" as ContentType, label: "New Tutorial", desc: "Step-by-step guide", icon: BookOpen, gradient: "from-emerald-600 to-teal-600" },
                    { type: "explainer" as ContentType, label: "New Explainer", desc: "Concept article", icon: Lightbulb, gradient: "from-purple-600 to-violet-600" },
                    // Add quick actions for custom series
                    ...customSeries.map((s) => ({
                      type: "custom-series" as ContentType,
                      label: s.name,
                      desc: s.description || "Custom series post",
                      icon: ICON_MAP[s.icon] || Star,
                      gradient: "from-amber-600 to-orange-600",
                      seriesId: s.id,
                      seriesSlug: s.slug,
                      seriesName: s.name,
                    })),
                  ]).map((action, idx) => (
                    <button
                      key={`${action.type}-${idx}`}
                      onClick={() => {
                        if (action.type === "custom-series" && 'seriesId' in action) {
                          setEditingBlog({
                            published: false,
                            contentType: "custom-series",
                            series_id: action.seriesId,
                            seriesSlug: action.seriesSlug,
                            seriesName: action.seriesName,
                            author: session?.display_name || session?.author_name || "",
                          });
                        } else {
                          setEditingBlog({
                            published: false,
                            contentType: action.type,
                            author: session?.display_name || session?.author_name || "",
                          });
                        }
                      }}
                      className={`bg-gradient-to-r ${action.gradient} p-4 md:p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform group`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
                        <Plus className="w-3 h-3 md:w-4 md:h-4 text-white/60 group-hover:rotate-90 transition-transform" />
                      </div>
                      <div className="font-semibold text-white text-base md:text-lg leading-tight">{action.label}</div>
                      <div className="text-xs text-white/60 mt-0.5">{action.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Filter Tabs + Post List */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="flex items-center gap-1 p-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
                    {(["all", "whats-up", "tutorial", "explainer", "custom-series"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                          filterType === t ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        {t === "all" ? `All (${totalPosts})`
                          : t === "custom-series" ? `Series (${blogs.filter((b) => b.contentType === "custom-series").length})`
                          : `${TYPE_CONFIG[t].label} (${blogs.filter((b) => b.contentType === t).length})`}
                      </button>
                    ))}
                  </div>

                  {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading posts...</div>
                  ) : filteredBlogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Edit2 className="w-6 h-6" />
                      </div>
                      <p className="text-lg mb-2">No posts found.</p>
                      <p className="text-sm text-slate-500">Create your first post using the buttons above.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/50">
                      {filteredBlogs.map((blog) => {
                        const { seriesName, seriesColor } = getSeriesInfo(blog);
                        return (
                          <div key={blog.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 hover:bg-slate-800/20 transition-colors group gap-4 md:gap-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-md">{blog.title}</span>
                                <TypeBadge type={blog.contentType || "explainer"} seriesName={seriesName} seriesColor={seriesColor} />
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span className="font-mono hidden sm:inline">/{blog.slug}</span>
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                {blog.author && <span className="hidden sm:inline">by {blog.author}</span>}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t border-slate-800/50 md:border-0 pt-3 md:pt-0">
                              <div className="flex items-center gap-2">
                                {blog.published && blog.publishDate && new Date(blog.publishDate) > new Date() ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> Scheduled
                                  </span>
                                ) : blog.published ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> Published
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <XCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> Draft
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex gap-1 md:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingBlog(blog)} className="text-slate-400 hover:text-blue-400 p-2 rounded-lg hover:bg-slate-800 bg-slate-800/50 md:bg-transparent" title="Edit">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(blog.slug)} className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 bg-slate-800/50 md:bg-transparent" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ========== SERIES TAB ========== */}
            {activeTab === "series" && (
              <SeriesManager
                series={customSeries}
                onCreateSeries={handleCreateSeries}
                onSelectSeries={() => {
                  // Switch to posts tab, filtered to custom-series
                  setFilterType("custom-series");
                  setActiveTab("posts");
                }}
                onDeleteSeries={handleDeleteSeries}
              />
            )}

            {/* ========== AUTHORS TAB (Admin Only) ========== */}
            {activeTab === "authors" && session?.role === "admin" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Author Management</h2>
                  <button
                    onClick={() => setShowAddAuthor(!showAddAuthor)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-medium transition-all"
                  >
                    {showAddAuthor ? <XCircle className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {showAddAuthor ? "Cancel" : "Add Author"}
                  </button>
                </div>

                {showAddAuthor && (
                  <form
                    onSubmit={handleAddAuthor}
                    className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Login Name *</label>
                        <input
                          type="text"
                          required
                          value={newAuthor.name}
                          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                          placeholder="Username for login"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Password *</label>
                        <input
                          type="password"
                          required
                          value={newAuthor.password}
                          onChange={(e) => setNewAuthor({ ...newAuthor, password: e.target.value })}
                          placeholder="Min 4 characters"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                        <input
                          type="text"
                          value={newAuthor.display_name}
                          onChange={(e) => setNewAuthor({ ...newAuthor, display_name: e.target.value })}
                          placeholder="Shown on published posts"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                        <select
                          value={newAuthor.role}
                          onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        >
                          <option value="author">Author (own posts only)</option>
                          <option value="admin">Admin (all posts + manage authors)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAuthor(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingAuthor}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {addingAuthor ? "Creating..." : "Create Author"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <p className="text-sm text-slate-400">
                    Each author logs in with their <span className="text-white font-medium">name</span> and{" "}
                    <span className="text-white font-medium">password</span>. Authors can only see and edit
                    their own posts. Admins can see all posts and manage other authors.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </LoaderWrapper>
  );
}
