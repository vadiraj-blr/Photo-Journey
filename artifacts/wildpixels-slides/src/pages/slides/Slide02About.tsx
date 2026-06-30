export default function Slide02About() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "40vw", height: "100%", overflow: "hidden", backgroundColor: "#0A0A0A" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOuhNFdUODfz4zADEoGPpnoCr6RQW2Z3PchNFm8wXW0sxrMPAK0livXZa5igzcLufamu3tzlOpn7W4niQaCn1xQYD3zYtXljPpHQJln5WjtPbdi3Y3X=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
          alt="Himalayan birds expedition"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(245,243,239,0.08) 100%)" }} />
        <div style={{ position: "absolute", bottom: "5vh", left: "4vw" }}>
          <div style={{ fontSize: "2vw", fontWeight: 700, color: "#F5F3EF", fontFamily: "'Playfair Display', serif" }}>Vadiraj</div>
          <div style={{ fontSize: "0.85vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", marginTop: "0.6vh", letterSpacing: "0.12em", textTransform: "uppercase" }}>Wildlife & Landscape Photographer · India</div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.85vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>
        Wildpixels — The Photographer
      </div>

      <div style={{ position: "absolute", top: "50%", left: "46vw", transform: "translateY(-50%)", maxWidth: "46vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2vw", marginBottom: "3vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Behind the Lens</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Chasing Light<br />and Wild Things
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          I am a wildlife and landscape photographer based in India — spending months each year in national parks and remote forests across the subcontinent.
        </p>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          Each expedition is an act of patience: waiting for the moment that cannot be planned, only witnessed. The wild doesn't perform on schedule.
        </p>
        <div style={{ marginTop: "4.5vh", display: "flex", gap: "3.5vw" }}>
          {[["18", "Places Visited"], ["1195", "Photos Taken"], ["15+", "Expeditions"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: "3vw", fontWeight: 800, color: "#0D0D0D", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: "0.8vw", color: "#999890", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.7vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>02</div>
    </div>
  );
}
