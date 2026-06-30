export default function Slide18Coastal() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczM5u5Xus0YkM9uTsn8pvIs_-yiHooBuh_goZTi0VLp_J87fGaQgESnfAu9_9lYGYXHG7of4PehQ-PwFPw-Ml8bKKarDsUycGN0599bqydcwF8Cek-yV=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Rameshwaram coastal"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 50%, rgba(10,10,10,0.97) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "7vh", left: "7vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Rameshwaram, Tamil Nadu · October 2025</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>18</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "44vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Rameshwaram:<br />Coastal Light
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          At the southeastern tip of India, where the Bay of Bengal meets the Gulf of Mannar, Rameshwaram offers a different kind of photography — shorebirds at first light, fishing boats against a violet horizon, wading egrets in shallow mangrove lagoons.
        </p>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          The Indian Ocean light here is unlike anything inland: saturated, warm, and unforgiving. You work fast, or the moment dissolves into the heat haze.
        </p>
        <div style={{ marginTop: "3.5vh", display: "flex", gap: "3vw" }}>
          {[["Shorebirds", "40+ Species"], ["Oct 2025", "Post-Monsoon"], ["Gulf of Mannar", "Marine Sanctuary"]].map(([v, l]) => (
            <div key={l} style={{ borderLeft: "2px solid #2A2A28", paddingLeft: "1.2vw" }}>
              <div style={{ fontSize: "1.05vw", fontWeight: 700, color: "#F5F3EF" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#555550", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.4vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
