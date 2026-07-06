export default function Slide03Scale() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}landscape-wide.png`}
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "58%", objectFit: "cover", opacity: 0.75 }}
        alt="Wide landscape of an Indian wildlife reserve"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,13,13,1) 0%, rgba(13,13,13,0.55) 42%, rgba(13,13,13,0.15) 62%, rgba(13,13,13,0.55) 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", top: "24vh", left: "7vw" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "8vw", fontWeight: 900, color: "#C4862A", lineHeight: 0.9 }}>18</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6vw", fontWeight: 700, color: "#F5F3EF", margin: "1vh 0 0", lineHeight: 1.15 }}>
          Places. Countless Mornings.
        </h1>
        <p style={{ fontSize: "1.2vw", fontWeight: 300, color: "#C9C6C0", lineHeight: 1.6, maxWidth: "36vw", marginTop: "2vh" }}>
          From Ranthambore's tiger trails to Bharatpur's wetlands — eighteen places, one story each.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>03 / 13</div>
    </div>
  );
}
