export default function Slide13Launch() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}tiger-eye.png`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
        alt="Tiger's eye"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.96) 0%, rgba(30,20,8,0.45) 50%, rgba(13,13,13,0.3) 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Now Live
        </span>
      </div>

      <div style={{ position: "absolute", bottom: "14vh", left: "7vw", maxWidth: "70vw" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "6.5vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          Wildpixels
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "6.5vw", fontWeight: 900, color: "#C4862A", margin: 0, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          Is Live
        </h1>
        <div style={{ width: "5vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh 0" }} />
        <p style={{ fontSize: "1.5vw", fontWeight: 300, color: "#C9C6C0", lineHeight: 1.6, maxWidth: "42vw" }}>
          Eighteen places. Two years. One photographer. See it all now.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#8A8A82", fontFamily: "'DM Mono', monospace" }}>13 / 13</div>
    </div>
  );
}
