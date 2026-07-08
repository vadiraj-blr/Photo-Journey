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

  const post = async (name: string, body: string): Promise<{ ok: boolean; error?: string; errorType?: string }> => {
    const res = await fetch(`${base}/api/trips/${tripId}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, body }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to post comment.", errorType: data.type };
    setComments(prev => [data, ...prev]);
    return { ok: true };
  };

  return { comments, loading, post };
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "from-amber-600 to-amber-800",
  "from-stone-500 to-stone-700",
  "from-teal-600 to-teal-800",
  "from-rose-700 to-rose-900",
  "from-indigo-600 to-indigo-800",
  "from-emerald-600 to-emerald-800",
];

function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function CommentsSection({ tripId }: { tripId: number }) {
  const { counts, voted, react } = useReactions(tripId);
  const { comments, loading: commentsLoading, post } = useComments(tripId);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    setSuccess(false);
    if (!name.trim() || !body.trim()) { setError("Name and comment are required."); setErrorType("validation"); return; }
    setSubmitting(true);
    const result = await post(name.trim(), body.trim());
    setSubmitting(false);
    if (result.ok) { setBody(""); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    else { setError(result.error ?? "Something went wrong."); setErrorType(result.errorType ?? null); }
  };

  return (
    <section className="max-w-[800px] mx-auto px-6 py-16 md:py-24">

      {/* Reactions bar */}
      <div className="flex items-center gap-3 mb-14 p-4 rounded-2xl bg-white border border-stone-200">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mr-1">React</span>
        <button
          onClick={() => react("like")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${voted === "like"
            ? "border-amber-400 bg-amber-50 text-amber-700 shadow-sm"
            : "border-stone-200 bg-stone-50 text-stone-400 hover:border-stone-300 hover:text-stone-600"}`}
        >
          <svg className="w-4 h-4" fill={voted === "like" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="font-semibold">{counts.likes}</span>
        </button>
        <button
          onClick={() => react("dislike")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${voted === "dislike"
            ? "border-red-300 bg-red-50 text-red-600"
            : "border-stone-200 bg-stone-50 text-stone-400 hover:border-stone-300 hover:text-stone-600"}`}
        >
          <svg className="w-4 h-4 rotate-180" fill={voted === "dislike" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="font-semibold">{counts.dislikes}</span>
        </button>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-stone-400">Field Notes</p>
        <div className="flex-1 h-px bg-stone-200" />
        {comments.length > 0 && (
          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{comments.length}</span>
        )}
      </div>

      {/* Comment form */}
      <motion.form
        onSubmit={handleSubmit}
        className={`mb-12 rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${focused
          ? "border-amber-400 shadow-[0_0_0_3px_rgba(217,119,6,0.08)]"
          : "border-stone-200"}`}
      >
        {/* Name row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-stone-100">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-all ${name.trim() ? avatarColor(name) : "from-stone-200 to-stone-300"}`}>
            {name.trim() ? getInitials(name) : (
              <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Your name"
            maxLength={80}
            className="flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        {/* Message area */}
        <div className="px-4 py-3">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={e => setBody(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Share your thoughts about this expedition…"
            rows={4}
            maxLength={1000}
            className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-4 px-4 pb-4">
          <span className="text-[11px] text-stone-300 font-mono">{body.length}/1000</span>
          <button
            type="submit"
            disabled={submitting}
            className="relative flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all duration-200 overflow-hidden group"
          >
            <span className="relative z-10">{submitting ? "Posting…" : "Post"}</span>
            {!submitting && (
              <svg className="w-3 h-3 relative z-10 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>

        {(error || success) && (
          <div className={`mx-4 mb-4 px-3 py-2.5 rounded-xl text-xs flex items-start gap-2 ${
            success
              ? "bg-amber-50 border border-amber-200 text-amber-700"
              : errorType === "rate_limited"
              ? "bg-orange-50 border border-orange-200 text-orange-700"
              : errorType === "profanity"
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-red-50 border border-red-200 text-red-500"
          }`}>
            <span className="mt-0.5 flex-shrink-0">
              {success ? "✓" : errorType === "rate_limited" ? "⏱" : "✕"}
            </span>
            <span>{error || "Comment posted — thank you!"}</span>
          </div>
        )}
      </motion.form>

      {/* Comments list */}
      {commentsLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-t border-amber-500 rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border border-stone-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-stone-400 text-sm">Be the first to leave a field note.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group flex gap-3 p-4 rounded-2xl border border-stone-100 bg-white hover:bg-stone-50 hover:border-stone-200 transition-all duration-300"
            >
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(c.name)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5`}>
                {getInitials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-stone-800">{c.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">{c.body}</p>
              </div>
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
    if (!hasGooglePhotosUrl || !tripId) {
      setPhotos([]);
      setLoading(false);
      return;
    }
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "medium" | "fast">("medium");
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset load state whenever the displayed photo changes
  useEffect(() => {
    setImgLoaded(false);
  }, [current]);

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
      if (e.key === " ") { e.preventDefault(); setIsPlaying((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // Auto-advance slideshow — only starts counting down once the current image has fully loaded
  const SPEED_MS: Record<typeof speed, number> = { slow: 5000, medium: 3000, fast: 1500 };
  useEffect(() => {
    if (!isPlaying || !imgLoaded || photos.length <= 1) return;
    const timeout = setTimeout(next, SPEED_MS[speed]);
    return () => clearTimeout(timeout);
  }, [isPlaying, imgLoaded, speed, next, photos.length]);

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
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm group/lb"
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
        {/* Slideshow controls — top center of image */}
        {photos.length > 1 && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-full px-2 py-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              {isPlaying ? "Pause" : "Slideshow"}
            </button>
            <div className="w-px h-4 bg-white/15" />
            {(["slow", "medium", "fast"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  speed === s ? "bg-amber-500 text-black" : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
                aria-label={`${s} speed`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

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
            className="max-h-[calc(100dvh-80px)] max-w-[calc(100vw-80px)] sm:max-w-[calc(100vw-100px)] object-contain rounded-lg shadow-2xl"
            draggable={false}
            onLoad={() => setImgLoaded(true)}
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

      {/* Thumbnail strip — floats at bottom, fades in on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center px-4 pb-4 pt-12 gap-2 overflow-x-auto opacity-0 group-hover/lb:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent pointer-events-none group-hover/lb:pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none" }}
      >
        {photos.map((p, i) => {
          const thumb = p.url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w80-h80-c";
          return (
            <button
              key={i}
              onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === current ? "border-amber-500 opacity-100 scale-110 shadow-lg shadow-amber-500/30" : "border-transparent opacity-50 hover:opacity-90 hover:scale-105"
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

  const tripData = trip as { googlePhotosUrl?: string | null; galleryPhotoUrls?: { url: string; caption: string }[] } | undefined;
  const hasGooglePhotos = !!tripData?.googlePhotosUrl;
  const pinnedGallery: { url: string; caption: string }[] = (tripData?.galleryPhotoUrls ?? []).map(
    (item: unknown) => typeof item === "string" ? { url: item, caption: "" } : item as { url: string; caption: string }
  );
  const hasPinnedGallery = pinnedGallery.length > 0;
  // Only fetch all Google Photos when no curated selection has been made
  const { photos: googlePhotos, loading: gLoading } = useGooglePhotos(tripId, hasGooglePhotos && !hasPinnedGallery);

  // Only block on loading when there's no cached placeholder to show
  if (isTripLoading && !trip) {
    return (
      <div className="min-h-screen w-full bg-stone-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-t-2 border-amber-600 rounded-full animate-spin" />
        <p className="text-amber-600 text-xs uppercase tracking-widest animate-pulse">Loading Expedition...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center text-stone-900">
        <h1 className="text-4xl font-serif">Trip not found.</h1>
      </div>
    );
  }

  const googlePhotosUrl = (trip as { googlePhotosUrl?: string | null }).googlePhotosUrl;

  // Priority: pinned gallery > all Google Photos (fallback when nothing selected) > DB photos
  const googlePhotosReady = !gLoading && googlePhotos.length > 0;
  const googlePhotosLoading = hasGooglePhotos && !hasPinnedGallery && gLoading;
  // Gate on !hasPinnedGallery so cached React Query data doesn't trigger a second gallery
  const showAllGooglePhotos = !hasPinnedGallery && (googlePhotosLoading || googlePhotosReady);
  // Show pinned when there are selections; show all-Google fallback only when no selection
  const showPinnedGallery = hasPinnedGallery;
  const showDbPhotos = !showPinnedGallery && !showAllGooglePhotos && dbPhotos && dbPhotos.length > 0;

  // Build flat list for lightbox
  const lightboxPhotos: { url: string }[] = hasPinnedGallery
    ? pinnedGallery.map((item) => ({ url: item.url }))
    : googlePhotosReady
    ? googlePhotos
    : showDbPhotos
    ? dbPhotos.map((p) => ({ url: p.imageUrl }))
    : [];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

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
            <h1 className="text-5xl md:text-8xl font-serif tracking-tight leading-none mb-6 text-white">
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
        <section className="max-w-[720px] mx-auto px-6 py-24 md:py-32">
          {/* Summary pull-quote */}
          {(trip as typeof trip & { storySummary?: string | null }).storySummary && (
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
              className="relative mb-16 pl-7 border-l-[3px] border-amber-500"
            >
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-stone-700">
                {(trip as typeof trip & { storySummary?: string | null }).storySummary}
              </p>
            </motion.blockquote>
          )}

          {/* Paragraphs */}
          <div className="space-y-8">
            {trip.story
              .split(/\n\s*\n/)
              .map((para) => para.trim())
              .filter(Boolean)
              .map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: i === 0 ? 0 : 0.05 }}
                  className={`text-lg md:text-xl font-serif leading-loose text-stone-900 ${
                    i === 0
                      ? "first-letter:text-6xl first-letter:font-serif first-letter:text-amber-600 first-letter:float-left first-letter:mr-4 first-letter:leading-none first-letter:-mt-1"
                      : ""
                  }`}
                >
                  {para}
                </motion.p>
              ))}
          </div>
        </section>
      )}

      {/* Pinned Gallery (curated from admin) */}
      {showPinnedGallery && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400">Expedition Gallery</p>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {pinnedGallery.map((item, i) => {
              const displayUrl = item.url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w1200";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                  className="break-inside-avoid mb-6 cursor-pointer"
                  onClick={() => setLightboxIndex(i)}
                >
                  <div className="relative group overflow-hidden">
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
                  </div>
                  {item.caption && (
                    <p className="mt-2 px-1 text-sm font-serif italic text-stone-500 leading-snug">{item.caption}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* All Google Photos — fallback when no curated selection has been made */}
      {showAllGooglePhotos && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400">Expedition Gallery</p>
            <div className="flex-1 h-px bg-stone-200" />
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
              <p className="text-stone-400 text-sm">Could not load photos from this album.</p>
            </div>
          )}
        </section>
      )}

      {/* DB Photos Gallery (fallback when no Google Photos link) */}
      {showDbPhotos && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400">Expedition Gallery</p>
            <div className="flex-1 h-px bg-stone-200" />
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
            className="border border-stone-200 rounded-2xl overflow-hidden bg-white"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100 bg-stone-50">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l4.553 2.276A1 1 0 0021 21.382V10.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" />
              </svg>
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">Travel Tips</h2>
            </div>
            <div className="px-6 py-5">
              <ul className="flex flex-col gap-2.5">
                {trip.travelTips.split("\n").filter((l) => l.trim()).map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-900 leading-relaxed">
                    <span className="text-amber-600 mt-[3px] flex-shrink-0 text-xs">▸</span>
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
