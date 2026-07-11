import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

function SubscribeFooterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-xs text-amber-700 font-medium">
        ✓ You're subscribed. Watch your inbox for new stories.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading"}
        className="flex-1 min-w-0 text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="text-xs px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "…" : "Notify me"}
      </button>
    </form>
  );
}

function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const base = (import.meta as { env: { BASE_URL: string } }).env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/auth/me`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : { authenticated: false })
      .then((d) => setIsAdmin(d.authenticated === true))
      .catch(() => setIsAdmin(false));
  }, []);
  return isAdmin;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAdmin = useIsAdmin();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-stone-900">
      <nav className="fixed top-0 left-0 w-full z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200/60 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          onClick={location === "/" ? handleLogoClick : undefined}
          className="group flex items-center gap-2 hover:text-amber-600 transition-colors duration-500"
        >
          <svg width="38" height="38" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="4.5" fill="currentColor"/>
            <line x1="14" y1="1" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="14" y1="22.5" x2="14" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="1" y1="14" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="22.5" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="font-serif text-3xl font-bold tracking-tight leading-none">Wildpixels</span>
        </Link>
        <div className="flex gap-8 tracking-widest uppercase text-xs font-semibold text-stone-800">
          <Link href="/" className="hover:text-amber-600 transition-colors duration-500">Portfolio</Link>
          <Link href="/about" className="hover:text-amber-600 transition-colors duration-500">About Vadiraj</Link>
          {isAdmin && <Link href="/admin" className="hover:text-amber-600 transition-colors duration-500">Admin</Link>}
        </div>
      </nav>

      <main className="w-full">
        {children}
      </main>

      <footer className="w-full border-t border-stone-300 mt-24 bg-stone-50">
        <div className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="14" cy="14" r="4.5" fill="currentColor"/>
                <line x1="14" y1="1" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="14" y1="22.5" x2="14" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="1" y1="14" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="22.5" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">Wildpixels</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed max-w-[220px]">
              A personal visual journal of expeditions, wildlife, and landscapes across the world.
            </p>
            <p className="text-[11px] font-mono text-stone-700 uppercase tracking-widest">The Personal Legend.</p>
          </div>

          {/* Subscribe CTA */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-1">Stay in the Loop</p>
            <p className="text-xs text-stone-800 leading-relaxed">
              Get notified when a new field note or journey is published. No noise — just the good stuff.
            </p>
            <SubscribeFooterCta />
          </div>

          {/* Rights */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-1">Rights &amp; Usage</p>
            <p className="text-xs text-stone-800 leading-relaxed">
              All photographs are original works by <strong className="text-stone-900 font-semibold">Vadiraj</strong> and are protected under copyright law.
            </p>
            <p className="text-xs text-stone-800 leading-relaxed">
              No image may be reproduced, distributed, or used commercially without explicit written permission from the photographer.
            </p>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-1">Legal</p>
            <p className="text-xs text-stone-900 font-medium leading-relaxed">
              &copy; {new Date().getFullYear()} Vadiraj. All rights reserved.
            </p>
            <p className="text-xs text-stone-800 leading-relaxed">
              Images, text, and design on this site are the intellectual property of the photographer. Unauthorised reproduction is strictly prohibited.
            </p>
            <p className="text-xs text-stone-700 mt-2">
              Built with Wildpixels — a bespoke photography portfolio.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-300 py-5 text-center bg-stone-100">
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-800">
            &copy; {new Date().getFullYear()} Vadiraj Photography &nbsp;·&nbsp; All Images Original Works &nbsp;·&nbsp; All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
