import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useListTrips, useGetTripStats } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import FeaturedTripSection from "../components/featured-trip-section";

const MONTH_INDEX: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

function tripDateValue(trip: { year: number; month: string }): number {
  const monthIdx = MONTH_INDEX[trip.month?.toLowerCase()?.trim()] ?? 0;
  return trip.year * 12 + monthIdx;
}

function sortTrips<T extends { title: string; year: number; month: string }>(
  trips: T[],
  sortBy: SortOption,
): T[] {
  const sorted = [...trips];
  switch (sortBy) {
    case "date-asc":
      return sorted.sort((a, b) => tripDateValue(a) - tripDateValue(b));
    case "date-desc":
      return sorted.sort((a, b) => tripDateValue(b) - tripDateValue(a));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

interface LandingSettings {
  heroImageUrl: string;
  heroImageSourceTripId: number | null;
  heroAlbumUrl: string | null;
  tripsOnHomepage: number;
  heroTagline: string;
}

function useLandingSettings() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return useQuery<LandingSettings>({
    queryKey: ["landing-settings"],
    queryFn: () => fetch(`${base}/api/settings`).then((r) => r.json()),
    staleTime: 30_000,
  });
}

function useHeroSlideshow(heroAlbumUrl: string | null | undefined) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { data } = useQuery<{ photos: string[] }>({
    queryKey: ["hero-photos"],
    queryFn: () => fetch(`${base}/api/settings/hero-photos`).then((r) => r.json()),
    enabled: !!heroAlbumUrl,
    staleTime: 300_000,
  });

  const photos = data?.photos ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 3000);
    return () => clearInterval(id);
  }, [photos.length]);

  return { photos, index };
}

export default function Home() {
  const { data: allTrips } = useListTrips();
  const { data: stats } = useGetTripStats();
  const { data: settings } = useLandingSettings();
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const heroTagline = settings?.heroTagline || "Enter the Wild.";
  const limit = settings?.tripsOnHomepage ?? 0;
  const sortedTrips = useMemo(() => sortTrips(allTrips ?? [], sortBy), [allTrips, sortBy]);
  const displayedTrips = limit > 0 ? sortedTrips.slice(0, limit) : sortedTrips;

  const { photos: slideshowPhotos, index: slideshowIndex } = useHeroSlideshow(settings?.heroAlbumUrl);

  const hasSlideshowAlbum = slideshowPhotos.length > 0;
  const staticHeroUrl = settings?.heroImageUrl || allTrips?.[0]?.coverImageUrl || "";

  return (
    <div className="w-full bg-stone-50">
      {/* Hero Section — stays dark for full-bleed photography impact */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-stone-900">

        {hasSlideshowAlbum ? (
          <AnimatePresence mode="sync">
            <motion.div
              key={slideshowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center bg-stone-900"
            >
              <div className="absolute inset-0 bg-black/15 z-10" />
              <img
                src={slideshowPhotos[slideshowIndex].replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w1920"}
                alt="Hero"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
        ) : staticHeroUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center bg-stone-900"
          >
            <div className="absolute inset-0 bg-black/15 z-10" />
            <img
              src={staticHeroUrl}
              alt="Hero"
              className="w-full h-full object-contain"
            />
          </motion.div>
        ) : null}

        <div className="absolute top-0 left-0 right-0 z-20 text-center px-6 pt-20 md:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-serif text-stone-50 tracking-tight"
          >
            {heroTagline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 flex justify-center gap-12 text-sm tracking-widest text-amber-400 font-mono uppercase"
          >
            <span>{(stats as typeof stats & { placeCount?: number })?.placeCount ?? "—"} Places</span>
            <span>{stats?.photoCount ?? "—"} Photos</span>
          </motion.div>
        </div>

        {/* Scroll down arrow */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 cursor-pointer group"
          aria-label="Scroll down"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.button>
      </section>

      <FeaturedTripSection />

      {/* Grid Section */}
      <section id="trip-grid" className="max-w-[1600px] mx-auto px-6 md:px-12 py-32">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 leading-tight">Trip Reports</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-stone-600 mt-2">Field journals from India's wild places</p>
          </div>
          <label className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-stone-600">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent border border-stone-300 text-stone-800 text-[10px] font-mono uppercase tracking-widest px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
          {displayedTrips.map((trip, idx) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
            >
              <Link href={`/trips/${trip.id}`} className="group block cursor-pointer">
                <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <img
                    src={trip.coverImageUrl || "/images/texture-1.png"}
                    alt={trip.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <h3 className="text-2xl font-serif text-stone-900 mb-2">{trip.title}</h3>
                <p className="text-stone-600 uppercase tracking-widest text-xs">{trip.location}, {trip.country}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
