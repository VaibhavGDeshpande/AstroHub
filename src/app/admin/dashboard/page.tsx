"use client";

import { useState, useEffect } from "react";
import type { Blog, ContentType } from "@/lib/blogsDb";
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle,
  Telescope, BookOpen, Lightbulb, BarChart3, FileText, Eye
} from "lucide-react";
import PostEditor from "@/components/admin/PostEditor";
import LoaderWrapper from "@/components/Loader";

const TYPE_CONFIG = {
  "whats-up": { label: "Eyes on the Sky", icon: Telescope, color: "blue" },
  tutorial: { label: "Tutorial", icon: BookOpen, color: "emerald" },
  explainer: { label: "Explainer", icon: Lightbulb, color: "purple" },
} as const;

function TypeBadge({ type }: { type: ContentType }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.explainer;
  const Icon = cfg.icon;
  const colors = cfg.color === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
    : cfg.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : "bg-purple-500/10 text-purple-400 border-purple-500/20";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [filterType, setFilterType] = useState<ContentType | "all">("all");

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs?all=true");
      if (res.ok) setBlogs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (blog: Partial<Blog>) => {
    const isNew = !blog.id;
    const url = isNew ? "/api/blogs" : `/api/blogs/${blog.slug}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(blog) });
      if (res.ok) { setEditingBlog(null); fetchBlogs(); }
      else alert("Error saving post. Slug might already exist.");
    } catch { alert("Error saving post"); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (res.ok) fetchBlogs();
      else alert("Error deleting post");
    } catch (e) { console.error(e); }
  };

  const filteredBlogs = filterType === "all" ? blogs : blogs.filter((b) => b.contentType === filterType);
  const totalPosts = blogs.length;
  const publishedPosts = blogs.filter((b) => b.published).length;
  const draftPosts = totalPosts - publishedPosts;
  const whatsUpPosts = blogs.filter((b) => b.contentType === "whats-up");

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
        </div>

        {editingBlog !== null ? (
          <PostEditor
            blog={editingBlog}
            onSave={handleSave}
            onCancel={() => setEditingBlog(null)}
            existingWhatsUpPosts={whatsUpPosts.map((p) => ({ slug: p.slug, title: p.title }))}
          />
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Posts", value: totalPosts, icon: FileText, color: "text-slate-400" },
                { label: "Published", value: publishedPosts, icon: Eye, color: "text-emerald-400" },
                { label: "Drafts", value: draftPosts, icon: Edit2, color: "text-amber-400" },
                { label: "Content Types", value: 3, icon: BarChart3, color: "text-blue-400" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                    <span className="text-sm text-slate-400">{s.label}</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {([
                { type: "whats-up" as ContentType, label: "Eyes on the Sky Update", desc: "Monthly sky guide", icon: Telescope, gradient: "from-blue-600 to-cyan-600" },
                { type: "tutorial" as ContentType, label: "New Tutorial", desc: "Step-by-step guide", icon: BookOpen, gradient: "from-emerald-600 to-teal-600" },
                { type: "explainer" as ContentType, label: "New Explainer", desc: "Concept article", icon: Lightbulb, gradient: "from-purple-600 to-violet-600" },
              ]).map((action) => (
                <button
                  key={action.type}
                  onClick={() => setEditingBlog({ published: false, contentType: action.type })}
                  className={`bg-gradient-to-r ${action.gradient} p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform group`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <action.icon className="w-6 h-6 text-white/80" />
                    <Plus className="w-4 h-4 text-white/60 group-hover:rotate-90 transition-transform" />
                  </div>
                  <div className="font-semibold text-white text-lg">{action.label}</div>
                  <div className="text-sm text-white/60">{action.desc}</div>
                </button>
              ))}
            </div>

            {/* Filter Tabs + Post List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="flex items-center gap-1 p-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
                {(["all", "whats-up", "tutorial", "explainer"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                      filterType === t ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    {t === "all" ? `All (${totalPosts})` : `${TYPE_CONFIG[t].label} (${blogs.filter((b) => b.contentType === t).length})`}
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
                  {filteredBlogs.map((blog) => (
                    <div key={blog.id} className="flex items-center justify-between p-4 md:px-6 hover:bg-slate-800/20 transition-colors group">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-medium text-white truncate">{blog.title}</span>
                          <TypeBadge type={blog.contentType || "explainer"} />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="font-mono">/{blog.slug}</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          {blog.author && <span>by {blog.author}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {blog.published ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Draft
                          </span>
                        )}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingBlog(blog)} className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-800" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(blog.slug)} className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </LoaderWrapper>
  );
}
