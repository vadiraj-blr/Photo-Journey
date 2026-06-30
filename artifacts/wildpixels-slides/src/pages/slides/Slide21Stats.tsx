export default function Slide21Stats() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 60% 50%, rgba(196,134,42,0.06) 0%, transparent 70%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1vw" }}>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>The Portfolio</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#2A2A28", fontFamily: "'DM Mono', monospace" }}>21</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "7vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>
          18 Places.
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "7vw", fontWeight: 900, color: "#C4862A", margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>
          1195 Photos.
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "7vw", fontWeight: 900, color: "#333330", margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>
          One Lens.
        </p>
        <div style={{ marginTop: "5vh", display: "flex", gap: "5vw" }}>
          {[
            ["India", "All Expeditions"],
            ["Wildlife", "Primary Focus"],
            ["2024–2026", "Active Years"],
            ["15+", "Expeditions"],
          ].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#555550", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.5vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
