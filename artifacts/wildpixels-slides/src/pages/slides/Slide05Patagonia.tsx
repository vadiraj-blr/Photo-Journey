export default function Slide05Patagonia() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "8vh", left: "7vw", fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888880", fontFamily: "'DM Mono', monospace" }}>
        Chile — November 2022
      </div>
      <div style={{ position: "absolute", top: "8vh", right: "7vw", fontSize: "1vw", color: "#888880" }}>05</div>

      <div style={{ position: "absolute", top: "18vh", left: "7vw", maxWidth: "40vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Patagonia Ice Fields
        </h2>
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.7 }}>
          Seven days on the W circuit with 12kg of gear, waking at 4am each day hoping the famous peaks would appear. On day seven, they did — perfectly reflected in the milky turquoise lake below.
        </p>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#888880", marginTop: "1.5vh", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
          "Patagonian light is feral and unpredictable."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "2vw" }}>
          <div style={{ backgroundColor: "#0D0D0D", padding: "1.5vh 2vw" }}>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Type</div>
            <div style={{ fontSize: "1.2vw", color: "#F5F3EF", fontWeight: 500, marginTop: "0.5vh" }}>Landscape</div>
          </div>
          <div style={{ backgroundColor: "#0D0D0D", padding: "1.5vh 2vw" }}>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Trek</div>
            <div style={{ fontSize: "1.2vw", color: "#F5F3EF", fontWeight: 500, marginTop: "0.5vh" }}>7 days W circuit</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "15vh", right: "6vw", width: "44vw", height: "72vh", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85"
          crossOrigin="anonymous"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Patagonia"
        />
      </div>
    </div>
  );
}
