export default function Slide12Kabini() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczMaUtfe0CJKYmhm681RJshtoRfI4hzcs8nWQY9wKkyewAyEQ9esShUffZl5qRrEVquocwosfRSt6tqus6bv5T_jlJjTpjnccbApExhp5B0cIBpHRZoO=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Kabini jungle"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 50%, rgba(10,10,10,0.97) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "7vh", left: "7vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Kabini, Karnataka · April 2025</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>12</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "44vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Kabini:<br />Into the Jungle
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          The Kabini backwaters sit at the heart of the Nagarhole-Bandipur ecosystem — one of the most biodiverse landscapes in Asia. Wild dog packs, leopards, gaur herds and bonnet macaques move through the ancient teak and rosewood in patterns unchanged for millennia.
        </p>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          At dusk, elephants wade to the island bar — a spectacle that draws silence from every observer on the boat.
        </p>
        <div style={{ marginTop: "3.5vh", display: "flex", gap: "3vw" }}>
          {[["Nagarhole", "National Park"], ["Wild Dogs", "Endangered"], ["April", "Pre-monsoon"]].map(([v, l]) => (
            <div key={l} style={{ borderLeft: "2px solid #2A2A28", paddingLeft: "1.2vw" }}>
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#F5F3EF" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#555550", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.4vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
