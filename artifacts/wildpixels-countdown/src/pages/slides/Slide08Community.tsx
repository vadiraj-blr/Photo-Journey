export default function Slide08Community() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}leopard-eye.png`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
        alt="Close-up of a leopard's eyes"
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.94) 78%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -52%)", textAlign: "center", maxWidth: "50vw" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.15 }}>
          Tell Us What
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#C4862A", margin: 0, lineHeight: 1.15 }}>
          You See
        </h1>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh auto" }} />
        <p style={{ fontSize: "1.2vw", fontWeight: 300, color: "#C9C6C0", lineHeight: 1.6 }}>
          React to a frame. Leave a note. The forest talks back.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>08 / 13</div>
    </div>
  );
}
