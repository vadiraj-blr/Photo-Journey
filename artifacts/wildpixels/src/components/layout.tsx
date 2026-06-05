import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-stone-100 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          onClick={location === "/" ? handleLogoClick : undefined}
          className="group flex items-center gap-2 hover:text-primary transition-colors duration-500"
        >
          <svg width="38" height="38" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
            <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="4.5" fill="currentColor"/>
            <line x1="14" y1="1" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="14" y1="22.5" x2="14" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="1" y1="14" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="22.5" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="font-serif text-3xl font-bold tracking-tight leading-none">Wildpixels</span>
        </Link>
        <div className="flex gap-8 tracking-widest uppercase text-xs font-semibold">
          <Link href="/" className="hover:text-primary transition-colors duration-500">Portfolio</Link>
          <Link href="/about" className="hover:text-primary transition-colors duration-500">About Vadiraj</Link>
          <Link href="/admin" className="hover:text-primary transition-colors duration-500">Admin</Link>
        </div>
      </nav>

      <main className="w-full">
        {children}
      </main>

      <footer className="w-full border-t border-white/8 mt-24 bg-[#080808]">
        <div className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="14" cy="14" r="4.5" fill="currentColor"/>
                <line x1="14" y1="1" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="14" y1="22.5" x2="14" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="1" y1="14" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="22.5" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="font-serif text-xl font-bold text-white/70 tracking-tight">Wildpixels</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed max-w-[220px]">
              A personal visual journal of expeditions, wildlife, and landscapes across the world.
            </p>
            <p className="text-[11px] font-mono text-white/20 uppercase tracking-widest">The Personal Legend.</p>
          </div>

          {/* Rights */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500/60 mb-1">Rights &amp; Usage</p>
            <p className="text-xs text-white/35 leading-relaxed">
              All photographs are original works by <strong className="text-white/50">Vadiraj</strong> and are protected under copyright law.
            </p>
            <p className="text-xs text-white/35 leading-relaxed">
              No image may be reproduced, distributed, or used commercially without explicit written permission from the photographer.
            </p>
            <p className="text-xs text-white/25">
              For licensing enquiries, please reach out directly.
            </p>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500/60 mb-1">Legal</p>
            <p className="text-xs text-white/35 leading-relaxed">
              &copy; {new Date().getFullYear()} Vadiraj. All rights reserved.
            </p>
            <p className="text-xs text-white/25 leading-relaxed">
              Images, text, and design on this site are the intellectual property of the photographer. Unauthorised reproduction is strictly prohibited.
            </p>
            <p className="text-xs text-white/20 mt-2">
              Built with Wildpixels — a bespoke photography portfolio.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-5 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/15">
            &copy; {new Date().getFullYear()} Vadiraj Photography &nbsp;·&nbsp; All Images Original Works &nbsp;·&nbsp; All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
