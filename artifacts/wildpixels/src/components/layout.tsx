import { Link } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-stone-100 p-6 flex justify-between items-center tracking-widest uppercase text-xs font-semibold">
        <Link href="/" className="hover:text-primary transition-colors duration-500">Wildpixels</Link>
        <div className="flex gap-8">
          <Link href="/" className="hover:text-primary transition-colors duration-500">Portfolio</Link>
          <Link href="/about" className="hover:text-primary transition-colors duration-500">About Vadiraj</Link>
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