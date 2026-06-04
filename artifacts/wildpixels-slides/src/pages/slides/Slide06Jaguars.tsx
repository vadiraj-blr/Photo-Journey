export default function Slide06Jaguars() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "50vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1512237798647-84b57b22b517?w=1000&q=85"
          crossOrigin="anonymous"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Jaguar Pantanal"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,1) 0%, transparent 30%)" }} />
      </div>

      <div style={{ position: "absolute", top: "8vh", left: "7vw", fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
        Brazil — August 2024
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "44vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 1.05 }}>
          Pantanal Jaguars
        </h2>
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#B0ADA8", marginTop: "2.5vh", lineHeight: 1.7 }}>
          Six days on a boat on the Cuiabá River. Fifteen individual jaguars encountered — including a mother teaching her cubs to hunt caiman. The Pantanal is the greatest wildlife show on Earth.
        </p>
        <div style={{ marginTop: "4vh", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vh 3vw" }}>
          <div>
            <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#C4862A", fontFamily: "'Playfair Display', serif" }}>15</div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.08em" }}>Individuals spotted</div>
          </div>
          <div>
            <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#C4862A", fontFamily: "'Playfair Display', serif" }}>6</div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.08em" }}>Days on the river</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>06</div>
    </div>
  );
}
