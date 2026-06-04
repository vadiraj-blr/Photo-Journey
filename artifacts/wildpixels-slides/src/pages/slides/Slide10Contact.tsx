export default function Slide10Contact() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80"
        crossOrigin="anonymous"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
        alt="Contact background"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,13,13,0.95) 40%, rgba(13,13,13,0.6) 100%)" }} />

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "70vw" }}>
        <div style={{ fontSize: "1vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace", marginBottom: "3vh" }}>
          Get in Touch
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5.5vw", fontWeight: 900, color: "#F5F3EF", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>
          Let's Work Together
        </h2>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh auto" }} />
        <p style={{ fontSize: "1.6vw", fontWeight: 300, color: "#B0ADA8", lineHeight: 1.6, maxWidth: "50vw", margin: "0 auto" }}>
          Available for editorial assignments, conservation projects, and limited fine-art print commissions.
        </p>

        <div style={{ marginTop: "5vh", display: "flex", justifyContent: "center", gap: "5vw" }}>
          <div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8vh" }}>Website</div>
            <div style={{ fontSize: "1.4vw", color: "#F5F3EF", fontFamily: "'DM Mono', monospace" }}>wildpixels.co</div>
          </div>
          <div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8vh" }}>Based in</div>
            <div style={{ fontSize: "1.4vw", color: "#F5F3EF", fontFamily: "'DM Mono', monospace" }}>India</div>
          </div>
          <div>
            <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8vh" }}>Photographer</div>
            <div style={{ fontSize: "1.4vw", color: "#F5F3EF", fontFamily: "'DM Mono', monospace" }}>Vadiraj</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", left: "7vw", fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace" }}>wildpixels.co — Vadiraj</div>
      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>10</div>
    </div>
  );
}
