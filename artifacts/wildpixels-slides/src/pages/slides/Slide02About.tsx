export default function Slide02About() {
  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
        backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ position: "absolute", top: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888880", fontFamily: "'DM Mono', monospace" }}>
        Wildpixels — The Photographer
      </div>

      <div style={{ position: "absolute", top: 0, left: 0, width: "38vw", height: "100%", backgroundColor: "#0D0D0D", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"
          crossOrigin="anonymous"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
          alt="Vadiraj in the field"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.8) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "6vh", left: "4vw" }}>
          <div style={{ fontSize: "1.8vw", fontWeight: 600, color: "#F5F3EF", fontFamily: "'Playfair Display', serif" }}>Vadiraj</div>
          <div style={{ fontSize: "1vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", marginTop: "0.5vh" }}>Wildlife & Landscape Photographer</div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "44vw", transform: "translateY(-50%)", maxWidth: "48vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "3vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
          Behind the Lens
        </h2>
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#555550", marginTop: "3vh", lineHeight: 1.7, maxWidth: "42vw" }}>
          I am a wildlife and landscape photographer based in India, chasing light and wild animals across four continents. My work documents the raw, unguarded moments that exist at the boundary between wilderness and silence.
        </p>
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#555550", marginTop: "2vh", lineHeight: 1.7, maxWidth: "42vw" }}>
          Each journey is an act of patience — sometimes waiting weeks for a single frame that could not have been planned, only witnessed.
        </p>
        <div style={{ marginTop: "4vh", display: "flex", gap: "3vw" }}>
          <div>
            <div style={{ fontSize: "2.8vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>20</div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Expeditions</div>
          </div>
          <div>
            <div style={{ fontSize: "2.8vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>14</div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Countries</div>
          </div>
          <div>
            <div style={{ fontSize: "2.8vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>150+</div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Published Photos</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>
        02
      </div>
    </div>
  );
}
