export default function Slide11Pilhibit() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Pilibhit, Uttar Pradesh · November 2025
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>11</div>

      <div style={{ position: "absolute", top: 0, right: 0, width: "50vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOHFj9u4xKOfVZXe47DFjUR-fL7rvIxex-SLz9NLYLBoQrZvUH_RsNmZ5JscUGwgijztIhpsxJFqBYJrwTkyIsoSa2AqXoglKQyuiVXomrxYJYFL0Wp=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Pilibhit Tiger Reserve"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 55%, rgba(245,243,239,0.92) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "42vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>The Terai Corridor</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Pilibhit<br />Tiger Reserve
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          Pilibhit is the lesser-known gem of India's tiger country — a terai forest that borders Nepal, dense with elephant grass and sal trees. Its tigers are elusive, its birdlife spectacular, and its silence total. Few tourists come here; the wildlife moves without performance.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "The grassland stretched flat to the Himalayan foothills — a tiger landscape unchanged for centuries."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "0.8vw", flexWrap: "wrap" }}>
          {["Tigers", "Swamp Deer", "Fishing Cat", "Elephant", "Terai Birds"].map(tag => (
            <span key={tag} style={{ fontSize: "0.7vw", padding: "0.5vh 1vw", border: "1px solid #D0CDB8", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
