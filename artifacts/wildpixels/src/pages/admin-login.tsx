import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        setLocation("/admin");
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Login failed. Check your credentials.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500 mb-2">Wildpixels</p>
          <h1 className="text-3xl font-serif font-bold text-white">Admin Access</h1>
          <p className="text-white/35 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/60 transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/60 transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-2.5 border border-red-400/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8">
          Wildpixels · Private Admin
        </p>
      </div>
    </div>
  );
}
