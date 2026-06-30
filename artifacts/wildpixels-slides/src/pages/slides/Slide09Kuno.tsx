export default function Slide09Kuno() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#0A0A0A", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "55vw", height: "100%", overflow: "hidden" }}>
        <img
          src="https://lh3.googleusercontent.com/pw/AP1GczOHFj9u4xKOfVZXe47DFjUR-fL7rvIxex-SLz9NLYLBoQrZvUH_RsNmZ5JscUGwgijztIhpsxJFqBYJrwTkyIsoSa2AqXoglKQyuiVXomrxYJYFL0Wp=w1920"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Kuno National Park cheetah"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 55%, rgba(10,10,10,0.98) 100%)" }} />
      </div>

      <div style={{ position: "absolute", top: "7vh", left: "7vw" }}>
        <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Madhya Pradesh, India · February 2026</span>
      </div>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>09</div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "42vw" }}>
        <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A", marginBottom: "2.5vh" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.5vw", fontWeight: 700, color: "#F5F3EF", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Kuno:<br />The Cheetah<br />Returns
        </h2>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "3vh", lineHeight: 1.75, maxWidth: "38vw" }}>
          After 70 years of extinction in India, cheetahs were reintroduced to Kuno National Park in 2022 — a project with no historical parallel. The dry deciduous scrub of this Madhya Pradesh reserve now shelters Africa's fastest land animal in an Indian landscape.
        </p>
        <p style={{ fontSize: "1.35vw", fontWeight: 300, color: "#9A9890", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "38vw" }}>
          To photograph these animals is to stand at the edge of a conservation miracle — an entire species given a second chance.
        </p>
        <div style={{ marginTop: "3.5vh", display: "inline-flex", alignItems: "center", gap: "1.5vw", backgroundColor: "rgba(196,134,42,0.12)", border: "1px solid rgba(196,134,42,0.3)", padding: "1.5vh 2vw" }}>
          <span style={{ fontSize: "1.8vw", color: "#C4862A", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>70 years</span>
          <span style={{ fontSize: "0.85vw", color: "#666560", lineHeight: 1.4 }}>Since cheetahs last<br />roamed India</span>
        </div>
      </div>
    </div>
  );
}
