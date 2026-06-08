"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, UserPlus } from "lucide-react";
import LoaderWrapper from "@/components/Loader";

export default function AdminLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(false);
  const [checkingFirstRun, setCheckingFirstRun] = useState(true);
  const router = useRouter();

  // Check if any authors exist — if not, show "Create First Author" mode
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/authors");
        if (res.ok) {
          const authors = await res.json();
          setIsFirstRun(Array.isArray(authors) && authors.length === 0);
        }
      } catch {
        // ignore — default to login mode
      } finally {
        setCheckingFirstRun(false);
      }
    })();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isFirstRun) {
        // Create the first author (auto-admin)
        const createRes = await fetch("/api/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password, display_name: name }),
        });

        if (!createRes.ok) {
          const data = await createRes.json();
          setError(data.error || "Failed to create author");
          return;
        }
      }

      // Now log in
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (checkingFirstRun) {
    return (
      <LoaderWrapper>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      </LoaderWrapper>
    );
  }

  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border ${
              isFirstRun
                ? "bg-emerald-900/50 border-emerald-700"
                : "bg-slate-800 border-slate-700"
            }`}>
              {isFirstRun ? (
                <UserPlus className="w-8 h-8 text-emerald-400" />
              ) : (
                <Lock className="w-8 h-8 text-purple-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isFirstRun ? "Welcome to AstroHub" : "Admin Portal"}
            </h1>
            <p className="text-slate-400 text-center text-sm">
              {isFirstRun
                ? "Create your first admin account to get started."
                : "Enter your credentials to access the publishing dashboard."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {isFirstRun ? "Choose a Name" : "Author Name"}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-600"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {isFirstRun ? "Choose a Password" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder={isFirstRun ? "Create a password" : "Enter password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-600"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 text-white ${
                isFirstRun
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              }`}
            >
              {loading
                ? (isFirstRun ? "Creating Account..." : "Verifying...")
                : (isFirstRun ? "Create Admin Account" : "Sign In")}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {isFirstRun && (
            <p className="text-xs text-slate-500 text-center mt-4">
              This will be your admin account. You can add more authors later from the dashboard.
            </p>
          )}
        </div>
      </motion.div>
    </div>
    </LoaderWrapper>
  );
}
