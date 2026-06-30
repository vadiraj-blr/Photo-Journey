export default function Slide03Philosophy() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "45vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
          alt="Tiger in the wild"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0A0A0A 0%, transparent 40%)" }} />
      </div>

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1vw" }}>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Philosophy</span>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "50vw" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          The wild does<br />
          <span style={{ color: "#C4862A" }}>not pause</span><br />
          for the photographer.
        </p>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", margin: "4vh 0" }} />
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#8A8880", lineHeight: 1.75, maxWidth: "42vw" }}>
          Wildlife photography is an exercise in absolute surrender. You cannot command the tiger, negotiate with the light, or schedule the moment. You can only be present, be still, and be ready when the world decides to show you something real.
        </p>
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#8A8880", lineHeight: 1.75, maxWidth: "42vw", marginTop: "2vh" }}>
          Every frame in this portfolio is a gift — earned through patience, not taken through force.
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>03</div>
    </div>
  );
}
