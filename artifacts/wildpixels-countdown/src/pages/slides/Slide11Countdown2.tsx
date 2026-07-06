export default function Slide11Countdown2() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(30,26,18,0.6) 0%, rgba(13,13,13,1) 72%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -55%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14vw", fontWeight: 900, color: "#C4862A", lineHeight: 0.85 }}>2</div>
        <div style={{ fontSize: "1.2vw", fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase", color: "#F5F3EF", marginTop: "2vh" }}>
          Days
        </div>
        <p style={{ fontSize: "1.1vw", fontWeight: 300, color: "#8A8A82", marginTop: "3vh" }}>Field notes. Full stories. Real places.</p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>11 / 13</div>
    </div>
  );
}
