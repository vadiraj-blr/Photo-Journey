export default function Slide01Cover() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src="https://lh3.googleusercontent.com/pw/AP1GczNc90PnW814or1sQJzJ0fXACA_fqdHaO3Tb64O4TLVG0mByPfz_tRS5NmHw3utivxkZzlAOWWHiGuKiv6jBxhJJlVgUsKTeKrz7bq2YF0jiRCKccTTf=w1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        alt="Ranthambore tiger country"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,8,8,0.95) 38%, rgba(8,8,8,0.25) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Vadiraj · Wildlife & Landscape Photography
        </span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "52vw" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "9.5vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 0.92, letterSpacing: "-0.03em" }}>
          WILD
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "9.5vw", fontWeight: 900, color: "#C4862A", margin: 0, lineHeight: 0.92, letterSpacing: "-0.03em" }}>
          PIXELS
        </h1>
        <div style={{ width: "5vw", height: "2px", backgroundColor: "#C4862A", margin: "3.5vh 0" }} />
        <p style={{ fontSize: "1.6vw", fontWeight: 300, color: "#A8A5A0", lineHeight: 1.6, maxWidth: "38vw" }}>
          India's wild heart — from Himalayan foothills to coastal shores, through tiger reserves, lion sanctuaries and ancient forests.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", left: "7vw", display: "flex", gap: "4vw" }}>
        {[["18", "Places"], ["1195", "Photos"], ["15+", "Expeditions"]].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontSize: "2.4vw", fontWeight: 700, color: "#F5F3EF", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: "0.8vw", color: "#666560", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "0.5vh" }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#444440", fontFamily: "'DM Mono', monospace" }}>01</div>
    </div>
  );
}
