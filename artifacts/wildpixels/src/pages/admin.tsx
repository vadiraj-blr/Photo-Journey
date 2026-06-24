import { useState, useEffect } from "react";
import { useListTrips } from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface LandingSettings {
  heroImageUrl: string;
  heroImageSourceTripId: number | null;
  tripsOnHomepage: number;
  heroTagline: string;
  heroAlbumUrl?: string | null;
  highlightAlbumUrl?: string | null;
  highlightPhotoUrls?: string[];
  aboutTitle?: string;
  aboutPortraitUrl?: string;
  aboutBio?: string;
  aboutAlbumUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactLocation?: string;
}

function useLandingSettings() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return useQuery<LandingSettings>({
    queryKey: ["landing-settings"],
    queryFn: () => fetch(`${base}/api/settings`).then((r) => r.json()),
  });
}

function LandingSettingsPanel({ trips }: { trips: TripRow[] }) {
  const { data: settings, isLoading } = useLandingSettings();
  const queryClient = useQueryClient();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [form, setForm] = useState({
    heroAlbumUrl: "",
    heroTagline: "Enter the Wild.",
    tripsOnHomepage: "0",
    highlightAlbumUrl: "",
    highlightPhotoUrls: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Highlight picker state
  const [hlPhotos, setHlPhotos] = useState<string[]>([]);
  const [hlLoading, setHlLoading] = useState(false);
  const [hlError, setHlError] = useState<string | null>(null);
  const [hlOpen, setHlOpen] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        heroAlbumUrl: settings.heroAlbumUrl ?? "",
        heroTagline: settings.heroTagline ?? "Enter the Wild.",
        tripsOnHomepage: String(settings.tripsOnHomepage ?? 0),
        highlightAlbumUrl: settings.highlightAlbumUrl ?? "",
        highlightPhotoUrls: settings.highlightPhotoUrls ?? [],
      });
    }
  }, [settings]);

  const loadHighlightPhotos = async () => {
    if (!form.highlightAlbumUrl.trim()) return;
    setHlLoading(true);
    setHlError(null);
    try {
      // Save album URL first, then fetch photos
      await fetch(`${base}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ highlightAlbumUrl: form.highlightAlbumUrl.trim() }),
      });
      const r = await fetch(`${base}/api/settings/highlight-photos`).then((x) => x.json());
      if (r.photos && Array.isArray(r.photos)) {
        setHlPhotos(r.photos);
        setHlOpen(true);
      } else {
        setHlError("No photos found. Make sure it's a public shared album.");
      }
    } catch {
      setHlError("Could not load photos.");
    } finally {
      setHlLoading(false);
    }
  };

  const toggleHighlight = (url: string) => {
    setForm((f) => ({
      ...f,
      highlightPhotoUrls: f.highlightPhotoUrls.includes(url)
        ? f.highlightPhotoUrls.filter((u) => u !== url)
        : [...f.highlightPhotoUrls, url],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${base}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroAlbumUrl: form.heroAlbumUrl.trim() || null,
          heroTagline: form.heroTagline,
          tripsOnHomepage: Number(form.tripsOnHomepage),
          highlightAlbumUrl: form.highlightAlbumUrl.trim() || null,
          highlightPhotoUrls: form.highlightPhotoUrls,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      queryClient.invalidateQueries({ queryKey: ["landing-settings"] });
      queryClient.invalidateQueries({ queryKey: ["hero-photos"] });
      queryClient.invalidateQueries({ queryKey: ["highlight-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="mb-12 rounded-2xl border border-amber-500/20 bg-amber-500/4 p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-1">Landing Page</p>
        <h2 className="text-xl font-serif font-bold text-white">Customise Homepage</h2>
        <p className="text-white/40 text-sm mt-1">Set the hero slideshow album and how many trips to show.</p>
      </div>

      {/* Hero tagline */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Hero Tagline</span>
        <input
          className={inputCls}
          value={form.heroTagline}
          onChange={(e) => setForm((f) => ({ ...f, heroTagline: e.target.value }))}
          placeholder="Enter the Wild."
        />
      </div>

      {/* Hero slideshow album URL */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Hero Slideshow Album</span>
        <p className="text-[11px] text-white/30">
          Paste your Google Photos album URL. All photos in that album will cycle every 3 s on the homepage hero.
        </p>
        <input
          className={inputCls}
          placeholder="https://photos.google.com/share/…"
          value={form.heroAlbumUrl}
          onChange={(e) => setForm((f) => ({ ...f, heroAlbumUrl: e.target.value }))}
        />
        {form.heroAlbumUrl && (
          <p className="text-[11px] text-amber-500/70">Album set — save to apply.</p>
        )}
      </div>

      {/* Curated Highlights picker */}
      <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/8 bg-white/2">
        <div className="flex flex-col gap-1 mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50">Curated Highlights (About Page)</span>
          <p className="text-[11px] text-white/30">Paste a Google Photos shared album, load it, then click photos to select the ones shown in the "Curated Highlights" section.</p>
        </div>
        <input
          className={inputCls}
          placeholder="https://photos.google.com/share/…"
          value={form.highlightAlbumUrl}
          onChange={(e) => setForm((f) => ({ ...f, highlightAlbumUrl: e.target.value }))}
        />
        <button
          type="button"
          onClick={loadHighlightPhotos}
          disabled={hlLoading || !form.highlightAlbumUrl.trim()}
          className="self-start text-xs font-mono uppercase tracking-wider text-amber-500 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {hlLoading ? "Loading…" : "Load photos"}
        </button>
        {hlError && <p className="text-red-400 text-xs">{hlError}</p>}

        {hlOpen && hlPhotos.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-[11px] text-white/35">
              <span>{form.highlightPhotoUrls.length} photo{form.highlightPhotoUrls.length !== 1 ? "s" : ""} selected</span>
              {form.highlightPhotoUrls.length > 0 && (
                <button type="button" onClick={() => setForm((f) => ({ ...f, highlightPhotoUrls: [] }))}
                  className="text-red-400/60 hover:text-red-400 transition-colors">Clear all</button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 p-2 bg-white/3">
              {hlPhotos.map((url, i) => {
                const thumb = url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w300";
                const selected = form.highlightPhotoUrls.includes(url);
                return (
                  <div key={i}
                    className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer ring-2 transition-all duration-150 ${selected ? "ring-amber-500" : "ring-transparent hover:ring-white/30"}`}
                    onClick={() => toggleHighlight(url)}
                  >
                    <img src={thumb} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    {selected && (
                      <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black text-xs font-bold">
                          {form.highlightPhotoUrls.indexOf(url) + 1}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-white/25">Click to select / deselect. Numbers show display order. Save Settings below to apply.</p>
          </div>
        )}
      </div>

      {/* Trips count */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Number of Trips Shown</span>
        <div className="flex items-center gap-3 flex-wrap">
          {[["0", "All trips"], ["3", "3"], ["6", "6"], ["9", "9"], ["12", "12"]].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm((f) => ({ ...f, tripsOnHomepage: val }))}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                form.tripsOnHomepage === val
                  ? "border-amber-500 bg-amber-500/15 text-amber-400 font-semibold"
                  : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="text-white/25 text-xs">or type a number:</span>
          <input
            type="number"
            min={0}
            max={100}
            className={`${inputCls} w-20`}
            value={form.tripsOnHomepage}
            onChange={(e) => setForm((f) => ({ ...f, tripsOnHomepage: e.target.value }))}
          />
        </div>
        <p className="text-[11px] text-white/25">
          {form.tripsOnHomepage === "0" ? "All trips will be shown." : `Only the first ${form.tripsOnHomepage} trips (ordered by year) will appear on the homepage.`}
        </p>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="self-start px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Homepage Settings"}
      </button>
    </div>
  );
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface TripRow {
  id: number;
  title: string;
  location: string;
  country: string;
  month: string;
  year: number;
  story?: string | null;
  storySummary?: string | null;
  coverImageUrl: string;
  tags: string[];
  featured: boolean;
  googlePhotosUrl?: string | null;
  galleryPhotoUrls?: { url: string; caption: string }[];
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-mono uppercase tracking-widest text-white/40">{label}</span>
      {hint && <span className="text-[11px] text-white/25 -mt-0.5">{hint}</span>}
      {children}
    </label>
  );
}

const inputCls =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/60 transition-colors text-sm";

function TripPhotoPicker({
  albumUrl,
  currentCover,
  galleryItems,
  onSetCover,
  onSetGallery,
  tripId,
}: {
  albumUrl: string;
  currentCover: string;
  galleryItems: { url: string; caption: string }[];
  onSetCover: (url: string) => void;
  onSetGallery: (items: { url: string; caption: string }[]) => void;
  tripId?: number;
}) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const load = async (forceRefresh = false) => {
    if (!albumUrl.trim()) return;
    if (!forceRefresh && photos.length > 0) { setOpen(true); return; }
    setLoading(true);
    setError(null);
    try {
      let data: { photos?: string[] };
      if (tripId && forceRefresh) {
        // For existing trips, the refresh route clears the cache in DB
        data = await fetch(`${base}/api/trips/${tripId}/google-photos?refresh=true`).then((r) => r.json());
      } else {
        // Generic scraper — works for both Add and Edit modals
        data = await fetch(`${base}/api/settings/album-photos?url=${encodeURIComponent(albumUrl.trim())}`).then((r) => r.json());
      }
      if (data.photos?.length) {
        setPhotos(data.photos);
        setOpen(true);
        setError(null);
      } else {
        setPhotos([]);
        setError("No photos found. Make sure the album is public and shared.");
      }
    } catch {
      setError("Could not reach the album.");
    } finally {
      setLoading(false);
    }
  };

  const toggleGallery = (url: string) => {
    const exists = galleryItems.some((item) => item.url === url);
    onSetGallery(exists
      ? galleryItems.filter((item) => item.url !== url)
      : [...galleryItems, { url, caption: "" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => load(false)}
          disabled={loading || !albumUrl.trim()}
          className="self-start text-xs font-mono uppercase tracking-wider text-amber-500 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Loading…" : open ? "↓ Show grid" : "Load Photos"}
        </button>
        {tripId && (
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading || !albumUrl.trim()}
            title="Force a fresh fetch from Google Photos, clearing any cached results"
            className="self-start text-xs font-mono uppercase tracking-wider text-white/35 border border-white/10 hover:border-white/25 hover:text-white/60 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {open && photos.length > 0 && (
        <div className="flex flex-col gap-2">
          {/* Counter + actions row */}
          <div className="flex items-center justify-between text-[11px] text-white/40">
            <span>
              {galleryItems.length === 0
                ? "Click photos to add to gallery"
                : <span className="text-amber-400">{galleryItems.length} photo{galleryItems.length !== 1 ? "s" : ""} selected</span>
              }
            </span>
            <div className="flex items-center gap-3">
              {galleryItems.length > 0 && (
                <button type="button" onClick={() => onSetGallery([])}
                  className="text-red-400/60 hover:text-red-400 transition-colors">
                  Clear all
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/60 transition-colors">
                Hide
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto rounded-xl border border-white/10 p-2 bg-white/3">
            {photos.map((url, i) => {
              const base2 = url.replace(/=w\d+(-h\d+)?(-no)?$/, "");
              const thumb = `${base2}=w300`;
              const isCover = currentCover === url;
              const inGallery = galleryItems.some((item) => item.url === url);

              return (
                <div
                  key={i}
                  onClick={() => toggleGallery(url)}
                  className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer ring-2 transition-all duration-150 group ${
                    inGallery ? "ring-amber-500" : "ring-transparent hover:ring-white/30"
                  }`}
                >
                  <img src={thumb} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />

                  {/* Selected overlay + checkmark */}
                  {inGallery && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-start justify-end p-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-black text-[10px] font-bold flex-shrink-0">
                        ✓
                      </div>
                    </div>
                  )}

                  {/* Cover badge */}
                  {isCover && (
                    <div className="absolute bottom-1 left-1 bg-amber-500 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-black leading-none">
                      Cover
                    </div>
                  )}

                  {/* "Set as cover" on hover (secondary action) */}
                  {!isCover && (
                    <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSetCover(url); }}
                        className="bg-black/60 hover:bg-amber-500 hover:text-black text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md transition-colors"
                      >
                        Set cover
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-white/25">
            {galleryItems.length === 0
              ? "No photos pinned — all album photos will show on the trip page."
              : "Selected photos will be shown in the trip gallery. Save the trip to apply."}
          </p>

          {/* Caption inputs for selected photos */}
          {galleryItems.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/8 mt-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Captions (optional)</p>
              {galleryItems.map((item, i) => {
                const thumb = item.url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w80-h80-c";
                return (
                  <div key={i} className="flex items-center gap-2">
                    <img src={thumb} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-white/10" loading="lazy" />
                    <input
                      type="text"
                      placeholder={`Caption for photo ${i + 1}…`}
                      value={item.caption}
                      maxLength={200}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const updated = galleryItems.map((g, idx) =>
                          idx === i ? { ...g, caption: e.target.value } : g
                        );
                        onSetGallery(updated);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-colors text-xs"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TripFormFields({
  form,
  set,
  setGallery,
  tripId,
}: {
  form: {
    title: string; location: string; country: string; month: string;
    year: string; story: string; storySummary: string; travelTips: string; coverImageUrl: string; tags: string;
    featured: boolean; googlePhotosUrl: string; galleryPhotoUrls: { url: string; caption: string }[];
  };
  set: (field: string, value: string | boolean) => void;
  setGallery: (items: { url: string; caption: string }[]) => void;
  tripId?: number;
}) {
  return (
    <>
      <Field label="Title">
        <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Ranthambore Tiger Reserve" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Location">
          <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Ranthambore" />
        </Field>
        <Field label="Country">
          <input className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g. India" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Month">
          <select className={inputCls} value={form.month} onChange={(e) => set("month", e.target.value)}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Year">
          <input
            className={inputCls}
            type="number"
            min={2000}
            max={2099}
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Google Photos Album Link"
        hint="Paste the shared album URL then use the picker below to assign photos"
      >
        <input
          className={`${inputCls} ${form.googlePhotosUrl ? "border-amber-500/40" : ""}`}
          placeholder="https://photos.app.goo.gl/..."
          value={form.googlePhotosUrl}
          onChange={(e) => set("googlePhotosUrl", e.target.value)}
        />
        {form.googlePhotosUrl && (
          <a href={form.googlePhotosUrl} target="_blank" rel="noopener noreferrer"
            className="text-[11px] text-amber-500/70 hover:text-amber-400 mt-1">
            Open album ↗
          </a>
        )}
      </Field>

      {/* Photos panel — always visible */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/8 bg-white/2">

        {/* Cover URL row */}
        <div className="flex items-start gap-3">
          {form.coverImageUrl && (
            <img
              src={form.coverImageUrl.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w120"}
              alt="Cover"
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-amber-500/40"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40">Cover Image URL</span>
            <input
              className={inputCls}
              value={form.coverImageUrl}
              placeholder="Paste an image URL, or pick one from the gallery below"
              onChange={(e) => set("coverImageUrl", e.target.value)}
            />
          </div>
        </div>

        {/* Gallery section header */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Photo Gallery</span>
          <div className="flex-1 h-px bg-white/8" />
          {form.galleryPhotoUrls.length > 0 && (
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {form.galleryPhotoUrls.length} selected
            </span>
          )}
        </div>

        {form.googlePhotosUrl ? (
          <>
            <p className="text-[11px] text-white/30 -mt-1">
              Click <strong className="text-white/50">Load Photos</strong> to fetch photos from your album, then tap any photo to add it to the gallery.
            </p>
            <TripPhotoPicker
              albumUrl={form.googlePhotosUrl}
              currentCover={form.coverImageUrl}
              galleryItems={form.galleryPhotoUrls}
              onSetCover={(url) => set("coverImageUrl", url)}
              onSetGallery={setGallery}
              tripId={tripId}
            />
          </>
        ) : (
          <p className="text-[11px] text-amber-500/50">
            Paste a Google Photos album URL in the <strong className="text-amber-400/80">Google Photos Album Link</strong> field above, then the photo picker will appear here.
          </p>
        )}
      </div>

      <Field label="Tags (comma-separated)">
        <input
          className={inputCls}
          placeholder="wildlife, landscape, birds"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50">Story</span>
          <span className="text-[10px] text-white/30">Each blank line = new paragraph on the trip page</span>
        </div>
        <textarea
          className={`${inputCls} resize-y min-h-[220px] font-mono text-sm leading-relaxed`}
          placeholder={"Write the trip story here.\n\nUse a blank line between paragraphs.\n\nEach paragraph becomes its own block on the trip page."}
          value={form.story}
          onChange={(e) => set("story", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50">Summary <span className="text-white/30 normal-case tracking-normal">(shown at the top of the story)</span></span>
          <button
            type="button"
            onClick={() => {
              if (!form.story.trim()) return;
              const firstPara = form.story.trim().split(/\n\s*\n/)[0].trim();
              const sentences = firstPara.match(/[^.!?]*[.!?]+/g) ?? [];
              const summary = sentences.slice(0, 3).join(" ").trim() || firstPara.slice(0, 280);
              set("storySummary", summary);
            }}
            className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 hover:text-amber-300 transition-colors px-2 py-1 rounded border border-amber-500/20 hover:border-amber-400/40"
          >
            ↑ Extract from story
          </button>
        </div>
        <textarea
          className={`${inputCls} resize-y min-h-[80px]`}
          placeholder="A short 1–3 sentence pull-quote shown before the full story…"
          value={form.storySummary}
          onChange={(e) => set("storySummary", e.target.value)}
        />
      </div>

      <Field
        label="Travel Tips"
        hint="Best season, how to reach, accommodation, photography advice, etc."
      >
        <textarea
          className={`${inputCls} resize-y min-h-[120px]`}
          placeholder={"Best time: Oct–Mar\nHow to get there: Fly to Jaipur, then 3h drive\nStay: Forest rest houses near the gate\nTips: Early morning safari gives best sightings"}
          value={form.travelTips}
          onChange={(e) => set("travelTips", e.target.value)}
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => set("featured", !form.featured)}
          className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.featured ? "bg-amber-500" : "bg-white/15"}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
        </div>
        <span className="text-sm text-white/70">Featured on homepage</span>
      </label>
    </>
  );
}

function AddTripModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    title: "", location: "", country: "", month: "January",
    year: String(new Date().getFullYear()), story: "", storySummary: "", travelTips: "",
    coverImageUrl: "", tags: "", featured: false, googlePhotosUrl: "",
    galleryPhotoUrls: [] as { url: string; caption: string }[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));
  const setGallery = (items: { url: string; caption: string }[]) => setForm((f) => ({ ...f, galleryPhotoUrls: items }));

  const handleCreate = async () => {
    if (!form.title.trim() || !form.location.trim() || !form.country.trim()) {
      setError("Title, location and country are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          location: form.location.trim(),
          country: form.country.trim(),
          month: form.month,
          year: Number(form.year),
          story: form.story.trim() || null,
          storySummary: form.storySummary.trim() || null,
          travelTips: form.travelTips.trim() || null,
          coverImageUrl: form.coverImageUrl.trim() || null,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          featured: form.featured,
          googlePhotosUrl: form.googlePhotosUrl.trim() || null,
          galleryPhotoUrls: form.galleryPhotoUrls,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      onCreated();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#141414] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add New Trip</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-2xl leading-none" aria-label="Close">×</button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <TripFormFields form={form} set={set} setGallery={setGallery} />
          {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors text-sm disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create Trip"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  trip,
  onClose,
  onSaved,
  onDeleted,
}: {
  trip: TripRow;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [form, setForm] = useState({
    title: trip.title,
    location: trip.location,
    country: trip.country,
    month: trip.month,
    year: String(trip.year),
    story: trip.story ?? "",
    storySummary: trip.storySummary ?? "",
    travelTips: (trip as typeof trip & { travelTips?: string | null }).travelTips ?? "",
    coverImageUrl: trip.coverImageUrl,
    tags: trip.tags.join(", "),
    featured: trip.featured,
    googlePhotosUrl: trip.googlePhotosUrl ?? "",
    galleryPhotoUrls: trip.galleryPhotoUrls ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));
  const setGallery = (items: { url: string; caption: string }[]) => setForm((f) => ({ ...f, galleryPhotoUrls: items }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          country: form.country,
          month: form.month,
          year: Number(form.year),
          story: form.story,
          storySummary: form.storySummary.trim() || null,
          travelTips: form.travelTips.trim() || null,
          coverImageUrl: form.coverImageUrl,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          featured: form.featured,
          googlePhotosUrl: form.googlePhotosUrl.trim() || null,
          galleryPhotoUrls: form.galleryPhotoUrls,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/trips/${trip.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      onDeleted();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#141414] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Trip</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-2xl leading-none" aria-label="Close">×</button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <TripFormFields form={form} set={set} setGallery={setGallery} tripId={trip.id} />

          {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

          {/* Delete zone */}
          <div className="border-t border-white/8 pt-4 mt-1">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-mono uppercase tracking-wider text-red-400/60 hover:text-red-400 transition-colors"
              >
                Delete this trip…
              </button>
            ) : (
              <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-sm text-red-300 font-medium">
                  Permanently delete <strong>"{trip.title}"</strong>?
                </p>
                <p className="text-xs text-red-400/60">This will also remove all associated photos and cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 px-3 py-2 rounded-lg border border-white/15 text-white/50 hover:text-white text-xs transition-colors"
                  >
                    Keep it
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutSettingsPanel() {
  const { data: settings, isLoading } = useLandingSettings();
  const queryClient = useQueryClient();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [form, setForm] = useState({
    aboutTitle: "The Lens.",
    aboutPortraitUrl: "/images/about-portrait.png",
    aboutBio: "",
    aboutPhotoHeight: 480,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Portrait album picker state
  const [albumUrl, setAlbumUrl] = useState("");
  const [albumPhotos, setAlbumPhotos] = useState<string[]>([]);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [albumError, setAlbumError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        aboutTitle: settings.aboutTitle ?? "The Lens.",
        aboutPortraitUrl: settings.aboutPortraitUrl ?? "/images/about-portrait.png",
        aboutBio: settings.aboutBio ?? "",
        aboutPhotoHeight: settings.aboutPhotoHeight ?? 480,
      });
      if (settings.aboutAlbumUrl) {
        setAlbumUrl(settings.aboutAlbumUrl);
      }
    }
  }, [settings]);

  const loadAlbumPhotos = async () => {
    if (!albumUrl.trim()) return;
    setAlbumLoading(true);
    setAlbumError(null);
    try {
      // Persist the album URL immediately so it's remembered
      await fetch(`${base}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutAlbumUrl: albumUrl.trim() }),
      });
      queryClient.invalidateQueries({ queryKey: ["landing-settings"] });
      const r = await fetch(`${base}/api/settings/album-photos?url=${encodeURIComponent(albumUrl.trim())}`).then((x) => x.json());
      if (r.photos && Array.isArray(r.photos) && r.photos.length > 0) {
        setAlbumPhotos(r.photos);
        setPickerOpen(true);
      } else {
        setAlbumError("No photos found. Make sure it's a public shared album.");
      }
    } catch {
      setAlbumError("Could not load photos.");
    } finally {
      setAlbumLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${base}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, aboutAlbumUrl: albumUrl.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      queryClient.invalidateQueries({ queryKey: ["landing-settings"] });
      queryClient.invalidateQueries({ queryKey: ["about-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="mb-12 rounded-2xl border border-sky-500/20 bg-sky-500/4 p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-1">About Page</p>
        <h2 className="text-xl font-serif font-bold text-white">Edit About Page</h2>
        <p className="text-white/40 text-sm mt-1">Update your bio, portrait photo, and page heading.</p>
      </div>

      {/* Portrait section */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/8 bg-white/3">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Portrait Photo</span>

        {/* Current portrait preview */}
        {form.aboutPortraitUrl && (
          <div className="flex items-center gap-3">
            <img
              src={form.aboutPortraitUrl.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w400"}
              alt="Portrait preview"
              className="w-16 h-20 rounded-lg object-cover flex-shrink-0 border border-white/10"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/30 font-mono truncate">{form.aboutPortraitUrl}</p>
              <p className="text-[11px] text-white/20 mt-0.5">Currently selected portrait</p>
            </div>
          </div>
        )}

        {/* Album picker */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-white/30">Paste a Google Photos shared album URL to choose your portrait:</span>
          <div className="flex gap-2">
            <input
              className={`${inputCls} flex-1`}
              value={albumUrl}
              onChange={(e) => { setAlbumUrl(e.target.value); setPickerOpen(false); setAlbumPhotos([]); setAlbumError(null); }}
              placeholder="https://photos.app.goo.gl/..."
            />
            <button
              type="button"
              onClick={loadAlbumPhotos}
              disabled={albumLoading || !albumUrl.trim()}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
            >
              {albumLoading ? "Loading…" : "Load Photos"}
            </button>
          </div>
          {albumError && <p className="text-xs text-red-400">{albumError}</p>}
        </div>

        {/* Or paste direct URL */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-white/30">Or paste a direct image URL:</span>
          <input
            className={inputCls}
            value={form.aboutPortraitUrl}
            onChange={(e) => setForm((f) => ({ ...f, aboutPortraitUrl: e.target.value }))}
            placeholder="/images/about-portrait.png or https://lh3.googleusercontent.com/..."
          />
        </div>

        {/* Photo height */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-white/30">Photo height</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "XS", value: 320 },
              { label: "S", value: 400 },
              { label: "M", value: 480 },
              { label: "L", value: 580 },
              { label: "XL", value: 680 },
            ].map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, aboutPhotoHeight: value }))}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                  form.aboutPhotoHeight === value
                    ? "bg-sky-500/30 border-sky-400 text-sky-200"
                    : "bg-white/5 border-white/10 text-white/40 hover:border-sky-400/50 hover:text-white/60"
                }`}
              >
                {label}
                <span className="ml-1.5 font-mono font-normal normal-case text-[10px] opacity-60">{value}px</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="range"
              min={240}
              max={800}
              step={20}
              value={form.aboutPhotoHeight}
              onChange={(e) => setForm((f) => ({ ...f, aboutPhotoHeight: Number(e.target.value) }))}
              className="flex-1 accent-sky-400"
            />
            <span className="text-xs font-mono text-white/50 w-14 text-right">{form.aboutPhotoHeight}px</span>
          </div>
        </div>

        {/* Photo grid */}
        {pickerOpen && albumPhotos.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">{albumPhotos.length} photos — click one to use as portrait</span>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {albumPhotos.map((url, i) => {
                const thumb = url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w400-h400-c";
                const selected = form.aboutPortraitUrl === url;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, aboutPortraitUrl: url }));
                      setPickerOpen(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selected
                        ? "border-sky-400 ring-2 ring-sky-400/40"
                        : "border-transparent hover:border-sky-400/50"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selected && (
                      <div className="absolute inset-0 bg-sky-400/20 flex items-center justify-center">
                        <span className="text-sky-300 text-lg">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Page Heading</span>
        <input
          className={inputCls}
          value={form.aboutTitle}
          onChange={(e) => setForm((f) => ({ ...f, aboutTitle: e.target.value }))}
          placeholder="The Lens."
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Bio</span>
        <span className="text-[11px] text-white/25">Each paragraph on a new line. Blank lines create paragraph breaks.</span>
        <textarea
          className={`${inputCls} resize-y min-h-[160px]`}
          value={form.aboutBio}
          onChange={(e) => setForm((f) => ({ ...f, aboutBio: e.target.value }))}
          placeholder="Write your bio here. Use a blank line to start a new paragraph."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-sm font-bold transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save About Page"}
        </button>
        {saved && <span className="text-xs text-sky-400 font-mono">Saved ✓</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </div>
  );
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function toSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

const EMPTY_ARTICLE = { title: "", slug: "", excerpt: "", body: "", cover_image_url: "", published: false };

function ArticlesPanel() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [markdownComp, setMarkdownComp] = useState<React.ComponentType<{ children: string; remarkPlugins: unknown[] }> | null>(null);
  const [remarkGfmPlugin, setRemarkGfmPlugin] = useState<unknown>(null);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["admin-articles"],
    queryFn: () => fetch(`${base}/api/articles`).then((r) => r.json()),
  });

  useEffect(() => {
    if (preview && !markdownComp) {
      Promise.all([
        import("react-markdown").then((m) => m.default),
        import("remark-gfm").then((m) => m.default),
      ]).then(([Md, gfm]) => {
        setMarkdownComp(() => Md as React.ComponentType<{ children: string; remarkPlugins: unknown[] }>);
        setRemarkGfmPlugin(() => gfm);
      });
    }
  }, [preview, markdownComp]);

  const openCreate = () => {
    setForm(EMPTY_ARTICLE);
    setEditing(null);
    setCreating(true);
    setPreview(false);
    setError(null);
  };

  const openEdit = (a: Article) => {
    setForm({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt ?? "",
      body: a.body ?? "",
      cover_image_url: a.cover_image_url ?? "",
      published: a.published,
    });
    setEditing(a);
    setCreating(false);
    setPreview(false);
    setError(null);
  };

  const handleClose = () => {
    setCreating(false);
    setEditing(null);
    setError(null);
  };

  const handleTitleChange = (val: string) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: editing ? f.slug : toSlug(val),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || toSlug(form.title.trim()),
        excerpt: form.excerpt.trim(),
        body: form.body,
        coverImageUrl: form.cover_image_url.trim(),
        published: form.published,
      };
      const res = editing
        ? await fetch(`${base}/api/articles/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch(`${base}/api/articles`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["field-notes"] });
      handleClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this field note? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`${base}/api/articles/${id}`, { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["field-notes"] });
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (a: Article) => {
    await fetch(`${base}/api/articles/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !a.published }),
    });
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    queryClient.invalidateQueries({ queryKey: ["field-notes"] });
  };

  const isEditorOpen = creating || !!editing;

  return (
    <div className="mb-12">
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/4 p-6 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-1">Field Notes</p>
            <h2 className="text-xl font-serif font-bold text-white">Articles</h2>
            <p className="text-white/40 text-sm mt-1">Write and publish articles that appear on your About page.</p>
          </div>
          {!isEditorOpen && (
            <button
              onClick={openCreate}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/25 text-violet-300 text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Field Note
            </button>
          )}
        </div>

        {/* Article list */}
        {!isEditorOpen && (
          <div className="flex flex-col gap-3">
            {isLoading && <p className="text-white/30 text-sm font-mono">Loading…</p>}
            {!isLoading && articles.length === 0 && (
              <p className="text-white/20 text-sm font-mono py-4 text-center">No articles yet. Write your first field note!</p>
            )}
            {articles.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{a.title}</p>
                  {a.excerpt && <p className="text-white/30 text-xs mt-0.5 truncate">{a.excerpt}</p>}
                </div>
                <button
                  onClick={() => handleTogglePublish(a)}
                  className={`flex-shrink-0 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-colors ${
                    a.published
                      ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25"
                      : "bg-white/5 border-white/10 text-white/30 hover:text-white/50"
                  }`}
                >
                  {a.published ? "Live" : "Draft"}
                </button>
                <button
                  onClick={() => openEdit(a)}
                  className="flex-shrink-0 text-xs text-white/40 hover:text-violet-300 transition-colors px-2 py-1 rounded-lg hover:bg-violet-500/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deleting === a.id}
                  className="flex-shrink-0 text-xs text-white/20 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10 disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        {isEditorOpen && (
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">Title</span>
              <input
                className={inputCls + " text-base font-serif"}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Into the Sundarban Fog"
                autoFocus
              />
            </div>

            {/* Slug + Excerpt row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40">URL Slug</span>
                <input
                  className={inputCls + " font-mono text-xs"}
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                  placeholder="into-the-sundarban-fog"
                />
                <span className="text-[10px] text-white/20">/field-notes/{form.slug || "..."}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40">Cover Image URL</span>
                <input
                  className={inputCls}
                  value={form.cover_image_url}
                  onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">Excerpt <span className="text-white/20 normal-case">(short description for listing)</span></span>
              <input
                className={inputCls}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="A short description that appears in the articles listing…"
              />
            </div>

            {/* Body with preview toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40">Body <span className="text-white/20 normal-case">(Markdown)</span></span>
                <button
                  type="button"
                  onClick={() => setPreview((p) => !p)}
                  className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-violet-300 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-violet-500/10 border border-white/8"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={preview ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
              {!preview ? (
                <textarea
                  className={inputCls + " font-mono text-sm leading-relaxed resize-none"}
                  rows={16}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder={"# Into the Fog\n\nWrite your article here using **Markdown**.\n\n> A quote from the wild\n\nParagraphs, *emphasis*, **bold**, [links](https://...), images, and more are all supported."}
                />
              ) : (
                <div className="min-h-[300px] rounded-xl border border-white/8 bg-white/2 p-6 overflow-y-auto">
                  {markdownComp && remarkGfmPlugin ? (
                    <div className="prose-wildpixels">
                      {(() => {
                        const MD = markdownComp;
                        return <MD remarkPlugins={[remarkGfmPlugin as never]}>{form.body || "*Nothing to preview yet…*"}</MD>;
                      })()}
                    </div>
                  ) : (
                    <p className="text-white/20 text-sm font-mono">Loading preview…</p>
                  )}
                </div>
              )}
            </div>

            {/* Published toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                className={`relative w-10 h-5.5 rounded-full border transition-all duration-200 flex-shrink-0 ${form.published ? "bg-emerald-500/40 border-emerald-500/50" : "bg-white/8 border-white/15"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all duration-200 ${form.published ? "translate-x-4.5 bg-emerald-400" : "bg-white/30"}`} />
              </button>
              <span className="text-sm text-white/50">{form.published ? <span className="text-emerald-400">Published — visible on About page</span> : "Draft — not visible to visitors"}</span>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : editing ? "Update Field Note" : "Publish Field Note"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl bg-white/6 hover:bg-white/10 text-white/50 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactSettingsPanel() {
  const { data: settings, isLoading } = useLandingSettings();
  const queryClient = useQueryClient();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [form, setForm] = useState({
    contactEmail: "",
    contactPhone: "",
    contactLocation: "",
    contactInstagram: "",
    contactFacebook: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        contactEmail: settings.contactEmail ?? "",
        contactPhone: settings.contactPhone ?? "",
        contactLocation: settings.contactLocation ?? "",
        contactInstagram: settings.contactInstagram ?? "",
        contactFacebook: settings.contactFacebook ?? "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${base}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      queryClient.invalidateQueries({ queryKey: ["landing-settings"] });
      queryClient.invalidateQueries({ queryKey: ["about-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="mb-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/4 p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">Contact Details</p>
        <h2 className="text-xl font-serif font-bold text-white">Edit Contact Info</h2>
        <p className="text-white/40 text-sm mt-1">These appear on the About page. Email is also used to receive contact form submissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Email Address</span>
          <input
            className={inputCls}
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
            placeholder="vadiraj@example.com"
          />
          <span className="text-[11px] text-white/20">Contact form submissions will be sent here</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Phone Number</span>
          <input
            className={inputCls}
            type="tel"
            value={form.contactPhone}
            onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Location</span>
        <input
          className={inputCls}
          value={form.contactLocation}
          onChange={(e) => setForm((f) => ({ ...f, contactLocation: e.target.value }))}
          placeholder="Bengaluru, India"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Instagram</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">@</span>
            <input
              className={`${inputCls} pl-7`}
              value={form.contactInstagram}
              onChange={(e) => setForm((f) => ({ ...f, contactInstagram: e.target.value.replace(/^@/, "") }))}
              placeholder="vadiraj.wildlife"
            />
          </div>
          <span className="text-[11px] text-white/20">Username only, without @</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Facebook</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">@</span>
            <input
              className={`${inputCls} pl-7`}
              value={form.contactFacebook}
              onChange={(e) => setForm((f) => ({ ...f, contactFacebook: e.target.value.replace(/^@/, "") }))}
              placeholder="vadiraj.photography"
            />
          </div>
          <span className="text-[11px] text-white/20">Username or page name, without @</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Contact Info"}
        </button>
        {saved && <span className="text-xs text-emerald-400 font-mono">Saved ✓</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 flex gap-3">
        <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-amber-300 font-medium">To enable email delivery</p>
          <p className="text-[11px] text-white/30 leading-relaxed">
            Add <code className="text-amber-400/70">GMAIL_USER</code> and <code className="text-amber-400/70">GMAIL_APP_PASSWORD</code> as secrets in your Replit project. Use a Gmail App Password (not your regular password). Contact form messages are always saved in the database regardless.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { data: trips, isLoading } = useListTrips();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [editing, setEditing] = useState<TripRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetch(`${base}/api/auth/me`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          setLocation("/admin/login");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => setLocation("/admin/login"));
  }, []);

  const handleSignOut = async () => {
    await fetch(`${base}/api/auth/logout`, { method: "POST", credentials: "include" });
    setLocation("/admin/login");
  };

  const refresh = () => queryClient.invalidateQueries();

  const handleSaved = (id: number) => {
    refresh();
    setSaved(id);
    setTimeout(() => setSaved(null), 2500);
  };

  const typedTrips = (trips as TripRow[] | undefined) ?? [];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">Admin</p>
            <h1 className="text-3xl font-serif font-bold">Wildpixels Admin</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex-shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-white/25 text-white/40 hover:text-white/70 text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>

        {/* Landing Page Settings */}
        <LandingSettingsPanel trips={typedTrips} />

        {/* About Page Settings */}
        <AboutSettingsPanel />

        {/* Contact Details */}
        <ContactSettingsPanel />

        {/* Field Notes / Articles */}
        <ArticlesPanel />

        {/* Section header + Add button */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1">Trips</p>
            <h2 className="text-xl font-serif font-bold text-white">Manage Trips</h2>
            <p className="text-white/40 mt-1 text-sm">
              Click <strong className="text-white/60">Edit</strong> to update, or <strong className="text-white/60">Add Trip</strong> to create a new one.
            </p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/15 hover:border-amber-500/40 text-white text-sm font-medium transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Trip
          </button>
        </div>

        {isLoading ? (
          <div className="text-white/40 text-sm">Loading trips…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {typedTrips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setEditing(trip)}
                className="w-full text-left flex items-center gap-4 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-amber-500/30 rounded-xl px-5 py-4 transition-all group"
              >
                <img
                  src={trip.coverImageUrl}
                  alt={trip.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white truncate">{trip.title}</span>
                    {trip.featured && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex-shrink-0">Featured</span>
                    )}
                    {trip.googlePhotosUrl && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full flex-shrink-0">Google Photos ✓</span>
                    )}
                    {saved === trip.id && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full flex-shrink-0">Saved ✓</span>
                    )}
                  </div>
                  <div className="text-sm text-white/45 mt-0.5 truncate">
                    {trip.location}, {trip.country} · {trip.month} {trip.year}
                  </div>
                </div>
                <span className="flex-shrink-0 px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold uppercase tracking-wider">Edit</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          trip={editing}
          onClose={() => setEditing(null)}
          onSaved={() => handleSaved(editing.id)}
          onDeleted={() => { refresh(); setEditing(null); }}
        />
      )}

      {adding && (
        <AddTripModal
          onClose={() => setAdding(false)}
          onCreated={() => { refresh(); setAdding(false); }}
        />
      )}
    </div>
  );
}
