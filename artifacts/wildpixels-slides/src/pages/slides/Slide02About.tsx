const COLLAGE = [
  { src: "https://lh3.googleusercontent.com/pw/AP1GczOuhNFdUODfz4zADEoGPpnoCr6RQW2Z3PchNFm8wXW0sxrMPAK0livXZa5igzcLufamu3tzlOpn7W4niQaCn1xQYD3zYtXljPpHQJln5WjtPbdi3Y3X=w1920", alt: "Himalayan Monal", label: "Himalayan Monal" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczOLYowST2soOmh0YEsQDumlHVMFDhptWzlTe6lh27y0qPqHBQLv9m20KyjSEq7JXlWbT_LR4z1PV7141BUce5ZEIVNruopYacYT7NOMGmnaxE3t6I-U=w1920", alt: "Kaziranga rhino", label: "One-Horned Rhino" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920", alt: "F2 tigress and cubs", label: "F2 & Cubs · Tadoba" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczNOhoYanEyXCmx1DdewlfPb2fJ9gqMuS6qjNblzlFuENEd1DuW8nCjimYFcigJmHgTL_nkYRP70LW0flTpfjOCg5Yx3LOBPUKTJ_QWhuDxxKpNst2Ox=w1920", alt: "Bharatpur birds", label: "Bharatpur" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczOHpQph1tR3ceR9aUHwbhs0ZxkTNQmm8HSWd6ntK5aoBeqyJwqeISv_yZmcrMIV58izw1Lm8OgGtgksyShQSY54a0NjQqEndSF9i0KA8e76SL11lCQU=w1920", alt: "Valparai macaque", label: "Valparai" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczMaUtfe0CJKYmhm681RJshtoRfI4hzcs8nWQY9wKkyewAyEQ9esShUffZl5qRrEVquocwosfRSt6tqus6bv5T_jlJjTpjnccbApExhp5B0cIBpHRZoO=w1920", alt: "Kabini jungle", label: "Kabini" },
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
