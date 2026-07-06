export default function Slide02Origin() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}photographer-dawn.png`}
        style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", objectFit: "cover", opacity: 0.85 }}
        alt="Photographer silhouette on a jungle trail at dawn"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,13,13,1) 42%, rgba(13,13,13,0.15) 62%, rgba(13,13,13,0.05) 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "38vw" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.08 }}>
          Two Years.
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#C4862A", margin: 0, lineHeight: 1.08 }}>
          One Obsession.
        </h1>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh 0" }} />
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#C9C6C0", lineHeight: 1.7, maxWidth: "34vw" }}>
          Vadiraj has spent two years chasing India's wildlife across its forests, grasslands, and wetlands — before dawn, every time.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>02 / 13</div>
    </div>
  );
}
