export default function Slide14HimBirds() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <img
        src="https://lh3.googleusercontent.com/pw/AP1GczOuhNFdUODfz4zADEoGPpnoCr6RQW2Z3PchNFm8wXW0sxrMPAK0livXZa5igzcLufamu3tzlOpn7W4niQaCn1xQYD3zYtXljPpHQJln5WjtPbdi3Y3X=w1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        alt="Himalayan Monal"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.88) 35%, rgba(10,10,10,0.25) 62%, transparent 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.45) 0%, transparent 50%)" }} />

      <div style={{ position: "absolute", top: "7vh", left: "7vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Manda, Chopta & Sattal, Uttarakhand · March 2025</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>14</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-52%)", maxWidth: "44vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Himalayan<br />Foothills Birds
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          The lower Himalayas are a corridor for some of the world's most spectacular avifauna — from the fire-tailed sunbird at 2000 metres to the crimson-breasted finch at the treeline. Chopta and Sattal offer dense mixed oak-rhododendron forest; every branch conceals a colour.
        </p>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "40vw" }}>
          Birding here demands a different patience — still, quiet, head up, searching. The reward is a Himalayan monal catching the first light on its iridescent plumage.
        </p>
        <div style={{ marginTop: "3.5vh", display: "flex", gap: "3vw" }}>
          {[["Monal Pheasant", "Flagship Species"], ["Chopta", "Uttarakhand"], ["March", "Migration Peak"]].map(([v, l]) => (
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
