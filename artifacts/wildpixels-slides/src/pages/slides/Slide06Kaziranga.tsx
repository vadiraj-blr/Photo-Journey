export default function Slide06Kaziranga() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Assam, India · December 2024
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>06</div>

      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOLYowST2soOmh0YEsQDumlHVMFDhptWzlTe6lh27y0qPqHBQLv9m20KyjSEq7JXlWbT_LR4z1PV7141BUce5ZEIVNruopYacYT7NOMGmnaxE3t6I-U=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Kaziranga one-horned rhino"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 55%, rgba(245,243,239,0.9) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "42vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>UNESCO World Heritage</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Kaziranga:<br />One-Horned Fortress
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          Kaziranga holds the world's largest concentration of one-horned rhinoceros — over 2600 individuals in a single stretch of floodplain. The park floods each monsoon, concentrating all wildlife onto narrow high ground. In December, the grass is short and visibility is perfect.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif" }}>
          "A rhino mother and calf, ten meters away, photographed from elephant-back at dawn."
        </p>
        <div style={{ marginTop: "3vh", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2vw 2vw" }}>
          {[["2,600+", "One-horned rhinos"], ["Tigers", "Highest density in India"], ["Elephants", "Wild herds"], ["Dec 2024", "Winter expedition"]].map(([v, l]) => (
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
