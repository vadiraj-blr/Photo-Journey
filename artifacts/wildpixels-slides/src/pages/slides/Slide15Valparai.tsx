export default function Slide15Valparai() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Valparai, Tamil Nadu · February 2025
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>15</div>

      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOHpQph1tR3ceR9aUHwbhs0ZxkTNQmm8HSWd6ntK5aoBeqyJwqeISv_yZmcrMIV58izw1Lm8OgGtgksyShQSY54a0NjQqEndSF9i0KA8e76SL11lCQU=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "37.9% 0.0%" }}
          alt="Valparai lion-tailed macaque"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 55%, rgba(245,243,239,0.92) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "40vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2.5vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Shola Forest & Tea Estates</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Valparai:<br />Tea & Macaques
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          Lion-tailed macaques are among the world's most endangered primates — found only in the Western Ghats of southern India. At Valparai, they navigate a patchwork of ancient shola forest and tea estate, their silver manes catching the morning mist that rolls in from the Anaimalai hills.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "A troop of fifteen, moving through the tea rows like silent dark-maned kings."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "2.5vw" }}>
          {[["3,000", "LTM Remain Globally"], ["Western Ghats", "Endemic Species"], ["Shola Forest", "Ancient Habitat"]].map(([v, l]) => (
            <div key={l} style={{ paddingTop: "1.2vh", borderTop: "1px solid #D8D5CF" }}>
              <div style={{ fontSize: "1vw", fontWeight: 700, color: "#0D0D0D" }}>{v}</div>
              <div style={{ fontSize: "0.72vw", color: "#999890", marginTop: "0.3vh", lineHeight: 1.3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
