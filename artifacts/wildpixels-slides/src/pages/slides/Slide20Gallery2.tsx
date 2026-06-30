const FIELD_PHOTOS = [
  "https://lh3.googleusercontent.com/pw/AP1GczPh2hrDBdRxfCVQNGvK_bwC8q5xGRvNJsdtbINiqWuDARxTUVJLerypR08Pvi6Mj9_QgUV9DEOM1aEdCtYha6RChKeqdKM4QWNXHAkXj0dNKSvNJGq5=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczMJ8EaF0tNKBFlwsr6ENV7sgyeSkrvBVM9uZc2X7YCGoCoVvFHxYnb87dBCaW6bjVF9sIMCzAG8qfcVkxohYtyW2QSXHapIaoG0rozHJ0TJP7b19ojW=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczOCdKRzmJWb4ZhPskqsDIIO0OfvB-yIv_0_5bqnbtkxQ33AtzM4ZA4Tq7u4kzve8GOQgTCIcy1_giraDsIiOA21U2UctE_nP8A1PdMXf-GawvxBd9Yq=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczOfd-dK7HNRMJsM1UY9ZUQrGrlBHPPDN2ckpC4R-pHX3XQPvJY6d2efrK8abRGMMnDrAz0uMbY0gKwYl1LzzTPfgMSHd8Ohmvr3K6XQogxJq0h0XXke=w1920",
];

export default function Slide20Gallery2() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "6vh", left: "7vw", zIndex: 2 }}>
        <div style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>The Photographer</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 700, color: "#F5F3EF", margin: "0.8vh 0 0", lineHeight: 1.1 }}>
          In the Field
        </h2>
      </div>

      <div style={{ position: "absolute", top: "20vh", left: "7vw", right: "7vw", height: "68vh", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "0.5vw" }}>
        {FIELD_PHOTOS.map((src, i) => (
          <div key={i} style={{ position: "relative", overflow: "hidden" }}>
            <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Vadiraj in the field" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.5) 0%, transparent 55%)" }} />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: "6vh", right: "7vw", fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>20</div>
    </div>
  );
}
