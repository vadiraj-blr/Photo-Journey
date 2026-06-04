import { useState, useEffect } from "react";
import { useListTrips } from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";

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
  });
}

function LandingSettingsPanel({ trips }: { trips: TripRow[] }) {
  const { data: settings, isLoading } = useLandingSettings();
  const queryClient = useQueryClient();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [form, setForm] = useState({
    heroImageUrl: "",
    heroImageSourceTripId: null as number | null,
    tripsOnHomepage: "0",
    heroTagline: "Enter the Wild.",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        heroImageUrl: settings.heroImageUrl ?? "",
        heroImageSourceTripId: settings.heroImageSourceTripId ?? null,
        tripsOnHomepage: String(settings.tripsOnHomepage ?? 0),
        heroTagline: settings.heroTagline ?? "Enter the Wild.",
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
        body: JSON.stringify({
          heroImageUrl: form.heroImageUrl,
          heroImageSourceTripId: form.heroImageSourceTripId,
          tripsOnHomepage: Number(form.tripsOnHomepage),
          heroTagline: form.heroTagline,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      queryClient.invalidateQueries({ queryKey: ["landing-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const tripsWithPhotos = trips.filter((t) => t.googlePhotosUrl);
  const selectedTrip = tripsWithPhotos.find((t) => t.id === form.heroImageSourceTripId);

  if (isLoading) return null;

  return (
    <div className="mb-12 rounded-2xl border border-amber-500/20 bg-amber-500/4 p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-1">Landing Page</p>
        <h2 className="text-xl font-serif font-bold text-white">Customise Homepage</h2>
        <p className="text-white/40 text-sm mt-1">Choose the hero slideshow album and how many trips to show.</p>
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

      {/* Hero slideshow source */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Hero Slideshow Album</span>

        {tripsWithPhotos.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-white/30">
              Photos cycle every 3 s. Pick which trip's album to use as the hero background:
            </p>
            <div className="flex flex-wrap gap-2">
              {tripsWithPhotos.map((t) => {
                const isActive = form.heroImageSourceTripId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        heroImageSourceTripId: isActive ? null : t.id,
                        heroImageUrl: isActive ? f.heroImageUrl : "",
                      }))
                    }
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      isActive
                        ? "border-amber-500 text-amber-400 bg-amber-500/15 font-semibold"
                        : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                    }`}
                  >
                    {isActive && <span className="text-amber-400">▶</span>}
                    {t.title}
                  </button>
                );
              })}
            </div>
            {selectedTrip && (
              <p className="text-[11px] text-amber-500/70">
                Slideshow will use all photos from "{selectedTrip.title}".
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-white/25">
            Add a Google Photos album to any trip above to use it as the hero slideshow.
          </p>
        )}

        {/* Fallback static URL (shown only when no album is selected) */}
        {!form.heroImageSourceTripId && (
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-white/30">Or use a single static image URL as fallback:</p>
            <div className="flex items-start gap-3">
              {form.heroImageUrl && (
                <img
                  src={form.heroImageUrl.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w120"}
                  alt="Hero preview"
                  className="w-20 h-14 rounded-lg object-cover flex-shrink-0 border border-white/10"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <input
                className={`${inputCls} flex-1`}
                placeholder="Paste a static image URL…"
                value={form.heroImageUrl}
                onChange={(e) => setForm((f) => ({ ...f, heroImageUrl: e.target.value }))}
              />
            </div>
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
  coverImageUrl: string;
  tags: string[];
  featured: boolean;
  googlePhotosUrl?: string | null;
  galleryPhotoUrls?: string[];
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
  tripId,
  currentCover,
  galleryUrls,
  onSetCover,
  onSetGallery,
}: {
  tripId: number;
  currentCover: string;
  galleryUrls: string[];
  onSetCover: (url: string) => void;
  onSetGallery: (urls: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (photos.length > 0) { setOpen(true); return; }
    setLoading(true);
    setError(null);
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/trips/${tripId}/google-photos`)
      .then((r) => r.json())
      .then((data) => {
        if (data.photos?.length) { setPhotos(data.photos); setOpen(true); }
        else setError("No photos found in the album yet.");
      })
      .catch(() => setError("Could not load album."))
      .finally(() => setLoading(false));
  };

  const toggleGallery = (url: string) => {
    if (galleryUrls.includes(url)) {
      onSetGallery(galleryUrls.filter((u) => u !== url));
    } else {
      onSetGallery([...galleryUrls, url]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={load}
        disabled={loading}
        className="self-start text-xs font-mono uppercase tracking-wider text-amber-500 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Loading photos…" : "Pick from Google Photos album"}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {open && photos.length > 0 && (
        <div className="flex flex-col gap-3">
          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] text-white/35">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500/80 inline-block" /> Thumbnail (cover)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-500/80 inline-block" /> Gallery photo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto rounded-xl border border-white/10 p-2 bg-white/3">
            {photos.map((url, i) => {
              const base2 = url.replace(/=w\d+(-h\d+)?(-no)?$/, "");
              const thumb = `${base2}=w300`;
              const isCover = currentCover === url;
              const inGallery = galleryUrls.includes(url);

              return (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg group">
                  <img src={thumb} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />

                  {/* Badges */}
                  {isCover && (
                    <div className="absolute top-1 left-1 bg-amber-500 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-black leading-none">
                      Cover
                    </div>
                  )}
                  {inGallery && (
                    <div className={`absolute top-1 ${isCover ? "left-12" : "left-1"} bg-sky-500 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white leading-none`}>
                      Gallery
                    </div>
                  )}

                  {/* Action buttons on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                    <button
                      type="button"
                      onClick={() => onSetCover(url)}
                      className={`w-full text-[10px] font-semibold py-1 rounded-md transition-colors ${
                        isCover
                          ? "bg-amber-500 text-black"
                          : "bg-white/20 text-white hover:bg-amber-500/70 hover:text-black"
                      }`}
                    >
                      {isCover ? "✓ Cover" : "Set Cover"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGallery(url)}
                      className={`w-full text-[10px] font-semibold py-1 rounded-md transition-colors ${
                        inGallery
                          ? "bg-sky-500 text-white"
                          : "bg-white/20 text-white hover:bg-sky-500/70 hover:text-white"
                      }`}
                    >
                      {inGallery ? "✓ Gallery" : "+ Gallery"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/35">
              {galleryUrls.length === 0
                ? "No gallery photos selected — all album photos will show"
                : `${galleryUrls.length} gallery photo${galleryUrls.length !== 1 ? "s" : ""} selected`}
            </p>
            <div className="flex items-center gap-3">
              {galleryUrls.length > 0 && (
                <button type="button" onClick={() => onSetGallery([])} className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors">
                  Clear selection
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                Close
              </button>
            </div>
          </div>
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
    year: string; story: string; coverImageUrl: string; tags: string;
    featured: boolean; googlePhotosUrl: string; galleryPhotoUrls: string[];
  };
  set: (field: string, value: string | boolean) => void;
  setGallery: (urls: string[]) => void;
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

      {/* Photo picker — cover + gallery selection */}
      {tripId && form.googlePhotosUrl && (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/8 bg-white/2">
          <div className="flex items-start gap-3 mb-1">
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
                placeholder="Paste or pick from album below"
                onChange={(e) => set("coverImageUrl", e.target.value)}
              />
            </div>
          </div>
          <TripPhotoPicker
            tripId={tripId}
            currentCover={form.coverImageUrl}
            galleryUrls={form.galleryPhotoUrls}
            onSetCover={(url) => set("coverImageUrl", url)}
            onSetGallery={setGallery}
          />
        </div>
      )}

      {/* Fallback: no google photos yet — just show cover URL input */}
      {!(tripId && form.googlePhotosUrl) && (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/8 bg-white/2">
          <div className="flex items-start gap-3">
            {form.coverImageUrl && (
              <img
                src={form.coverImageUrl.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w120"}
                alt="Cover preview"
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <Field label="Cover Image URL">
              <input
                className={inputCls}
                value={form.coverImageUrl}
                placeholder="Paste an image URL"
                onChange={(e) => set("coverImageUrl", e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}

      <Field label="Tags (comma-separated)">
        <input
          className={inputCls}
          placeholder="wildlife, landscape, birds"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
        />
      </Field>

      <Field label="Story / Description">
        <textarea
          className={`${inputCls} resize-y min-h-[100px]`}
          value={form.story}
          onChange={(e) => set("story", e.target.value)}
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
    year: String(new Date().getFullYear()), story: "",
    coverImageUrl: "", tags: "", featured: false, googlePhotosUrl: "",
    galleryPhotoUrls: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));
  const setGallery = (urls: string[]) => setForm((f) => ({ ...f, galleryPhotoUrls: urls }));

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
  const setGallery = (urls: string[]) => setForm((f) => ({ ...f, galleryPhotoUrls: urls }));

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

export default function Admin() {
  const { data: trips, isLoading } = useListTrips();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TripRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);

  const refresh = () => queryClient.invalidateQueries();

  const handleSaved = (id: number) => {
    refresh();
    setSaved(id);
    setTimeout(() => setSaved(null), 2500);
  };

  const typedTrips = (trips as TripRow[] | undefined) ?? [];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">Admin</p>
          <h1 className="text-3xl font-serif font-bold">Wildpixels Admin</h1>
        </div>

        {/* Landing Page Settings */}
        <LandingSettingsPanel trips={typedTrips} />

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
