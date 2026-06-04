const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
        backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85"
        crossOrigin="anonymous"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
        alt="Wildlife"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,0.92) 45%, rgba(13,13,13,0.3) 100%)" }} />

      <div style={{ position: "absolute", top: "8vh", left: "7vw", fontSize: "1vw", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
        Vadiraj — Wildlife & Landscape Photography
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "55vw" }}>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "3vh" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "8vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>
          WILD
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "8vw", fontWeight: 900, color: "#C4862A", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>
          PIXELS
        </h1>
        <p style={{ fontSize: "1.8vw", fontWeight: 300, color: "#B0ADA8", marginTop: "3vh", lineHeight: 1.5 }}>
          20 expeditions. 4 continents. One lens.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", left: "7vw", fontSize: "1.1vw", fontWeight: 400, color: "#888880", fontFamily: "'DM Mono', monospace" }}>
        wildpixels.co — Vadiraj
      </div>
      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>
        01
      </div>
    </div>
  );
}
