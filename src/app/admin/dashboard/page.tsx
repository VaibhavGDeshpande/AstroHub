"use client";

import { useState, useEffect } from "react";
import { Blog } from "@/lib/blogsDb";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs?all=true");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    const isNew = !editingBlog.id;
    const url = isNew ? "/api/blogs" : `/api/blogs/${editingBlog.slug}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBlog),
      });

      if (res.ok) {
        setEditingBlog(null);
        fetchBlogs();
      } else {
        alert("Error saving blog. Slug might already exist.");
      }
    } catch {
      alert("Error saving blog");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert("Error deleting blog");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Publishing Dashboard</h1>
            <p className="text-slate-400">Manage your AstroHub articles and posts.</p>
          </div>
          <button
            onClick={() => setEditingBlog({ published: false })}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        {editingBlog !== null ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingBlog.id ? "Edit Post" : "Create New Post"}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingBlog({ ...editingBlog, title, slug: editingBlog.id ? editingBlog.slug : slug });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.slug || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={editingBlog.coverImage || ""}
                  onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Short Excerpt</label>
                <textarea
                  required
                  rows={2}
                  value={editingBlog.excerpt || ""}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Content</label>
                <RichTextEditor 
                  content={editingBlog.content || ""} 
                  onChange={(html) => setEditingBlog({ ...editingBlog, content: html })} 
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingBlog.published || false}
                  onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-white font-medium cursor-pointer">
                  Publish to live website
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  Save Post
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading posts...</div>
            ) : blogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Edit2 className="w-6 h-6" />
                </div>
                <p className="text-lg mb-4">No posts yet. Start writing!</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800">
                    <th className="p-4 font-semibold text-slate-400">Title</th>
                    <th className="p-4 font-semibold text-slate-400 w-32">Status</th>
                    <th className="p-4 font-semibold text-slate-400 w-48">Date</th>
                    <th className="p-4 font-semibold text-slate-400 w-32 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{blog.title}</div>
                        <div className="text-sm text-slate-500 font-mono">/{blog.slug}</div>
                      </td>
                      <td className="p-4">
                        {blog.published ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setEditingBlog(blog)}
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.slug)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
