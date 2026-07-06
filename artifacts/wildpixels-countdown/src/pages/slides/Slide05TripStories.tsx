export default function Slide05TripStories() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={`${import.meta.env.BASE_URL}journal-page.png`}
        style={{ position: "absolute", top: 0, left: 0, width: "50vw", height: "100%", objectFit: "cover", opacity: 0.85 }}
        alt="Open field journal with a wildlife photograph"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(13,13,13,1) 42%, rgba(13,13,13,0.15) 62%, rgba(13,13,13,0.05) 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", right: "7vw", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <span style={{ fontSize: "0.85vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          Wildpixels · Coming Soon
        </span>
        <div style={{ width: "2.5vw", height: "1px", backgroundColor: "#C4862A" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", right: "7vw", transform: "translateY(-50%)", maxWidth: "38vw", textAlign: "right" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.6vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.1 }}>
          Every Trip Gets
        </h1>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.6vw", fontWeight: 700, color: "#C4862A", margin: 0, lineHeight: 1.1 }}>
          Its Story
        </h1>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh 0 3vh auto" }} />
        <p style={{ fontSize: "1.25vw", fontWeight: 300, color: "#C9C6C0", lineHeight: 1.7, maxWidth: "34vw", marginLeft: "auto" }}>
          Not just galleries — full field reports from each expedition, in Vadiraj's own words.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", left: "7vw", fontSize: "0.9vw", color: "#5A5A55", fontFamily: "'DM Mono', monospace" }}>05 / 13</div>
    </div>
  );
}
