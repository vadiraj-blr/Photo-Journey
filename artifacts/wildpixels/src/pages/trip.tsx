import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { useGetTrip, getGetTripQueryKey, useListPhotos, getListPhotosQueryKey, getListTripsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface GooglePhoto {
  url: string;
}

interface Comment {
  id: number;
  name: string;
  body: string;
  createdAt: string;
}

function useReactions(tripId: number) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });
  const STORAGE_KEY = `trip_reaction_${tripId}`;
  const [voted, setVoted] = useState<"like" | "dislike" | null>(() => {
    try { return (localStorage.getItem(STORAGE_KEY) as "like" | "dislike" | null) ?? null; } catch { return null; }
  });

  useEffect(() => {
    if (!tripId) return;
    fetch(`${base}/api/trips/${tripId}/reactions`)
      .then(r => r.json())
      .then(data => setCounts({ likes: data.likes ?? 0, dislikes: data.dislikes ?? 0 }))
      .catch(() => {});
  }, [tripId]);

  const react = async (type: "like" | "dislike") => {
    let action: string;
    if (voted === type) {
      // toggle off
      action = type === "like" ? "unlike" : "undislike";
      setVoted(null);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    } else {
      // undo previous vote first if exists
      if (voted) {
        await fetch(`${base}/api/trips/${tripId}/reactions`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: voted === "like" ? "unlike" : "undislike" }),
        });
      }
      action = type;
      setVoted(type);
      try { localStorage.setItem(STORAGE_KEY, type); } catch {}
    }
    const res = await fetch(`${base}/api/trips/${tripId}/reactions`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: action }),
    });
    const data = await res.json();
    setCounts({ likes: data.likes ?? 0, dislikes: data.dislikes ?? 0 });
  };

  return { counts, voted, react };
}

function useComments(tripId: number) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!tripId) return;
    fetch(`${base}/api/trips/${tripId}/comments`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setComments(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(() => { load(); }, [load]);

  const post = async (name: string, body: string): Promise<{ ok: boolean; error?: string }> => {
    const res = await fetch(`${base}/api/trips/${tripId}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, body }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to post comment." };
    setComments(prev => [data, ...prev]);
    return { ok: true };
  };

  return { comments, loading, post };
}

function CommentsSection({ tripId }: { tripId: number }) {
  const { counts, voted, react } = useReactions(tripId);
  const { comments, loading: commentsLoading, post } = useComments(tripId);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!name.trim() || !body.trim()) { setError("Name and comment are required."); return; }
    setSubmitting(true);
    const result = await post(name.trim(), body.trim());
    setSubmitting(false);
    if (result.ok) { setBody(""); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    else setError(result.error ?? "Something went wrong.");
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-stone-200 placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24">
      {/* Reactions */}
      <div className="flex items-center gap-6 mb-14">
        <div className="flex items-center gap-4 mb-0">
          <p className="text-xs font-mono uppercase tracking-widest text-white/30">Reactions</p>
          <div className="h-px w-8 bg-white/10" />
        </div>
        <button
          onClick={() => react("like")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${voted === "like" ? "border-primary bg-primary/20 text-primary" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"}`}
        >
          <svg className="w-4 h-4" fill={voted === "like" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>{counts.likes}</span>
        </button>
        <button
          onClick={() => react("dislike")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${voted === "dislike" ? "border-red-400/60 bg-red-400/10 text-red-400" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"}`}
        >
          <svg className="w-4 h-4 rotate-180" fill={voted === "dislike" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>{counts.dislikes}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-white/30">Comments</p>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/20">{comments.length}</span>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-12 space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          className={inputCls}
        />
        <textarea
          ref={textareaRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share your thoughts about this expedition…"
          rows={4}
          maxLength={1000}
          className={`${inputCls} resize-none`}
        />
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-white/25">{body.length}/1000</div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-primary text-black text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {submitting ? "Posting…" : "Post Comment"}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-primary text-xs">Comment posted!</p>}
      </form>

      {/* Comments list */}
      {commentsLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-t border-primary rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-white/20 text-sm py-10">Be the first to leave a comment.</p>
      ) : (
        <div className="space-y-6">
          {comments.map(c => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/8 rounded-xl px-5 py-4 bg-white/3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-200">{c.name}</span>
                <span className="text-xs text-white/25">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed whitespace-pre-wrap">{c.body}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function useGooglePhotos(tripId: number, hasGooglePhotosUrl: boolean) {
  const [photos, setPhotos] = useState<GooglePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasGooglePhotosUrl || !tripId) return;
    setLoading(true);
    setError(null);
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/trips/${tripId}/google-photos`)
      .then((r) => r.json())
      .then((data) => {
        if (data.photos && Array.isArray(data.photos)) {
          setPhotos(data.photos.map((url: string) => ({ url })));
        }
      })
      .catch(() => setError("Could not load Google Photos"))
      .finally(() => setLoading(false));
  }, [tripId, hasGooglePhotosUrl]);

  return { photos, loading, error };
}

function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: { url: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [dir, setDir] = useState(0);

  const prev = useCallback(() => {
    setDir(-1);
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback(() => {
    setDir(1);
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const photo = photos[current];
  const fullUrl = photo.url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w2048";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">
          {current + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/8 border border-transparent hover:border-white/15"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to gallery
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev button */}
        <button
          onClick={prev}
          className="absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
          aria-label="Previous photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.img
            key={current}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={fullUrl}
            alt={`Photo ${current + 1}`}
            className="max-h-[calc(100vh-140px)] max-w-[calc(100vw-100px)] object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={next}
          className="absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
          aria-label="Next photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex-shrink-0 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none" }}
      >
        {photos.map((p, i) => {
          const thumb = p.url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w80-h80-c";
          return (
            <button
              key={i}
              onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
              className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                i === current ? "border-amber-500 opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Trip() {
  const { id } = useParams();
  const tripId = Number(id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Always start at the top of the page when entering a trip
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tripId]);

  // Use already-cached list data as instant placeholder so the hero shows
  // immediately without any spinner when navigating from the trip grid.
  const placeholderData = () => {
    const cached = queryClient.getQueryData<{ id: number; [k: string]: unknown }[]>(
      getListTripsQueryKey()
    );
    return cached?.find((t) => t.id === tripId) as typeof trip | undefined;
  };

  const { data: trip, isLoading: isTripLoading } = useGetTrip(tripId, {
    query: {
      enabled: !!tripId,
      queryKey: getGetTripQueryKey(tripId),
      placeholderData,
    },
  });

  const { data: dbPhotos } = useListPhotos({ tripId }, {
    query: {
      enabled: !!tripId,
      queryKey: getListPhotosQueryKey({ tripId }),
    },
  });

  const tripData = trip as { googlePhotosUrl?: string | null; galleryPhotoUrls?: string[] } | undefined;
  const hasGooglePhotos = !!tripData?.googlePhotosUrl;
  const pinnedGallery: string[] = tripData?.galleryPhotoUrls ?? [];
  // Always fetch Google Photos when a URL is set
  const { photos: googlePhotos, loading: gLoading } = useGooglePhotos(tripId, hasGooglePhotos);

  // Only block on loading when there's no cached placeholder to show
  if (isTripLoading && !trip) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin" />
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

  const googlePhotosUrl = (trip as { googlePhotosUrl?: string | null }).googlePhotosUrl;

  // Priority: Google Photos (loaded) > pinned gallery > DB photos
  // Only show Google Photos section if still loading OR photos actually arrived
  const googlePhotosReady = !gLoading && googlePhotos.length > 0;
  const googlePhotosLoading = hasGooglePhotos && gLoading;
  const showGooglePhotos = googlePhotosLoading || googlePhotosReady;
  const hasPinnedGallery = pinnedGallery.length > 0;
  // Fall back to pinned gallery / DB photos when Google Photos failed / empty
  const showPinnedGallery = !showGooglePhotos && hasPinnedGallery;
  const showDbPhotos = !showGooglePhotos && !hasPinnedGallery && dbPhotos && dbPhotos.length > 0;

  // Build flat list for lightbox
  const lightboxPhotos: { url: string }[] = googlePhotosReady
    ? googlePhotos
    : hasPinnedGallery
    ? pinnedGallery.map((url) => ({ url }))
    : showDbPhotos
    ? dbPhotos.map((p) => ({ url: p.imageUrl }))
    : [];

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
              <span className="w-8 h-px bg-primary/50" />
              <span>{trip.month} {trip.year}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif tracking-tight leading-none mb-6">
              {trip.title}
            </h1>
          </motion.div>
        </div>

        {/* Scroll down arrow */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 cursor-pointer"
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

      {/* Pinned Gallery (curated from admin) */}
      {showPinnedGallery && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40">Expedition Gallery</p>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {pinnedGallery.map((url, i) => {
              const displayUrl = url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w1200";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                  className="break-inside-avoid mb-6 relative group overflow-hidden cursor-pointer"
                  onClick={() => setLightboxIndex(i)}
                >
                  <img src={displayUrl} alt={`Photo ${i + 1}`}
                    className="w-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-700"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Google Photos Gallery */}
      {showGooglePhotos && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40">Expedition Gallery</p>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {gLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin" />
            </div>
          ) : googlePhotos.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {googlePhotos.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                  className="break-inside-avoid mb-6 relative group overflow-hidden cursor-pointer"
                  onClick={() => setLightboxIndex(i)}
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${i + 1}`}
                    className="w-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-700"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-white/30 text-sm">Could not load photos from this album.</p>
            </div>
          )}
        </section>
      )}

      {/* DB Photos Gallery (fallback when no Google Photos link) */}
      {showDbPhotos && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40">Expedition Gallery</p>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {dbPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                className="break-inside-avoid mb-6 relative group overflow-hidden cursor-pointer"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || "Expedition photo"}
                  className="w-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  </div>
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm font-sans font-light text-stone-200">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && lightboxPhotos.length > 0 && (
          <Lightbox
            photos={lightboxPhotos}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Travel Tips Section */}
      {trip.travelTips && (
        <section className="max-w-[800px] mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/3">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l4.553 2.276A1 1 0 0021 21.382V10.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" />
              </svg>
              <h2 className="text-xs font-mono uppercase tracking-widest text-white/50">Travel Tips</h2>
            </div>
            <div className="px-6 py-5">
              <ul className="flex flex-col gap-2.5">
                {trip.travelTips.split("\n").filter((l) => l.trim()).map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed">
                    <span className="text-primary mt-[3px] flex-shrink-0 text-xs">▸</span>
                    <span>{line.replace(/^[-•*▸]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
      )}

      {/* Comments & Reactions */}
      <CommentsSection tripId={tripId} />

    </div>
  );
}
