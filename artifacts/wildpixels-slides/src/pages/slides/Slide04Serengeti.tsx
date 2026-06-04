export default function Slide04Serengeti() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85"
        crossOrigin="anonymous"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        alt="Serengeti"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.85) 100%)" }} />

      <div style={{ position: "absolute", top: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
        Tanzania — February 2024
      </div>

      <div style={{ position: "absolute", bottom: "10vh", left: "7vw", maxWidth: "60vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          The Great Migration
        </h2>
        <p style={{ fontSize: "1.5vw", fontWeight: 300, color: "#B0ADA8", marginTop: "2.5vh", lineHeight: 1.6, maxWidth: "50vw" }}>
          Three weeks on the Mara River watching two million wildebeest summon the courage to cross. When the herd finally moved, the ground shook.
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "3vw" }}>
          <div style={{ borderLeft: "2px solid #C4862A", paddingLeft: "1.5vw" }}>
            <div style={{ fontSize: "1.1vw", color: "#888880" }}>Duration</div>
            <div style={{ fontSize: "1.4vw", color: "#F5F3EF", fontWeight: 500 }}>21 days</div>
          </div>
          <div style={{ borderLeft: "2px solid #C4862A", paddingLeft: "1.5vw" }}>
            <div style={{ fontSize: "1.1vw", color: "#888880" }}>Category</div>
            <div style={{ fontSize: "1.4vw", color: "#F5F3EF", fontWeight: 500 }}>Wildlife / Safari</div>
          </div>
          <div style={{ borderLeft: "2px solid #C4862A", paddingLeft: "1.5vw" }}>
            <div style={{ fontSize: "1.1vw", color: "#888880" }}>Photos</div>
            <div style={{ fontSize: "1.4vw", color: "#F5F3EF", fontWeight: 500 }}>8 selected</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>04</div>
    </div>
  );
}
