export default function Slide08JimCorbett() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Corbett National Park, UP · March 2025
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>09</div>

      <div style={{ position: "absolute", top: 0, left: 0, width: "48vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczNOhoYanEyXCmx1DdewlfPb2fJ9gqMuS6qjNblzlFuENEd1DuW8nCjimYFcigJmHgTL_nkYRP70LW0flTpfjOCg5Yx3LOBPUKTJ_QWhuDxxKpNst2Ox=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Jim Corbett National Park"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(245,243,239,0.95) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, transparent 60%, rgba(245,243,239,0.4) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", right: "6vw", transform: "translateY(-50%)", maxWidth: "42vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>India's Oldest National Park</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Jim Corbett<br />National Park
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          Established in 1936 as India's first national park, Corbett is dense, moody and alive with sound. The Ramganga River cuts through the sal forests; elephants cross in the mist; leopards descend from the ridges at dusk. Every drive feels like the jungle is barely tolerating your presence.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "A large male leopard descended from a granite outcrop and walked directly toward us — twenty meters — before vanishing."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "0.8vw", flexWrap: "wrap" }}>
          {["Tigers", "Leopards", "Elephants", "Gharial", "River Otters"].map(tag => (
            <span key={tag} style={{ fontSize: "0.7vw", padding: "0.5vh 1vw", border: "1px solid #D0CDB8", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
