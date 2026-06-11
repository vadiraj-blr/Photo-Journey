import { useState } from "react";
import { motion } from "framer-motion";

export default function SubscribeSection() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${base}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-stone-900 px-10 py-14 md:px-16 md:py-16 flex flex-col md:flex-row items-start md:items-center gap-10"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

          <div className="flex-1 relative z-10">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-amber-500 mb-3">Stay in the Loop</p>
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
              Never miss a story<br className="hidden md:block" /> from the wild.
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Subscribe to get notified when a new field note or journey is published. One email at a time — no noise.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto md:min-w-[340px]">
            {status === "done" ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">You're subscribed.</p>
                  <p className="text-stone-400 text-xs mt-0.5">Watch your inbox for new stories from the wild.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === "loading"}
                    className="flex-1 min-w-0 bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {status === "loading" ? "…" : "Notify me"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-xs">{errorMsg}</p>
                )}
                <p className="text-stone-600 text-[11px]">Unsubscribe anytime. No spam, ever.</p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
