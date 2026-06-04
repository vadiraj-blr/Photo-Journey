import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetFeaturedTrips, useListTrips, useGetTripStats } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";

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

export default function Home() {
  const { data: featuredTrips } = useGetFeaturedTrips();
  const { data: allTrips } = useListTrips();
  const { data: stats } = useGetTripStats();
  const { data: settings } = useLandingSettings();

  // Hero image: settings override → first featured trip → first trip
  const fallbackTrip = featuredTrips?.[0] || allTrips?.[0];
  const heroImageUrl = settings?.heroImageUrl || fallbackTrip?.coverImageUrl || "";
  const heroTagline = settings?.heroTagline || "Enter the Wild.";

  // Trip grid: 0 = show all, otherwise slice to that count
  const limit = settings?.tripsOnHomepage ?? 0;
  const displayedTrips = limit > 0 ? (allTrips ?? []).slice(0, limit) : (allTrips ?? []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-black">
        {heroImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={heroImageUrl}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

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
