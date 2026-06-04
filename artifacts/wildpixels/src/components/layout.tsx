import { Link } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-stone-100 px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 hover:text-primary transition-colors duration-500">
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
        {/* Nav links */}
        <div className="flex gap-8 tracking-widest uppercase text-xs font-semibold">
          <Link href="/" className="hover:text-primary transition-colors duration-500">Portfolio</Link>
          <Link href="/about" className="hover:text-primary transition-colors duration-500">About Vadiraj</Link>
          <Link href="/admin" className="hover:text-primary transition-colors duration-500">Admin</Link>
        </div>
      </nav>
      <main className="w-full">
        {children}
      </main>
      <footer className="w-full py-16 border-t border-border mt-24 text-center text-muted-foreground text-sm tracking-widest uppercase">
        <p>Vadiraj Photography &copy; {new Date().getFullYear()}</p>
        <p className="mt-2">The Personal Legend.</p>
      </footer>
    </div>
  );
}