export default function Slide13Bharatpur() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Bharatpur, Rajasthan · February 2026
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>13</div>

      <div style={{ position: "absolute", top: 0, left: 0, width: "50vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczNOhoYanEyXCmx1DdewlfPb2fJ9gqMuS6qjNblzlFuENEd1DuW8nCjimYFcigJmHgTL_nkYRP70LW0flTpfjOCg5Yx3LOBPUKTJ_QWhuDxxKpNst2Ox=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "28.9% 0.0%" }}
          alt="Bharatpur bird sanctuary"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(245,243,239,0.95) 100%)" }} />
        <div style={{ position: "absolute", bottom: "6vh", left: "4vw", zIndex: 2 }}>
          <div style={{ backgroundColor: "rgba(10,10,10,0.7)", display: "inline-block", padding: "1vh 1.5vw" }}>
            <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>UNESCO World Heritage Site</span>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: "50%", right: "6vw", transform: "translateY(-50%)", maxWidth: "42vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Keoladeo National Park</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Bharatpur:<br />A Birder's World
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          Keoladeo National Park in Bharatpur is one of the world's most important bird sanctuaries — a man-made wetland that hosts 370 species, including rare wintering migrants from Central Asia and Siberia. The animals here show no fear; you cycle among them on unmarked paths.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "Painted storks nesting overhead, sambar wading beneath — a living diorama."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "2.5vw" }}>
          {[["370+", "Bird Species"], ["Feb 2026", "Peak Winter"], ["Cycling", "Safari Mode"]].map(([v, l]) => (
            <div key={l} style={{ paddingTop: "1.2vh", borderTop: "1px solid #D8D5CF" }}>
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#0D0D0D" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#999890", marginTop: "0.3vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
