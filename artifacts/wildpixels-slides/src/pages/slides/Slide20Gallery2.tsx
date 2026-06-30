const PHOTOS = [
  { src: "https://lh3.googleusercontent.com/pw/AP1GczNc90PnW814or1sQJzJ0fXACA_fqdHaO3Tb64O4TLVG0mByPfz_tRS5NmHw3utivxkZzlAOWWHiGuKiv6jBxhJJlVgUsKTeKrz7bq2YF0jiRCKccTTf=w1920", label: "Ranthambore" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczMaUtfe0CJKYmhm681RJshtoRfI4hzcs8nWQY9wKkyewAyEQ9esShUffZl5qRrEVquocwosfRSt6tqus6bv5T_jlJjTpjnccbApExhp5B0cIBpHRZoO=w1920", label: "Kabini" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczNOhoYanEyXCmx1DdewlfPb2fJ9gqMuS6qjNblzlFuENEd1DuW8nCjimYFcigJmHgTL_nkYRP70LW0flTpfjOCg5Yx3LOBPUKTJ_QWhuDxxKpNst2Ox=w1920", label: "Bharatpur" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczNQ9ks-6HGPZ0BuZZQX1b1GU6jqcSgn9pV68nmaj4Hh_0f92AuHOWDJ029glkcMGHphAXEJBJJweBpSLtRsiuTVIZ8hF7R3H9es3kan_8H3nkYRP3=w1920", label: "Gir" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczOHpQph1tR3ceR9aUHwbhs0ZxkTNQmm8HSWd6ntK5aoBeqyJwqeISv_yZmcrMIV58izw1Lm8OgGtgksyShQSY54a0NjQqEndSF9i0KA8e76SL11lCQU=w1920", label: "Valparai" },
  { src: "https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920", label: "Tadoba" },
];

export default function Slide20Gallery2() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "6vh", left: "7vw", zIndex: 2 }}>
        <div style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Select Work</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 700, color: "#F5F3EF", margin: "0.8vh 0 0", lineHeight: 1.1 }}>
          Portfolio Highlights
        </h2>
      </div>

      <div style={{ position: "absolute", top: "20vh", left: "7vw", right: "7vw", height: "68vh", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "0.5vw" }}>
        {PHOTOS.map((p, i) => (
          <div key={i} style={{ position: "relative", overflow: "hidden" }}>
            <img src={p.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.label} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.65) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: "1.5vh", left: "1.5vw", fontSize: "0.7vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>{p.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: "6vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>20</div>
    </div>
  );
}
