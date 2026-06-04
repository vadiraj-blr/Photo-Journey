import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useGetFeaturedTrips, useListTrips, useGetTripStats } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface LandingSettings {
  heroImageUrl: string;
  heroImageSourceTripId: number | null;
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

function useHeroSlideshow(tripId: number | null | undefined) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [photos, setPhotos] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!tripId) { setPhotos([]); return; }
    fetch(`${base}/api/trips/${tripId}/google-photos`)
      .then((r) => r.json())
      .then((data) => {
        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos);
          setIndex(0);
        }
      })
      .catch(() => {});
  }, [tripId, base]);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 3000);
    return () => clearInterval(id);
  }, [photos.length]);

  return { photos, index };
}

export default function Home() {
  const { data: featuredTrips } = useGetFeaturedTrips();
  const { data: allTrips } = useListTrips();
  const { data: stats } = useGetTripStats();
  const { data: settings } = useLandingSettings();

  const heroTagline = settings?.heroTagline || "Enter the Wild.";
  const limit = settings?.tripsOnHomepage ?? 0;
  const displayedTrips = limit > 0 ? (allTrips ?? []).slice(0, limit) : (allTrips ?? []);

  const { photos: slideshowPhotos, index: slideshowIndex } = useHeroSlideshow(settings?.heroImageSourceTripId);

  // Determine hero source: slideshow album > static URL > trip cover fallback
  const hasSlideshowAlbum = slideshowPhotos.length > 0;
  const fallbackTrip = featuredTrips?.[0] || allTrips?.[0];
  const staticHeroUrl = settings?.heroImageUrl || fallbackTrip?.coverImageUrl || "";

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-black">

        {hasSlideshowAlbum ? (
          <AnimatePresence mode="sync">
            <motion.div
              key={slideshowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={slideshowPhotos[slideshowIndex].replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w1920"}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        ) : staticHeroUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={staticHeroUrl}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : null}

        <div className="relative z-20 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-serif text-stone-100 tracking-tight"
          >
            {heroTagline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 flex justify-center gap-12 text-sm tracking-widest text-primary font-mono uppercase"
          >
            <span>{stats?.tripCount ?? allTrips?.length ?? "—"} Trips</span>
            <span>{stats?.countryCount ?? "—"} Countries</span>
            <span>{stats?.photoCount ?? "—"} Photos</span>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-32">
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
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <img
                    src={trip.coverImageUrl || "/images/texture-1.png"}
                    alt={trip.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <h3 className="text-2xl font-serif text-stone-100 mb-2">{trip.title}</h3>
                <p className="text-muted-foreground uppercase tracking-widest text-xs">{trip.location}, {trip.country}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
