import { useState } from "react";
import { useListTrips } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

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
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-mono uppercase tracking-widest text-white/40">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/60 transition-colors text-sm";

function EditModal({
  trip,
  onClose,
  onSaved,
}: {
  trip: TripRow;
  onClose: () => void;
  onSaved: () => void;
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
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

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
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          featured: form.featured,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#141414] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Trip</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <Field label="Title">
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Country">
              <input className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Month">
              <select
                className={inputCls}
                value={form.month}
                onChange={(e) => set("month", e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
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

          <Field label="Cover Image URL">
            <input className={inputCls} value={form.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)} />
          </Field>

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
              className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                form.featured ? "bg-amber-500" : "bg-white/15"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.featured ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-sm text-white/70">Featured on homepage</span>
          </label>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm"
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
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { data: trips, isLoading } = useListTrips();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TripRow | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  const handleSaved = (id: number) => {
    queryClient.invalidateQueries();
    setSaved(id);
    setTimeout(() => setSaved(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">Admin</p>
          <h1 className="text-3xl font-serif font-bold">Manage Trips</h1>
          <p className="text-white/50 mt-2 text-sm">
            Click any trip to edit its details. Changes are saved to the database immediately.
          </p>
        </div>

        {isLoading ? (
          <div className="text-white/40 text-sm">Loading trips…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {(trips as TripRow[] | undefined)?.map((trip) => (
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
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        Featured
                      </span>
                    )}
                    {saved === trip.id && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        Saved ✓
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/45 mt-0.5 truncate">
                    {trip.location}, {trip.country} · {trip.month} {trip.year}
                  </div>
                </div>
                <span className="flex-shrink-0 px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold uppercase tracking-wider">
                  Edit
                </span>
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
        />
      )}
    </div>
  );
}
