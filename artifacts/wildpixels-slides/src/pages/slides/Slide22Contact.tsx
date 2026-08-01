export default function Slide22Contact() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src="https://lh3.googleusercontent.com/pw/AP1GczOLYowST2soOmh0YEsQDumlHVMFDhptWzlTe6lh27y0qPqHBQLv9m20KyjSEq7JXlWbT_LR4z1PV7141BUce5ZEIVNruopYacYT7NOMGmnaxE3t6I-U=w1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
        alt="Kaziranga landscape"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,8,0.98) 50%, rgba(8,8,8,0.55) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 25% 50%, rgba(196,134,42,0.05) 0%, transparent 60%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1vw" }}>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Wildpixels · Vadiraj</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#2A2A28", fontFamily: "'DM Mono', monospace" }}>22</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "55vw" }}>
        <div style={{ width: "4vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "3vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5.5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Let's Work<br />
          <span style={{ color: "#C4862A" }}>Together</span>
        </h2>
        <p style={{ fontSize: "1.4vw", fontWeight: 300, color: "#8A8880", marginTop: "3vh", lineHeight: 1.75, maxWidth: "44vw" }}>
          Available for editorial assignments with wildlife organisations, conservation publications, and natural history media. Fine-art prints available for select images. Open to long-form documentary expeditions.
        </p>
        <div style={{ marginTop: "4.5vh", display: "flex", gap: "2.5vw", flexWrap: "wrap" }}>
          {[
            { label: "Editorial", desc: "Wildlife & conservation media" },
            { label: "Fine Art Prints", desc: "Limited edition, archival" },
            { label: "Expeditions", desc: "Documentary photography" },
          ].map(({ label, desc }) => (
            <div key={label} style={{ borderTop: "1px solid #2A2A28", paddingTop: "1.5vh", minWidth: "14vw" }}>
              <div style={{ fontSize: "1vw", fontWeight: 600, color: "#F5F3EF" }}>{label}</div>
              <div style={{ fontSize: "0.8vw", color: "#555550", marginTop: "0.5vh" }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "4.5vh", display: "flex", alignItems: "center", gap: "3vw" }}>
          <div style={{ backgroundColor: "#C4862A", padding: "1.5vh 2.5vw" }}>
            <span style={{ fontSize: "0.9vw", fontWeight: 600, color: "#080808", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>thewildpixels.com</span>
          </div>
          <div style={{ fontSize: "0.85vw", color: "#555550", fontFamily: "'DM Mono', monospace" }}>India's Wild Heart · Documented</div>
        </div>
        <div style={{ marginTop: "3vh", display: "flex", alignItems: "center", gap: "3vw" }}>
          {[
            { icon: "📷", handle: "@vadiraj.bk", platform: "Instagram" },
            { icon: "✉", handle: "vadiraj.bk@gmail.com", platform: "Email" },
            { icon: "f", handle: "vadiraj.bk", platform: "Facebook" },
          ].map(({ icon, handle, platform }) => (
            <div key={platform} style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
              <div style={{ width: "2.2vw", height: "2.2vw", border: "1px solid #333330", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", fontWeight: 700, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: "0.85vw", color: "#F5F3EF", fontFamily: "'DM Mono', monospace" }}>{handle}</div>
                <div style={{ fontSize: "0.65vw", color: "#444440", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2vh" }}>{platform}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
