"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Shield, User } from "lucide-react";
import { useState } from "react";

interface AuthorBadgeProps {
  authorName: string;
  displayName: string;
  role: 'author' | 'admin';
}

export default function AuthorBadge({ authorName, displayName, role }: AuthorBadgeProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      // Force redirect even on error
      router.push("/admin/login");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
          {(displayName || authorName || "?")[0].toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-white leading-tight">{displayName || authorName}</div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            {role === 'admin' && <Shield className="w-2.5 h-2.5 text-amber-400" />}
            <span className={role === 'admin' ? 'text-amber-400' : ''}>{role === 'admin' ? 'Admin' : 'Author'}</span>
          </div>
        </div>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-800">
              <div className="text-sm font-medium text-white">{displayName || authorName}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                {role === 'admin' && <Shield className="w-3 h-3 text-amber-400" />}
                {role === 'admin' ? 'Administrator' : 'Author'}
              </div>
            </div>
            <Link
              href="/admin/profile"
              onClick={() => setShowMenu(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
