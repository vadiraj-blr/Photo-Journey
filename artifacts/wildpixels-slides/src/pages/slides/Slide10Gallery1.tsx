const KAZIRANGA_PHOTOS = [
  "https://lh3.googleusercontent.com/pw/AP1GczPitj0m4zmw5QSVMHp2iU7w1LwCfmsOz4qolp0GqwQJka0KnhODhvXhsZ8keQPd6qLcy3ELe3gAxJMtEJRHUvO8RSfqJo21xM6XfstltDLVg9zn7dpt=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczPcuDzMvxX__qXg307tUxWEYSqAHqegUWiJ7YPVa9vuuDLI4K8THVgn16RPJSwJElCpPD-bw0RaS6Typ8Yn0_8E56-0K30jINqhn-2YwfUy2I9DbExH=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczMnY51ZZadHVlWWckORq9UwtumNHWox5WYQXU_5_XlFuUSU-h5fV8CimBfmlHtVpmwfD0L59I8sJWOlbpf0NV9flho-GJ5Snj8c5sfav-Jg6pWFPbip=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczMU3513EfyfgwBWPoRqMQXsyCGEeyTlDSal9HjJXqO5alFIS3zdj67dnbAPuzt0BI-iKdzqMbfSGRkmmJ2z_Skl-fPhJBML7xWjqfI2G_WVeFegAlFdgQUYk=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczNUGp8bPpFcLTzHjfrgky_wpY4IdPCb3NA4QxXeejRrohznhVR_hLrWVKJInX6MIuFiistpMk-1GV0UITvRKzXehXKIkH-3_-iPHd_UbzSmuLLjuuIX=w1920",
  "https://lh3.googleusercontent.com/pw/AP1GczPqo4s0seDcFiPexTLf91iP-YlW7bgtwMYr1iFr4AjdP-IYIhSFo-hiVtcXQ3NPqVBZoQOdP5b7MmeJ2U0hIT4uSySsAc8=w1920",
];

export default function Slide10Gallery1() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ position: "absolute", top: "6vh", left: "7vw", zIndex: 2 }}>
        <div style={{ fontSize: "0.8vw", color: "#C4862A", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>From the Field</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8vw", fontWeight: 700, color: "#F5F3EF", margin: "0.8vh 0 0", lineHeight: 1.1 }}>
          Kaziranga Expedition
        </h2>
      </div>

      <div style={{ position: "absolute", top: "20vh", left: "7vw", right: "7vw", height: "68vh", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "0.6vw" }}>
        <div style={{ gridRow: "span 2", overflow: "hidden" }}>
          <img src={KAZIRANGA_PHOTOS[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Kaziranga" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src={KAZIRANGA_PHOTOS[1]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Kaziranga" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src={KAZIRANGA_PHOTOS[2]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Kaziranga" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src={KAZIRANGA_PHOTOS[3]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Kaziranga" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src={KAZIRANGA_PHOTOS[4]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Kaziranga" />
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "6vh", right: "7vw", textAlign: "right" }}>
        <div style={{ fontSize: "0.75vw", color: "#555550", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", marginBottom: "0.5vh" }}>Kaziranga, Assam · December 2024</div>
        <div style={{ fontSize: "0.9vw", color: "#333330", fontFamily: "'DM Mono', monospace" }}>10</div>
      </div>
    </div>
  );
}
