export default function Slide09Gallery() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}collage-hero.png`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.92 }}
        alt="Collage of striking wildlife photographs"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0) 30%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", left: "7vw" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4vw", fontWeight: 700, color: "#F5F3EF", margin: 0 }}>
          A gallery worth getting lost in.
        </h1>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#EDEBE6", fontFamily: "'DM Mono', monospace" }}>09 / 13</div>
    </div>
  );
}
