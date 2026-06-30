export default function Slide04Ranthambore() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", left: "7vw", fontSize: "0.8vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Rajasthan, India · March 2025
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>04</div>

      <div style={{ position: "absolute", top: "17vh", left: "7vw", maxWidth: "42vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.75vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Tiger Reserve</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Ranthambore<br />Tiger Reserve
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "2.5vh", lineHeight: 1.75 }}>
          India's most famous tiger reserve, where the ruins of a 10th-century fort overlook ancient lakes. Ranthambore's tigers are unusually bold — habituated to jeeps, they hunt in daylight and drink from still water without concealment.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#888880", marginTop: "1.5vh", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
          "The tigress came around the bend at full stride, close enough to see the dust on her whiskers."
        </p>
        <div style={{ marginTop: "3vh", display: "flex", gap: "0.8vw" }}>
          {["Tigers", "Leopards", "Sambar Deer", "Crocodiles"].map(tag => (
            <span key={tag} style={{ fontSize: "0.75vw", padding: "0.5vh 1.2vw", border: "1px solid #D0CDB8", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", top: "12vh", right: "5vw", width: "44vw", height: "75vh", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczNc90PnW814or1sQJzJ0fXACA_fqdHaO3Tb64O4TLVG0mByPfz_tTS5NmHw3utivxkZzlAOWWHiGuKiv6jBxhJJlVgUsKTeKrz7bq2YF0jiRCKccTTf=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Ranthambore Tiger Reserve"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(245,243,239,0.15) 100%)" }} />
      </div>
    </div>
  );
}
