type WordEntry = { name: string; size: number; color: string; top: string; left: string; rotate?: string; opacity?: number };

const LOCATIONS: WordEntry[] = [
  { name: "Ranthambore",        size: 4.2,  color: "#C4862A", top: "22%",  left: "6%",   rotate: "-1deg" },
  { name: "Kaziranga",          size: 3.6,  color: "#F5F3EF", top: "14%",  left: "46%",  rotate: "1deg"  },
  { name: "Kabini",             size: 3.4,  color: "#C4862A", top: "55%",  left: "58%",  rotate: "-1deg" },
  { name: "Gir",                size: 3.2,  color: "#F5F3EF", top: "44%",  left: "8%",   rotate: "0deg"  },
  { name: "Tadoba",             size: 2.8,  color: "#C4862A", top: "64%",  left: "26%",  rotate: "1deg"  },
  { name: "Jim Corbett",        size: 2.6,  color: "#F5F3EF", top: "34%",  left: "34%",  rotate: "-2deg" },
  { name: "Bharatpur",          size: 2.4,  color: "#9A9890", top: "70%",  left: "50%",  rotate: "1deg"  },
  { name: "Valparai",           size: 2.2,  color: "#C4862A", top: "29%",  left: "72%",  rotate: "-1deg" },
  { name: "Kuno",               size: 2.0,  color: "#F5F3EF", top: "19%",  left: "74%",  rotate: "2deg"  },
  { name: "Pilibhit",           size: 1.7,  color: "#9A9890", top: "50%",  left: "76%",  rotate: "-1deg" },
  { name: "Hampi",              size: 1.7,  color: "#C4862A", top: "76%",  left: "12%",  rotate: "1deg"  },
  { name: "Tal Chapar",         size: 1.5,  color: "#666560", top: "58%",  left: "42%",  rotate: "-2deg" },
  { name: "Bandhavgarh",        size: 1.5,  color: "#9A9890", top: "12%",  left: "26%",  rotate: "1deg"  },
  { name: "Rameshwaram",        size: 1.4,  color: "#666560", top: "82%",  left: "38%",  rotate: "-1deg" },
  { name: "Himalayan Foothills",size: 1.3,  color: "#555550", top: "78%",  left: "63%",  rotate: "2deg"  },
  { name: "Dandeli",            size: 1.3,  color: "#C4862A", top: "39%",  left: "60%",  rotate: "-2deg" },
  { name: "Chopta",             size: 1.1,  color: "#555550", top: "84%",  left: "22%",  rotate: "1deg"  },
  { name: "Sattal",             size: 1.1,  color: "#444440", top: "16%",  left: "60%",  rotate: "-1deg" },
];

export default function Slide21Stats() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(196,134,42,0.05) 0%, transparent 65%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw", display: "flex", alignItems: "center", gap: "1vw" }}>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>18 Destinations · India</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#2A2A28", fontFamily: "'DM Mono', monospace" }}>21</div>

      <div style={{ position: "absolute", bottom: "7vh", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontSize: "0.7vw", color: "#444440", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Every wild corner of the subcontinent</div>
      </div>

      {LOCATIONS.map((loc) => (
        <div
          key={loc.name}
          style={{
            position: "absolute",
            top: loc.top,
            left: loc.left,
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: `${loc.size}vw`,
            fontWeight: loc.size >= 3 ? 700 : loc.size >= 2 ? 600 : 400,
            color: loc.color,
            transform: `rotate(${loc.rotate ?? "0deg"})`,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {loc.name}
        </div>
      ))}
    </div>
  );
}
