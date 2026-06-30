export default function Slide17Hampi() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Hampi, Karnataka · June 2025
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>17</div>

      <div style={{ position: "absolute", top: 0, left: 0, width: "50vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczNECGG4Q0F4JWxDOeZdjWFP_gwG5W61Y9fJWf_gWL9sp9DGcXhVRM-jh_BYp1IJxmofPfC05FqJ3cK09jW3NtaBM4gx3o4FUbBe_EZxhg7G6tRcFdp3=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Bears of Daroji, Hampi"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 58%, rgba(245,243,239,0.95) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", right: "6vw", transform: "translateY(-50%)", maxWidth: "42vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Daroji Bear Sanctuary</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Hampi &<br />Bears of Daroji
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          The boulder-strewn landscape of Hampi — ancient capital of the Vijayanagara Empire — shelters India's most accessible population of sloth bears. At Daroji sanctuary, bears emerge at dusk to feed on honey combs between the granite outcrops, silhouetted against a rust-coloured sky.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "History and wildlife in a single frame — the ruins watching, the bear oblivious."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "2.5vw" }}>
          {[["Sloth Bears", "Focal Species"], ["Boulder Scrub", "Habitat"], ["Ruins", "Vijayanagara"]].map(([v, l]) => (
            <div key={l} style={{ paddingTop: "1.2vh", borderTop: "1px solid #D8D5CF" }}>
              <div style={{ fontSize: "1vw", fontWeight: 700, color: "#0D0D0D" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#999890", marginTop: "0.3vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
