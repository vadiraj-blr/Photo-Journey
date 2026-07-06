type Line = { text: string; accent?: boolean };

interface CountdownSlideProps {
  image: string;
  alt: string;
  kicker: string;
  lines: Line[];
  subtext?: string;
  page: string;
  numeral?: boolean;
}

export default function CountdownSlide({ image, alt, kicker, lines, subtext, page, numeral }: CountdownSlideProps) {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src={image}
        alt={alt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.62 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 62% 55% at 50% 50%, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.94) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.08) 20%, rgba(13,13,13,0.08) 78%, rgba(13,13,13,0.6) 100%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "1vw", whiteSpace: "nowrap" }}>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
        <span style={{ fontSize: "0.8vw", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4862A", fontFamily: "'DM Mono', monospace" }}>
          {kicker}
        </span>
        <div style={{ width: "2vw", height: "1px", backgroundColor: "#C4862A" }} />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", maxWidth: "46vw" }}>
        {lines.map((line, i) => (
          <h1
            key={i}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: numeral ? "13vw" : "3.6vw",
              fontWeight: 900,
              color: line.accent ? "#C4862A" : "#F5F3EF",
              margin: 0,
              lineHeight: numeral ? 0.9 : 1.12,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 30px rgba(0,0,0,0.7)",
            }}
          >
            {line.text}
          </h1>
        ))}
        {subtext && (
          <>
            <div style={{ width: "3.5vw", height: "2px", backgroundColor: "#C4862A", margin: "3vh auto" }} />
            <p style={{ fontSize: "1.15vw", fontWeight: 300, color: "#D8D5CF", lineHeight: 1.65, textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}>
              {subtext}
            </p>
          </>
        )}
      </div>

      <div style={{ position: "absolute", bottom: "7vh", left: "50%", transform: "translateX(-50%)", fontSize: "0.85vw", color: "rgba(240,237,232,0.55)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
        {page} / 13
      </div>
    </div>
  );
}
