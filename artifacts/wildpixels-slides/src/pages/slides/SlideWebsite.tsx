export default function SlideWebsite() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Right-side photo panel */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "46vw", height: "100%" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczM5HrAcXjJIwb51-KLSVcUPfGVmYvlwPy42A6sSOixp4EKZuhpxP6sF-gLQCxsAGOypciFlvE361MufVWiklg5KEa6S4Zxv89ApG8GAHBjbW-2q71kw=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }}
          alt="Jim Corbett tiger"
        />
        {/* Fade into dark background on the left */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 30%, transparent 65%)" }} />
        {/* Bottom vignette */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 40%)" }} />

        {/* Browser address bar mockup — floating card */}
        <div style={{
          position: "absolute",
          top: "8vh",
          right: "5vw",
          background: "rgba(12,12,10,0.88)",
          border: "1px solid rgba(196,134,42,0.25)",
          borderRadius: "6px",
          padding: "1vh 1.4vw",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          gap: "1vw",
        }}>
          <div style={{ display: "flex", gap: "0.4vw" }}>
            {["#6A2020", "#6A5A20", "#206A30"].map((c) => (
              <div key={c} style={{ width: "0.55vw", height: "0.55vw", borderRadius: "50%", backgroundColor: c }} />
            ))}
          </div>
          <div style={{ width: "1px", height: "1.4vh", backgroundColor: "rgba(196,134,42,0.2)" }} />
          <span style={{ fontSize: "0.7vw", color: "#888880", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>wildpixels.co</span>
        </div>

        {/* Floating section tags */}
        <div style={{ position: "absolute", bottom: "18vh", right: "4vw", display: "flex", flexDirection: "column", gap: "1.2vh", alignItems: "flex-end" }}>
          {["Portfolio", "Field Notes", "Fine Art Prints"].map((label) => (
            <div key={label} style={{
              background: "rgba(12,12,10,0.82)",
              border: "1px solid rgba(196,134,42,0.18)",
              borderRadius: "3px",
              padding: "0.6vh 1.2vw",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ fontSize: "0.65vw", color: "#888880", fontFamily: "'DM Mono', monospace", letterSpacing: "0.18em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide number */}
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#1E1E1C", fontFamily: "'DM Mono', monospace", zIndex: 2 }}>21</div>

      {/* Left content */}
      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", width: "48vw" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "3vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.72vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase" }}>Portfolio Website</span>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5.5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
          wildpixels.co
        </h2>

        <p style={{ fontSize: "1.25vw", fontWeight: 300, color: "#7A7870", marginTop: "2.5vh", lineHeight: 1.75, maxWidth: "38vw" }}>
          The complete archive of India's wild — two decades of expeditions, captured and curated in one place.
        </p>

        <div style={{ marginTop: "4vh", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.8vh 4vw", maxWidth: "44vw" }}>
          {[
            { label: "Full Portfolio", desc: "22+ expeditions across India's national parks" },
            { label: "Fine Art Prints", desc: "Limited-edition archival prints — signed, numbered" },
            { label: "Field Notes", desc: "Expedition diaries, sighting reports from the field" },
            { label: "Commissions", desc: "Editorial, conservation media & documentary work" },
          ].map(({ label, desc }) => (
            <div key={label} style={{ paddingTop: "1.5vh", borderTop: "1px solid #1E1E1C" }}>
              <div style={{ fontSize: "0.9vw", fontWeight: 600, color: "#D8D5CF", marginBottom: "0.6vh" }}>{label}</div>
              <div style={{ fontSize: "0.78vw", fontWeight: 300, color: "#555550", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "5vh", display: "inline-flex", alignItems: "stretch", border: "1px solid rgba(196,134,42,0.35)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ backgroundColor: "#C4862A", padding: "1.4vh 2.2vw", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "0.8vw", fontWeight: 700, color: "#080808", fontFamily: "'DM Mono', monospace", letterSpacing: "0.18em", textTransform: "uppercase" }}>Visit</span>
          </div>
          <div style={{ padding: "1.4vh 2.2vw", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "0.82vw", color: "#888880", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>wildpixels.co</span>
          </div>
        </div>

      </div>
    </div>
  );
}
