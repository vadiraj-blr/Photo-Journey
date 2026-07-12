export default function Slide19Valparai2() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Dandeli, Karnataka · May 2025
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>19</div>

      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczPw5MsG07tQm5TUvSsJyG80_WHOIzdeIPjWzmZtCdXpInMH34JyVOSZ9JBbd-0s3OOX6Xd-okTfDPQ5W2SgrBjRXv7aE6IyBZC76F1b7IjRH-08rB2j=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "44.0% 100.0%" }}
          alt="Red Phalarope Dandeli"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 55%, rgba(245,243,239,0.92) 100%)" }} />
        <div style={{ position: "absolute", top: "4vh", left: "4vw" }}>
          <div style={{ backgroundColor: "rgba(196,134,42,0.9)", display: "inline-block", padding: "0.8vh 1.2vw" }}>
            <span style={{ fontSize: "0.75vw", color: "#080808", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>Rare Sighting</span>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "40vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>1st Record for the Region</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Rare Red<br />Phalarope
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          The Red Phalarope is a pelagic Arctic seabird — it should never appear this far inland. When one showed up at a small reservoir in Dandeli, Karnataka in May 2025, it triggered an immediate response from birders across southern India. This became one of the rarest wildlife encounters in the portfolio.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "A bird from the Arctic, spinning on a pond in the Western Ghats. Nature writes strange poems."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "2.5vw" }}>
          {[["Phalaropus fulicarius", "Species"], ["Arctic Seabird", "Vagrant Record"], ["May 2025", "Dandeli KA"]].map(([v, l]) => (
            <div key={l} style={{ paddingTop: "1.2vh", borderTop: "1px solid #D8D5CF" }}>
              <div style={{ fontSize: "0.9vw", fontWeight: 700, color: "#0D0D0D", fontStyle: v.includes("fulicarius") ? "italic" : "normal" }}>{v}</div>
              <div style={{ fontSize: "0.72vw", color: "#999890", marginTop: "0.3vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
