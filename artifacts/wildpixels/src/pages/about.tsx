import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetTripStats, useListTrips } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";

interface AboutSettings {
  highlightPhotoUrls: string[];
  aboutTitle: string;
  aboutPortraitUrl: string;
  aboutBio: string;
  aboutPhotoHeight: number;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  contactInstagram: string;
  contactFacebook: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  published: boolean;
  created_at: string;
}

function useAboutSettings() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return useQuery<AboutSettings>({
    queryKey: ["about-settings"],
    queryFn: () => fetch(`${base}/api/settings`).then((r) => r.json()),
    staleTime: 60_000,
  });
}

function useFieldNotes() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return useQuery<Article[]>({
    queryKey: ["field-notes"],
    queryFn: () => fetch(`${base}/api/articles`).then((r) => r.json()),
    staleTime: 60_000,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

interface TripRow {
  id: number;
  location: string;
  country: string;
  year: number;
}

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const SIZE_CLASSES = [
  "text-3xl md:text-4xl font-serif",
  "text-xl md:text-2xl font-sans font-light",
  "text-base font-mono uppercase tracking-widest",
  "text-2xl md:text-3xl font-serif italic",
  "text-sm font-sans uppercase tracking-widest",
  "text-lg font-serif",
  "text-2xl font-sans font-semibold",
  "text-xs font-mono uppercase tracking-[0.2em]",
];

const OPACITY_CLASSES = [
  "text-stone-700",
  "text-stone-400",
  "text-stone-500",
  "text-amber-600/70",
  "text-stone-300",
  "text-stone-600",
  "text-amber-500/50",
  "text-stone-400",
];

function ContactForm({ toEmail }: { toEmail: string }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls = "w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none";

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-300 bg-emerald-50 p-10 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-emerald-700 font-medium mb-1">Message sent!</p>
        <p className="text-stone-500 text-sm">{toEmail ? `Your message is on its way to Vadiraj.` : "Your message has been received."}</p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${focused
        ? "border-amber-400 shadow-[0_0_0_3px_rgba(217,119,6,0.08)]"
        : "border-stone-200"}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
        <div className="px-5 py-4">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">Your Name</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Vadiraj Kulkarni" className={fieldCls} />
        </div>
        <div className="px-5 py-4">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">Your Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="you@example.com" className={fieldCls} />
        </div>
      </div>
      <div className="border-t border-stone-100 px-5 py-4">
        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">Subject</label>
        <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Licensing enquiry / Collaboration / Just saying hi…" className={fieldCls} />
      </div>
      <div className="border-t border-stone-100 px-5 py-4">
        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">Message</label>
        <textarea required rows={5} maxLength={2000} value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Tell me about your project, or just share what moved you…"
          className={`${fieldCls} resize-none leading-relaxed`} />
      </div>
      <div className="border-t border-stone-100 px-5 py-4 flex items-center justify-between gap-4">
        <span className="text-[11px] text-stone-500 font-mono">{form.message.length}/2000</span>
        <button type="submit" disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all duration-200">
          {submitting ? "Sending…" : "Send Message"}
          {!submitting && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </button>
      </div>
      {error && <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-xs text-red-600">{error}</div>}
    </motion.form>
  );
}

export default function About() {
  const { data: stats } = useGetTripStats();
  const { data: settings } = useAboutSettings();
  const { data: tripsRaw } = useListTrips();
  const { data: articlesRaw } = useFieldNotes();
  const trips = (tripsRaw as TripRow[] | undefined) ?? [];
  const publishedArticles = ((articlesRaw ?? []) as Article[]).filter((a) => a.published);

  const highlights: string[] = settings?.highlightPhotoUrls ?? [];
  const aboutTitle = settings?.aboutTitle ?? "The Lens.";
  const portraitUrl = settings?.aboutPortraitUrl ?? "/images/about-portrait.png";
  const photoHeight = settings?.aboutPhotoHeight ?? 480;
  const bioRaw = settings?.aboutBio ?? "";
  const contactEmail = settings?.contactEmail ?? "";
  const contactPhone = settings?.contactPhone ?? "";
  const contactLocation = settings?.contactLocation ?? "";
  const contactInstagram = settings?.contactInstagram ?? "";
  const contactFacebook = settings?.contactFacebook ?? "";

  const placeWords: string[] = [];
  const seen = new Set<string>();
  for (const trip of trips) {
    const loc = trip.location?.trim();
    const country = trip.country?.trim();
    if (loc && !seen.has(loc)) { seen.add(loc); placeWords.push(loc); }
    if (country && !seen.has(country)) { seen.add(country); placeWords.push(country); }
  }

  const paragraphs = bioRaw
    ? bioRaw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : [
        "Vadiraj is not just an observer; he is a participant in the wild. For over a decade, his work has documented the raw, unpolished truth of nature's most formidable landscapes.",
        "From the mist-shrouded peaks of Patagonia to the golden savannas of the Serengeti, his visual diary captures moments of profound silence and fierce power. This portfolio is a curated collection of a personal legend.",
      ];

  const hasContact = contactEmail || contactPhone || contactLocation || contactInstagram || contactFacebook;

  return (
    <div className="w-full bg-stone-50 min-h-screen pt-32 pb-24 text-stone-900">

      {/* Hero: Portrait + Bio */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

        {/* Left column: photo + stats below */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col gap-10"
        >
          <div className="relative w-full" style={{ height: `${photoHeight}px` }}>
            <div className="absolute -inset-4 border border-stone-300" />
            <img
              src={portraitUrl}
              alt="Vadiraj in the wilderness"
              className="w-full h-full object-cover object-center filter grayscale hover:grayscale-0 transition-all duration-1000"
              style={{ objectPosition: 'center 35%' }}
            />
          </div>
          <div className="border-t border-stone-200 pt-8 grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="block text-4xl font-serif text-stone-900">{stats?.tripCount || 0}</span>
              <span className="block text-xs uppercase tracking-widest text-amber-700">Expeditions</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl font-serif text-stone-900">{stats?.countryCount || 0}</span>
              <span className="block text-xs uppercase tracking-widest text-amber-700">Countries</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl font-serif text-stone-900">{stats?.photoCount || 0}</span>
              <span className="block text-xs uppercase tracking-widest text-amber-700">Captures</span>
            </div>
          </div>
        </motion.div>

        {/* Right column: title → bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight text-amber-600">{aboutTitle}</h1>
          <div className="space-y-5 text-[1.0625rem] text-stone-800 leading-[1.9] [font-family:var(--font-prose)]">
            {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </motion.div>
      </div>

      {/* Places Word Map */}
      {placeWords.length > 0 && (
        <div className="mt-32 relative overflow-hidden bg-stone-100/60 py-16">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-10"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-600">Places Witnessed</p>
          </motion.div>
          <div className="px-8 md:px-16 flex flex-wrap justify-center items-baseline gap-x-6 gap-y-4 max-w-[1100px] mx-auto">
            {placeWords.map((place, i) => {
              const r1 = seededRand(i * 3);
              const r2 = seededRand(i * 3 + 1);
              const sizeClass = SIZE_CLASSES[Math.floor(r1 * SIZE_CLASSES.length)];
              const opacityClass = OPACITY_CLASSES[Math.floor(r2 * OPACITY_CLASSES.length)];
              return (
                <motion.span
                  key={place}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 8) * 0.06 }}
                  className={`${sizeClass} ${opacityClass} leading-tight select-none cursor-default hover:text-amber-600 transition-colors duration-500`}
                >
                  {place}
                </motion.span>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-600 mb-3">Get in Touch</p>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">Let's Connect.</h2>
          <p className="text-stone-800 max-w-lg">
            Whether you're interested in licensing an image, planning a collaboration, or simply want to share what moved you — I'd love to hear from you.
          </p>
        </motion.div>

        {hasContact && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          >
            {contactEmail && (
              <a href={`mailto:${contactEmail}`}
                className="group flex items-start gap-3 p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 hover:shadow-sm transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-1">Email</p>
                  <p className="text-sm text-stone-900 group-hover:text-amber-700 transition-colors break-all">{contactEmail}</p>
                </div>
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="group flex items-start gap-3 p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 hover:shadow-sm transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-1">Phone</p>
                  <p className="text-sm text-stone-900 group-hover:text-amber-700 transition-colors">{contactPhone}</p>
                </div>
              </a>
            )}
            {contactLocation && (
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-stone-200 bg-white">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-1">Based in</p>
                  <p className="text-sm text-stone-900">{contactLocation}</p>
                </div>
              </div>
            )}
            {contactInstagram && (
              <a
                href={`https://instagram.com/${contactInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-5 rounded-2xl border border-stone-200 bg-white hover:border-pink-400 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-100 transition-colors">
                  <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-1">Instagram</p>
                  <p className="text-sm text-stone-900 group-hover:text-pink-600 transition-colors">@{contactInstagram}</p>
                </div>
              </a>
            )}
            {contactFacebook && (
              <a
                href={`https://facebook.com/${contactFacebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-5 rounded-2xl border border-stone-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-1">Facebook</p>
                  <p className="text-sm text-stone-900 group-hover:text-blue-600 transition-colors">@{contactFacebook}</p>
                </div>
              </a>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <ContactForm toEmail={contactEmail} />
        </motion.div>
      </div>

      {/* Field Notes */}
      {publishedArticles.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-600 mb-3">Field Notes</p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">From the Journal.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
              >
                <Link href={`/field-notes/${article.slug}`}>
                  <div className="group flex flex-col rounded-2xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer h-full">
                    {/* Cover image */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100 flex-shrink-0">
                      {article.cover_image_url ? (
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-6 gap-3">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-stone-600">{formatDate(article.created_at)}</p>
                      <h3 className="text-xl font-serif font-semibold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-sm text-stone-700 leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                      )}
                      <div className="pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-stone-500 group-hover:text-amber-600 transition-colors mt-auto">
                        Read article
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Curated Highlights */}
      {highlights.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-32">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs uppercase tracking-widest text-amber-600 mb-16"
          >
            Curated Highlights
          </motion.h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {highlights.map((url, i) => {
              const displayUrl = url.replace(/=w\d+(-h\d+)?(-no)?$/, "") + "=w1200";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.15 }}
                  className="break-inside-avoid mb-6 overflow-hidden"
                >
                  <img src={displayUrl} alt={`Highlight ${i + 1}`} className="w-full object-cover" />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
