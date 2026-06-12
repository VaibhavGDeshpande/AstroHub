"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, Loader2, Users } from "lucide-react";

interface Author {
  id: string;
  display_name: string;
  avatar_url: string;
}

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch authors
    const fetchAuthors = async () => {
      try {
        const res = await fetch("/api/authors/public");
        if (res.ok) {
          const data = await res.json();
          setAuthors(data);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          author_id: selectedAuthor === "all" ? null : selectedAuthor,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Successfully subscribed! Check your inbox for updates.");
        setEmail("");
        document.cookie = "astrohub_subscribed=true; path=/; max-age=31536000; SameSite=Lax";
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="relative group max-w-lg mx-auto mt-12 w-full">
      {/* Background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-700/50 mb-4">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Never Miss an Update
          </h3>
          <p className="text-slate-400 mt-2 text-sm">
            Get the latest cosmic discoveries and articles delivered straight to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Authors (Everything AstroHub)</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.display_name} Only
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            <div className="flex items-center justify-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-3.5 rounded-[11px] text-white font-medium">
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe Now"
              )}
            </div>
          </button>
        </form>

        {/* Status Messages */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-400">{message}</p>
          </motion.div>
        )}
        
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{message}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
