export default function Slide05Gir() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src="https://lh3.googleusercontent.com/pw/AP1GczNQ9ks-6HGPZ0BuZZQX1b1GU6jqcSgn9pV68nmaj4Hh_0f92AuHOWDJ029glkcMGHphAXEJBJJweBpSLtRsiuTVIZ8hF7R3H9es3kan_hbNE-p3Hgfk=w1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
        alt="Gir Asiatic Lions"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.88) 32%, rgba(10,10,10,0.1) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.35) 0%, transparent 50%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Gujarat, India · January 2025</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>05</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "48vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.8vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Gir:<br />Land of<br />Asiatic Lions
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          The last wild population of Asiatic lions on Earth — fewer than 700 individuals surviving in this single Gujarat forest. Gir's lions are distinct from their African cousins: smaller, with a distinctive belly fold, and unafraid of the dry teak woodland that shelters them.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#C4862A", marginTop: "2vh", fontFamily: "'Playfair Display', serif" }}>
          "A male lion, mid-yawn in the golden hour — 300mm, f/4, 1/800s."
        </p>
        <div style={{ marginTop: "3.5vh", display: "flex", gap: "2vw" }}>
          {[["&lt;700", "Lions Remain"], ["Gir Forest", "Gujarat"], ["Jan 2025", "Season"]].map(([v, l]) => (
            <div key={l} style={{ borderLeft: "2px solid #C4862A", paddingLeft: "1.2vw" }}>
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#F5F3EF" }} dangerouslySetInnerHTML={{ __html: v }} />
              <div style={{ fontSize: "0.75vw", color: "#666560", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.4vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
