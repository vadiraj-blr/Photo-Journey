const FEATURES = [
  { icon: "◈", title: "Full Portfolio", desc: "22+ expeditions across India's national parks — browse by destination or species" },
  { icon: "◉", title: "Fine Art Prints", desc: "Limited-edition archival prints from select images — signed, numbered, ready to ship" },
  { icon: "◈", title: "Field Notes", desc: "Expedition diaries, sighting reports and photography tips from the field" },
  { icon: "◉", title: "Commissions & Bookings", desc: "Editorial assignments, conservation media and documentary expedition enquiries" },
];

export default function SlideWebsite() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(196,134,42,0.06) 0%, transparent 65%)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: "42vw", height: "100%", borderLeft: "1px solid rgba(196,134,42,0.08)", background: "linear-gradient(to left, rgba(196,134,42,0.04) 0%, transparent 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1vw" }}>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Wildpixels · Online</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#2A2A28", fontFamily: "'DM Mono', monospace" }}>21</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "50vw" }}>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "3vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          wildpixels.co
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#7A7870", marginTop: "2.5vh", lineHeight: 1.75, maxWidth: "42vw" }}>
          The complete archive of India's wild — two decades of expeditions, captured and curated in one place.
        </p>

        <div style={{ marginTop: "4vh", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5vh 3vw" }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ fontSize: "1vw", color: "#C4862A", marginTop: "0.3vh", flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{icon}</div>
              <div>
                <div style={{ fontSize: "0.95vw", fontWeight: 600, color: "#F5F3EF", marginBottom: "0.6vh" }}>{title}</div>
                <div style={{ fontSize: "0.85vw", fontWeight: 300, color: "#666560", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "4.5vh", display: "inline-flex", alignItems: "center", gap: "0", border: "1px solid rgba(196,134,42,0.3)" }}>
          <div style={{ backgroundColor: "#C4862A", padding: "1.5vh 2vw" }}>
            <span style={{ fontSize: "0.85vw", fontWeight: 700, color: "#080808", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Visit</span>
          </div>
          <div style={{ padding: "1.5vh 2vw" }}>
            <span style={{ fontSize: "0.85vw", color: "#F5F3EF", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>wildpixels.co</span>
          </div>
        </div>
      </div>
    </div>
  );
}
