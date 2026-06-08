"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle,
  KeyRound,
  Lock,
  Save,
  Shield,
  User,
} from "lucide-react";
import LoaderWrapper from "@/components/Loader";

type AuthorProfile = {
  id: string;
  name: string;
  display_name: string;
  avatar_url: string;
  role: "author" | "admin";
  created_at: string;
  updated_at: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AdminProfilePage() {
  const router = useRouter();
  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/authors/me");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (!res.ok) {
          setProfileError("Unable to load profile.");
          return;
        }

        const data = await res.json();
        setAuthor(data.author);
        setDisplayName(data.author.display_name || data.author.name);
        setAvatarUrl(data.author.avatar_url || "");
      } catch {
        setProfileError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileMessage("");

    try {
      const res = await fetch("/api/authors/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: displayName, avatar_url: avatarUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Unable to update profile.");
        return;
      }

      setAuthor(data.author);
      setDisplayName(data.author.display_name || data.author.name);
      setAvatarUrl(data.author.avatar_url || "");
      setProfileMessage("Profile updated.");
      router.refresh();
    } catch {
      setProfileError("Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordError("");
    setPasswordMessage("");

    try {
      const res = await fetch("/api/authors/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Unable to change password.");
        return;
      }

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordMessage("Password changed.");
    } catch {
      setPasswordError("Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <LoaderWrapper>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-slate-400">Loading profile...</div>
        </div>
      </LoaderWrapper>
    );
  }

  if (!author) {
    return (
      <LoaderWrapper>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {profileError || "Profile not found."}
          </div>
        </div>
      </LoaderWrapper>
    );
  }

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 pt-24 md:pt-32">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName || author.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-slate-500" />
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Author Profile</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span className="font-mono">@{author.name}</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
                    {author.role === "admin" && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                    {author.role === "admin" ? "Admin" : "Author"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Joined {new Date(author.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
            <form onSubmit={saveProfile} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Profile Details</h2>
                <p className="text-sm text-slate-500">Public author information shown around published content.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Login Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={author.name}
                    disabled
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  maxLength={80}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Avatar URL</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                    maxLength={500}
                  />
                </div>
              </div>

              {profileError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <AlertCircle className="w-4 h-4" /> {profileError}
                </div>
              )}
              {profileMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle className="w-4 h-4" /> {profileMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>

            <form onSubmit={changePassword} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Password</h2>
                <p className="text-sm text-slate-500">Update the password used for the admin portal.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <AlertCircle className="w-4 h-4" /> {passwordError}
                </div>
              )}
              {passwordMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle className="w-4 h-4" /> {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                {savingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
}
