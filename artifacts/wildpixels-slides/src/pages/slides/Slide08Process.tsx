export default function Slide08Process() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "8vh", left: "7vw" }}>
        <div style={{ fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace", marginBottom: "1.5vh" }}>
          How I Work
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.1 }}>
          From Idea to Image
        </h2>
      </div>

      <div style={{ position: "absolute", top: "28vh", left: "7vw", right: "7vw", display: "flex", gap: "2vw", height: "52vh" }}>
        <div style={{ flex: 1, backgroundColor: "#161616", padding: "3vh 2.5vw", display: "flex", flexDirection: "column", borderTop: "2px solid #C4862A" }}>
          <div style={{ fontSize: "4vw", fontWeight: 700, color: "#C4862A", fontFamily: "'Playfair Display', serif", marginBottom: "2vh" }}>01</div>
          <div style={{ fontSize: "1.6vw", fontWeight: 600, color: "#F5F3EF", marginBottom: "1.5vh" }}>Research</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 300, color: "#888880", lineHeight: 1.6 }}>Months of study: animal behavior, seasonal patterns, terrain, light conditions. Every expedition begins in a library.</div>
        </div>

        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: "3vh 2.5vw", display: "flex", flexDirection: "column", borderTop: "2px solid #333" }}>
          <div style={{ fontSize: "4vw", fontWeight: 700, color: "#333", fontFamily: "'Playfair Display', serif", marginBottom: "2vh" }}>02</div>
          <div style={{ fontSize: "1.6vw", fontWeight: 600, color: "#F5F3EF", marginBottom: "1.5vh" }}>Journey</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 300, color: "#888880", lineHeight: 1.6 }}>Remote locations requiring overland travel, boats, horses, or trekking. Often weeks to reach the frame.</div>
        </div>

        <div style={{ flex: 1, backgroundColor: "#161616", padding: "3vh 2.5vw", display: "flex", flexDirection: "column", borderTop: "2px solid #333" }}>
          <div style={{ fontSize: "4vw", fontWeight: 700, color: "#333", fontFamily: "'Playfair Display', serif", marginBottom: "2vh" }}>03</div>
          <div style={{ fontSize: "1.6vw", fontWeight: 600, color: "#F5F3EF", marginBottom: "1.5vh" }}>Patience</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 300, color: "#888880", lineHeight: 1.6 }}>Hours become days. Days become weeks. The camera waits with you until the moment is real.</div>
        </div>

        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: "3vh 2.5vw", display: "flex", flexDirection: "column", borderTop: "2px solid #333" }}>
          <div style={{ fontSize: "4vw", fontWeight: 700, color: "#333", fontFamily: "'Playfair Display', serif", marginBottom: "2vh" }}>04</div>
          <div style={{ fontSize: "1.6vw", fontWeight: 600, color: "#F5F3EF", marginBottom: "1.5vh" }}>The Frame</div>
          <div style={{ fontSize: "1.2vw", fontWeight: 300, color: "#888880", lineHeight: 1.6 }}>One decisive instant. A single image that carries the weight of everything that came before it.</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", left: "7vw", fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace" }}>wildpixels.co</div>
      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>08</div>
    </div>
  );
}
