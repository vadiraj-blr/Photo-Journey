export default function Slide07GlobalMap() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "8vh", left: "7vw" }}>
        <div style={{ fontSize: "1vw", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888880", fontFamily: "'DM Mono', monospace", marginBottom: "1.5vh" }}>
          Portfolio Overview
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1 }}>
          20 Trips Across the Globe
        </h2>
      </div>

      <div style={{ position: "absolute", top: "26vh", left: "7vw", right: "7vw", display: "flex", flexDirection: "column", gap: "2.5vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "1.5vw", height: "1.5vw", backgroundColor: "#C4862A", flexShrink: 0 }} />
          <div style={{ minWidth: "14vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "#0D0D0D" }}>Africa</div>
            <div style={{ fontSize: "1vw", color: "#888880" }}>5 expeditions</div>
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#D8D4CE" }} />
          <div style={{ fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace", maxWidth: "40vw", textAlign: "right" }}>
            Serengeti · Okavango · Namib · Ethiopia · Sundarbans
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "1.5vw", height: "1.5vw", backgroundColor: "#8B6E42", flexShrink: 0 }} />
          <div style={{ minWidth: "14vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "#0D0D0D" }}>South America</div>
            <div style={{ fontSize: "1vw", color: "#888880" }}>3 expeditions</div>
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#D8D4CE" }} />
          <div style={{ fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace", maxWidth: "40vw", textAlign: "right" }}>
            Patagonia · Pantanal · Amazon
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "1.5vw", height: "1.5vw", backgroundColor: "#6B8B6E", flexShrink: 0 }} />
          <div style={{ minWidth: "14vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "#0D0D0D" }}>Asia</div>
            <div style={{ fontSize: "1vw", color: "#888880" }}>7 expeditions</div>
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#D8D4CE" }} />
          <div style={{ fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace", maxWidth: "40vw", textAlign: "right" }}>
            Ladakh · Borneo · Mongolia · Tibet · Sri Lanka · Kaziranga · Komodo
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "1.5vw", height: "1.5vw", backgroundColor: "#4A6B8B", flexShrink: 0 }} />
          <div style={{ minWidth: "14vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "#0D0D0D" }}>Europe / Arctic</div>
            <div style={{ fontSize: "1vw", color: "#888880" }}>3 expeditions</div>
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#D8D4CE" }} />
          <div style={{ fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace", maxWidth: "40vw", textAlign: "right" }}>
            Svalbard · Iceland · Faroe Islands
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
          <div style={{ width: "1.5vw", height: "1.5vw", backgroundColor: "#8B4A6B", flexShrink: 0 }} />
          <div style={{ minWidth: "14vw" }}>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "#0D0D0D" }}>Americas</div>
            <div style={{ fontSize: "1vw", color: "#888880" }}>2 expeditions</div>
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#D8D4CE" }} />
          <div style={{ fontSize: "1.1vw", color: "#555550", fontFamily: "'DM Mono', monospace", maxWidth: "40vw", textAlign: "right" }}>
            Galápagos · Churchill
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "10vh", left: "7vw", right: "7vw", display: "flex", gap: "4vw" }}>
        <div style={{ borderTop: "2px solid #C4862A", paddingTop: "2vh", flex: 1 }}>
          <div style={{ fontSize: "3.5vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>20</div>
          <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Expeditions</div>
        </div>
        <div style={{ borderTop: "2px solid #0D0D0D", paddingTop: "2vh", flex: 1 }}>
          <div style={{ fontSize: "3.5vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>14</div>
          <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Countries</div>
        </div>
        <div style={{ borderTop: "2px solid #0D0D0D", paddingTop: "2vh", flex: 1 }}>
          <div style={{ fontSize: "3.5vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>4</div>
          <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Continents</div>
        </div>
        <div style={{ borderTop: "2px solid #0D0D0D", paddingTop: "2vh", flex: 1 }}>
          <div style={{ fontSize: "3.5vw", fontWeight: 700, color: "#0D0D0D", fontFamily: "'Playfair Display', serif" }}>150+</div>
          <div style={{ fontSize: "1vw", color: "#888880", textTransform: "uppercase", letterSpacing: "0.1em" }}>Published Photos</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "8vh", right: "7vw", fontSize: "1vw", fontWeight: 500, color: "#888880" }}>07</div>
    </div>
  );
}
