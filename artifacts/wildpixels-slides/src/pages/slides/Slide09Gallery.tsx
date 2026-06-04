export default function Slide09Gallery() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "8vh", left: "7vw", zIndex: 2 }}>
        <div style={{ fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Select Work
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.2vw", fontWeight: 700, color: "#F5F3EF", margin: "1vh 0 0", lineHeight: 1.1 }}>
          Portfolio Highlights
        </h2>
      </div>

      <div style={{ position: "absolute", top: "22vh", left: "7vw", right: "7vw", height: "65vh", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "1vw" }}>
        <div style={{ gridRow: "span 2", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=700&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Migration" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Aurora" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Galapagos" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Namib" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Faroe" />
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>09</div>
    </div>
  );
}
