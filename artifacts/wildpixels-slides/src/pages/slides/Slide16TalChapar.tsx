export default function Slide16TalChapar() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "52vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczO5Sqsy7hUbRYQ3TJ4RcsIAjcDidrYsrd9OJTDftpeRHT6oTD7zo3LmpYIKplMDJHyzp5kE0spelSyh7MIpfHdas5KCHxSXCf7RSJ71ulTqHbTLLZ6D=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Tal Chapar blackbuck"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 50%, rgba(10,10,10,0.97) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "7vh", left: "7vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Tal Chapar, Rajasthan · December 2025</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>16</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "44vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Tal Chapar:<br />Open Skies
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          Tal Chapar in the Shekhawati region of Rajasthan is a small grassland sanctuary with an outsized drama. Thousands of blackbuck — the Indian antelope whose males wear jet-black coats — roam the open plain. Winter brings migrant raptors: the majestic short-eared owl, the falcated duck, the imperial eagle.
        </p>
        <p style={{ fontSize: "1.2vw", fontStyle: "italic", color: "#C4862A", marginTop: "2vh", fontFamily: "'Playfair Display', serif" }}>
          "A blackbuck male at full sprint — the grassland a blur behind him at 1/2000s."
        </p>
        <div style={{ marginTop: "3.5vh", display: "flex", gap: "3vw" }}>
          {[["Blackbuck", "Indian Antelope"], ["Raptors", "20+ Winter Species"], ["Open Grassland", "Shekhawati"]].map(([v, l]) => (
            <div key={l} style={{ borderLeft: "2px solid #2A2A28", paddingLeft: "1.2vw" }}>
              <div style={{ fontSize: "1.05vw", fontWeight: 700, color: "#F5F3EF" }}>{v}</div>
              <div style={{ fontSize: "0.75vw", color: "#555550", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.4vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
