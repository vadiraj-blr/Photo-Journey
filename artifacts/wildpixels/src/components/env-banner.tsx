export function EnvBanner() {
  const isProd = import.meta.env.PROD;

  if (isProd) {
    return (
      <div className="w-full bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest text-center py-2 px-4">
        Live site — changes here are visible to visitors immediately
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest text-center py-2 px-4">
      Workspace preview — changes here will NOT appear on your published site. Edit on the live site's admin panel instead.
    </div>
  );
}
