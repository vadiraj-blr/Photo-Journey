import { motion } from "framer-motion";
import { useGetTripStats, useListTrips } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";

interface AboutSettings {
  highlightPhotoUrls: string[];
  aboutTitle: string;
  aboutPortraitUrl: string;
  aboutBio: string;
}

interface TripRow {
  id: number;
  location: string;
  country: string;
  year: number;
}

function useAboutSettings() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return useQuery<AboutSettings>({
    queryKey: ["about-settings"],
    queryFn: () => fetch(`${base}/api/settings`).then((r) => r.json()),
    staleTime: 60_000,
  });
}

// Seeded pseudo-random for consistent layout
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const SIZE_CLASSES = [
  "text-3xl md:text-4xl font-serif",
  "text-xl md:text-2xl font-sans font-light",
  "text-base font-mono uppercase tracking-widest",
  "text-2xl md:text-3xl font-serif italic",
  "text-sm font-sans uppercase tracking-widest",
  "text-lg font-serif",
  "text-2xl font-sans font-semibold",
  "text-xs font-mono uppercase tracking-[0.2em]",
];

const OPACITY_CLASSES = [
  "text-white/70",
  "text-white/40",
  "text-white/55",
  "text-amber-400/60",
  "text-white/30",
  "text-white/65",
  "text-amber-500/40",
  "text-white/45",
];

export default function About() {
  const { data: stats } = useGetTripStats();
  const { data: settings } = useAboutSettings();
  const { data: tripsRaw } = useListTrips();
  const trips = (tripsRaw as TripRow[] | undefined) ?? [];

  const highlights: string[] = settings?.highlightPhotoUrls ?? [];
  const aboutTitle = settings?.aboutTitle ?? "The Lens.";
  const portraitUrl = settings?.aboutPortraitUrl ?? "/images/about-portrait.png";
  const bioRaw = settings?.aboutBio ?? "";

  // Collect unique locations from trips
  const placeWords: string[] = [];
  const seen = new Set<string>();
  for (const trip of trips) {
    const loc = trip.location?.trim();
    const country = trip.country?.trim();
    if (loc && !seen.has(loc)) { seen.add(loc); placeWords.push(loc); }
    if (country && !seen.has(country)) { seen.add(country); placeWords.push(country); }
  }

  const paragraphs = bioRaw
    ? bioRaw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : [
        "Vadiraj is not just an observer; he is a participant in the wild. For over a decade, his work has documented the raw, unpolished truth of nature's most formidable landscapes.",
        "From the mist-shrouded peaks of Patagonia to the golden savannas of the Serengeti, his visual diary captures moments of profound silence and fierce power. This portfolio is a curated collection of a personal legend.",
      ];

  return (
    <div className="w-full bg-black min-h-screen pt-32 pb-24 text-stone-100">

      {/* Hero: Portrait + Bio */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-[3/4] w-full max-w-[500px] mx-auto"
        >
          <div className="absolute -inset-4 border border-primary/20" />
          <img
            src={portraitUrl}
            alt="Vadiraj in the wilderness"
            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-primary">
            {aboutTitle}
          </h1>
          <div className="space-y-6 text-lg text-muted-foreground font-sans font-light leading-relaxed max-w-lg">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="pt-8 border-t border-border grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="block text-4xl font-serif text-stone-100">{stats?.tripCount || 0}</span>
              <span className="block text-xs uppercase tracking-widest text-primary">Expeditions</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl font-serif text-stone-100">{stats?.countryCount || 0}</span>
              <span className="block text-xs uppercase tracking-widest text-primary">Countries</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl font-serif text-stone-100">{stats?.photoCount || 0}</span>
              <span className="block text-xs uppercase tracking-widest text-primary">Captures</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Places Word Map */}
      {placeWords.length > 0 && (
        <div className="mt-32 relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-10"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/25">Places Witnessed</p>
          </motion.div>

          <div className="px-8 md:px-16 flex flex-wrap justify-center items-baseline gap-x-6 gap-y-4 max-w-[1100px] mx-auto">
            {placeWords.map((place, i) => {
              const r1 = seededRand(i * 3);
              const r2 = seededRand(i * 3 + 1);
              const sizeClass = SIZE_CLASSES[Math.floor(r1 * SIZE_CLASSES.length)];
              const opacityClass = OPACITY_CLASSES[Math.floor(r2 * OPACITY_CLASSES.length)];
              return (
                <motion.span
                  key={place}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 8) * 0.06 }}
                  className={`${sizeClass} ${opacityClass} leading-tight select-none cursor-default hover:text-amber-400/80 transition-colors duration-500`}
                >
                  {place}
                </motion.span>
              );
            })}
          </div>
        </div>
      )}

      {/* Curated Highlights */}
      {highlights.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-32">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs uppercase tracking-widest text-primary mb-16"
          >
            Curated Highlights
          </motion.h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {highlights.map((url, i) => {
              const displayUrl = url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w1200";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.15 }}
                  className="break-inside-avoid mb-6 overflow-hidden"
                >
                  <img
                    src={displayUrl}
                    alt={`Highlight ${i + 1}`}
                    className="w-full object-cover"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
