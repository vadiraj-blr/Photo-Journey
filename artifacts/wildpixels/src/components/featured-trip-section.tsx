import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetFeaturedTrips } from "@workspace/api-client-react";

export default function FeaturedTripSection() {
  const { data: featured, isLoading } = useGetFeaturedTrips();
  const trip = featured?.[0];

  if (isLoading) return null;
  if (!trip) return null;

  const excerpt = trip.storySummary?.trim() || trip.story?.slice(0, 220)?.trim();
  const displayExcerpt = excerpt
    ? excerpt.length > 220
      ? excerpt.slice(0, 220).replace(/\s+\S*$/, "") + "…"
      : excerpt
    : null;

  return (
    <section className="w-full bg-stone-900 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px w-8 bg-amber-500" />
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-amber-500">
            Fresh from the Field
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <Link href={`/trips/${trip.id}`} className="block w-full h-full group">
              <img
                src={trip.coverImageUrl || ""}
                alt={trip.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
            </Link>

            {/* Location badge */}
            <div className="absolute bottom-5 left-5 bg-stone-900/85 backdrop-blur-sm px-4 py-2 pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                {trip.location}, {trip.country}
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-stone-500 mb-4">
              Featured Expedition · {trip.month} {trip.year}
            </p>

            <h2 className="text-4xl md:text-5xl font-serif text-stone-50 leading-tight mb-6">
              {trip.title}
            </h2>

            {displayExcerpt && (
              <p className="text-stone-400 text-base leading-relaxed mb-8 max-w-lg">
                {displayExcerpt}
              </p>
            )}

            {trip.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {(trip.tags as string[]).slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono uppercase tracking-widest text-stone-500 border border-stone-700 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-3 text-sm font-mono uppercase tracking-[0.2em] text-amber-500 hover:text-amber-400 transition-colors group"
            >
              Read the Story
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
