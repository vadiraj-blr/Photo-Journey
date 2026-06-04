import { motion } from "framer-motion";
import { useGetTripStats, useGetHighlightPhotos } from "@workspace/api-client-react";

export default function About() {
  const { data: stats } = useGetTripStats();
  const { data: highlightPhotos } = useGetHighlightPhotos();

  return (
    <div className="w-full bg-black min-h-screen pt-32 pb-24 text-stone-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-[3/4] w-full max-w-[500px] mx-auto"
        >
          <div className="absolute -inset-4 border border-primary/20" />
          <img 
            src="/images/about-portrait.png" 
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
            The Lens.
          </h1>
          
          <div className="space-y-6 text-lg text-muted-foreground font-sans font-light leading-relaxed max-w-lg">
            <p>
              Vadiraj is not just an observer; he is a participant in the wild. For over a decade, his work has documented the raw, unpolished truth of nature's most formidable landscapes.
            </p>
            <p>
              From the mist-shrouded peaks of Patagonia to the golden savannas of the Serengeti, his visual diary captures moments of profound silence and fierce power. This portfolio is a curated collection of a personal legend.
            </p>
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

      {highlightPhotos && highlightPhotos.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-32">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs uppercase tracking-widest text-primary mb-16"
          >
            Curated Highlights
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlightPhotos.slice(0, 3).map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="aspect-[4/5]"
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption || "Highlight photo"}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}