export default function Slide07TravelTips() {
  const tips = [
    ["When to Go", "Best light and sightings, season by season"],
    ["What to Pack", "Gear notes from real field trips"],
    ["Where to Wait", "The spots that reward patience"],
  ];
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}gear-flatlay.png`}
        style={{ position: "absolute", top: 0, right: 0, width: "42vw", height: "100%", objectFit: "cover", opacity: 0.85 }}
        alt="Wildlife expedition gear flat lay"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,13,13,1) 52%, rgba(13,13,13,0.15) 70%, rgba(13,13,13,0.05) 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", top: "24vh", left: "7vw", maxWidth: "40vw" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.6vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.1 }}>
          Know Before
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.6vw", fontWeight: 700, color: "#C4862A", margin: 0, lineHeight: 1.1 }}>
          You Go
        </h1>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh 0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh" }}>
          <div>
            <div style={{ fontSize: "1.2vw", fontWeight: 600, color: "#F5F3EF" }}>{tips[0][0]}</div>
            <div style={{ fontSize: "1vw", fontWeight: 300, color: "#A8A5A0", marginTop: "0.4vh" }}>{tips[0][1]}</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2vw", fontWeight: 600, color: "#F5F3EF" }}>{tips[1][0]}</div>
            <div style={{ fontSize: "1vw", fontWeight: 300, color: "#A8A5A0", marginTop: "0.4vh" }}>{tips[1][1]}</div>
          </div>
          <div>
            <div style={{ fontSize: "1.2vw", fontWeight: 600, color: "#F5F3EF" }}>{tips[2][0]}</div>
            <div style={{ fontSize: "1vw", fontWeight: 300, color: "#A8A5A0", marginTop: "0.4vh" }}>{tips[2][1]}</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>07 / 13</div>
    </div>
  );
}
