export default function Slide03Featured() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "8vh", left: "7vw" }}>
        <div style={{ fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace", marginBottom: "1.5vh" }}>
          Selected Expeditions
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.1 }}>
          Five Defining Journeys
        </h2>
      </div>

      <div style={{ position: "absolute", top: "26vh", left: "7vw", right: "7vw", display: "flex", gap: "1.5vw", height: "60vh" }}>
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Serengeti Migration" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: "3vh", left: "1.5vw", right: "1.5vw" }}>
            <div style={{ fontSize: "1.3vw", fontWeight: 600, color: "#F5F3EF", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: "0.8vh" }}>Serengeti Migration</div>
            <div style={{ fontSize: "0.9vw", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>Tanzania — Feb 2024</div>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Patagonia Ice Fields" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: "3vh", left: "1.5vw", right: "1.5vw" }}>
            <div style={{ fontSize: "1.3vw", fontWeight: 600, color: "#F5F3EF", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: "0.8vh" }}>Patagonia Ice Fields</div>
            <div style={{ fontSize: "0.9vw", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>Chile — Nov 2022</div>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1512237798647-84b57b22b517?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Pantanal Jaguars" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: "3vh", left: "1.5vw", right: "1.5vw" }}>
            <div style={{ fontSize: "1.3vw", fontWeight: 600, color: "#F5F3EF", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: "0.8vh" }}>Pantanal Jaguars</div>
            <div style={{ fontSize: "0.9vw", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>Brazil — Aug 2024</div>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1520481612-80e09eea5c14?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Arctic Svalbard" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: "3vh", left: "1.5vw", right: "1.5vw" }}>
            <div style={{ fontSize: "1.3vw", fontWeight: 600, color: "#F5F3EF", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: "0.8vh" }}>Arctic Svalbard</div>
            <div style={{ fontSize: "0.9vw", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>Norway — Mar 2024</div>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Galapagos Islands" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: "3vh", left: "1.5vw", right: "1.5vw" }}>
            <div style={{ fontSize: "1.3vw", fontWeight: 600, color: "#F5F3EF", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: "0.8vh" }}>Galápagos Islands</div>
            <div style={{ fontSize: "0.9vw", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>Ecuador — Sep 2022</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", left: "7vw", fontSize: "1.1vw", color: "#888880", fontFamily: "'DM Mono', monospace" }}>wildpixels.co</div>
      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>03</div>
    </div>
  );
}
