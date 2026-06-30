const COLLAGE = [
  { src: "https://lh3.googleusercontent.com/pw/AP1GczPChcMMo5iFJFfNgTLSiRjP-bU_-65LLMmjk5FHqEUt188BPcEQ109ung1PeZ2lHZ7QoXIT10BZeYNhOSgVklQlAJU1P7IFihcoAQHU-yopbYO1mCFF=w1920", alt: "Wildlife portrait 1", label: "" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczMSb9A1gyLIy3_pXU8wcRWIhYQJ9x2znpkKb78keYe5bNUiNpUFgh45iw2849EmJa8fuwPuEzp3TGouvogQpb3LNCfDTTWWpiKepXVBvsyOO0NEUDV_=w1920", alt: "Wildlife portrait 2", label: "" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczNO47SFMuhc9agnOnzB1rWDBYAxRnBdCesgQJZ6HwuU7FBYFPBF12dlZE-zkRH51V6eEBsVmcd6TDiTHyBGGn4tOc1-EFkg3XW9lXBws6YqjY664CuH=w1920", alt: "Wildlife portrait 3", label: "" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczPDtJgQnPzsECivucZw1wr3H-zTLpE4wujxvuSDwBbsWZbtGM1KLLzWw0yVrcstNQ_Fh-o_bGO1HvTnd17iqfL5oKDZKgxnS666qYziwPaAFaes8Soz=w1920", alt: "Wildlife portrait 4", label: "" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczP9BqX5CoYry6vukcwIluZFc3ccy0LDRy3WALrWoHDS_HsZrN4rqxsn0IHQCOySNFr4Q9z6v3Nr7TZSCPJHsS87rjSLfHW6qK0Suf_MjZftc4VOEQ3v=w1920", alt: "Wildlife portrait 5", label: "" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczNMtEJlXgiPOw8hBqLHUs_j_8NSHW-Snxtn_R36yRrQ_IMbwL0RM3_0FRPSJC42aA2n5igLfpXC-ri96assjL9MdkIcy2kF8Rr4Nbfs1EGjPXj6hHLJ=w1920", alt: "Wildlife portrait 6", label: "" },
];

export default function Slide02About() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#F5F3EF", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "7vh", right: "7vw", fontSize: "0.85vw", color: "#B0ADA8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em" }}>
        Wildpixels — The Photographer
      </div>
      <div style={{ position: "absolute", bottom: "7vh", right: "7vw", fontSize: "0.9vw", color: "#C0BDB8" }}>02</div>

      <div style={{ position: "absolute", top: 0, right: 0, width: "44vw", height: "100%", overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          width: "100%",
          height: "100%",
          gap: "3px",
          backgroundColor: "#F5F3EF",
        }}>
          {COLLAGE.map((p, i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={p.src}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                alt={p.alt}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.55) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: "1vh", left: "0.8vw", fontSize: "0.55vw", color: "rgba(255,255,255,0.75)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", top: "50%", left: "7vw", transform: "translateY(-50%)", maxWidth: "46vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2vw", marginBottom: "3vh" }}>
          <div style={{ width: "3vw", height: "2px", backgroundColor: "#C4862A" }} />
          <span style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>Behind the Lens</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8vw", fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Chasing Light<br />and Wild Things
        </h2>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "3vh", lineHeight: 1.75, maxWidth: "38vw" }}>
          I am a wildlife and landscape photographer based in India — spending months each year in national parks and remote forests across the subcontinent.
        </p>
        <p style={{ fontSize: "1.3vw", fontWeight: 300, color: "#555550", marginTop: "1.5vh", lineHeight: 1.75, maxWidth: "38vw" }}>
          Each expedition is an act of patience: waiting for the moment that cannot be planned, only witnessed. The wild doesn't perform on schedule.
        </p>
        <div style={{ marginTop: "4.5vh", display: "flex", gap: "3.5vw" }}>
          {[["18", "Places Visited"], ["1195", "Photos Taken"], ["15+", "Expeditions"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: "3vw", fontWeight: 800, color: "#0D0D0D", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: "0.8vw", color: "#999890", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.7vh" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
