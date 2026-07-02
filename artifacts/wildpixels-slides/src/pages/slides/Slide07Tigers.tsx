export default function Slide07Tigers() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="F2 tigress and cubs"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 50%, rgba(10,10,10,0.97) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "7vh", left: "7vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Gothangaon, Maharashtra · June 2025</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>07</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "44vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          F2 and<br />Her Cubs
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          F2 is one of Tadoba's most celebrated tigresses — a seasoned hunter operating deep in the teak forests of Gothangaon. In June 2025, she was raising four cubs, teaching them to stalk through the bamboo thickets beside the Irai River.
        </p>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          To witness a tigress coaching her young — to see intelligence and tenderness in an apex predator — is to understand why wild places must be protected.
        </p>
        <div style={{ marginTop: "3.5vh", display: "flex", gap: "3vw" }}>
          {[["Tadoba", "Tiger Reserve"], ["Teak Forest", "Habitat"], ["4 Cubs", "Observed"]].map(([v, l]) => (
            <div key={l} style={{ borderLeft: "2px solid #333330", paddingLeft: "1.2vw" }}>
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#F5F3EF" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#555550", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.4vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
