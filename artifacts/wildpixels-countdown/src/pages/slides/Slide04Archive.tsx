export default function Slide04Archive() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}photo-mosaic.png`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
        alt="Mosaic of wildlife photographs"
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(13,13,13,0.4) 0%, rgba(13,13,13,0.92) 75%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -52%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "8vw", fontWeight: 900, color: "#F5F3EF", lineHeight: 0.9 }}>1,195</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2vw", fontWeight: 700, color: "#C4862A", margin: "1.5vh 0 0" }}>
          Frames. One Site.
        </h1>
        <p style={{ fontSize: "1.15vw", fontWeight: 300, color: "#C9C6C0", lineHeight: 1.6, maxWidth: "34vw", margin: "2vh auto 0" }}>
          Every photo has a place, a moment, a reason it was kept.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>04 / 13</div>
    </div>
  );
}
