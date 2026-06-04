import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useGetTrip, getGetTripQueryKey, useListPhotos, getListPhotosQueryKey } from "@workspace/api-client-react";

export default function Trip() {
  const { id } = useParams();
  const tripId = Number(id);

  const { data: trip, isLoading: isTripLoading } = useGetTrip(tripId, {
    query: {
      enabled: !!tripId,
      queryKey: getGetTripQueryKey(tripId)
    }
  });

  const { data: photos, isLoading: isPhotosLoading } = useListPhotos({ tripId }, {
    query: {
      enabled: !!tripId,
      queryKey: getListPhotosQueryKey({ tripId })
    }
  });

  if (isTripLoading || isPhotosLoading) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
        <p className="text-primary text-xs uppercase tracking-widest animate-pulse">Loading Expedition...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-stone-100">
        <h1 className="text-4xl font-serif">Trip not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-stone-100">
      
      {/* Immersive Cover */}
      <section className="relative w-full h-[80vh] md:h-[100dvh]">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
          <img 
            src={trip.coverImageUrl} 
            alt={trip.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-16 max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="text-primary text-xs uppercase tracking-widest mb-4 flex items-center gap-4">
              <span>{trip.location}, {trip.country}</span>
              <span className="w-8 h-px bg-primary/50"></span>
              <span>{trip.month} {trip.year}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif tracking-tight leading-none mb-6">
              {trip.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      {trip.story && (
        <section className="max-w-[800px] mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl font-serif font-light leading-loose text-stone-300"
          >
            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-primary first-letter:float-left first-letter:mr-4 first-letter:-mt-2">
              {trip.story}
            </p>
          </motion.div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos?.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
              className="break-inside-avoid mb-6 relative group overflow-hidden"
            >
              <img 
                src={photo.imageUrl} 
                alt={photo.caption || "Expedition photo"}
                className="w-full auto-rows-auto object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-700"
              />
              {photo.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-sm font-sans font-light text-stone-200">
                    {photo.caption}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}