export default function Slide20Gallery2() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: "3px",
      }}>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "1 / 3 / 3 / 5" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczMzVfUi5BmeHI9pcQIdHDc4z2g7AclAsm-ENN0GSY_Ms6avuZn1bRSAqkmi8zmJFztgUQyrULS6pdrtlllpFpg5gt305krxwgtd_3_OGxM-SlC4YYqs=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="Snow Leopard" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Snow Leopard</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "1 / 1 / 2 / 3" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczOSWkv8ygk7qOG4wCKZBDZQSQHbWA618IcemAOTYIqJbkHyNZG_nc7iTpGI1C_UWXc-ZSvPCzH9l82qHsYQFVCZA6PeztNRnBH14P9QBmK_3nnA7Cwu=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="F2 & Cubs" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>F2 &amp; Cubs</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "2 / 1 / 3 / 2" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczNQ9ks-6HGPZ0BuZZQX1b1GU6jqcSgn9pV68nmaj4Hh_0f92AuHOWDJ029glkcMGHphAXEJBJJweBpSLtRsiuTVIZ8hF7R3H9es3kan_hbNE-p3Hgfk=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "87.9% 0.0%", display: "block" }} alt="Gir" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Gir</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "2 / 2 / 3 / 3" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczM5u5Xus0YkM9uTsn8pvIs_-yiHooBuh_goZTi0VLp_J87fGaQgESnfAu9_9lYGYXHG7of4PehQ-PwFPw-Ml8bKKarDsUycGN0599bqydcwF8Cek-yV=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Rameshwaram" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Rameshwaram</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "1 / 5 / 2 / 7" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczNOhoYanEyXCmx1DdewlfPb2fJ9gqMuS6qjNblzlFuENEd1DuW8nCjimYFcigJmHgTL_nkYRP70LW0flTpfjOCg5Yx3LOBPUKTJ_QWhuDxxKpNst2Ox=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Bharatpur" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Bharatpur</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "2 / 5 / 3 / 6" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczOHpQph1tR3ceR9aUHwbhs0ZxkTNQmm8HSWd6ntK5aoBeqyJwqeISv_yZmcrMIV58izw1Lm8OgGtgksyShQSY54a0NjQqEndSF9i0KA8e76SL11lCQU=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Valparai" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Valparai</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "2 / 6 / 3 / 7" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczNECGG4Q0F4JWxDOeZdjWFP_gwG5W61Y9fJWf_gWL9sp9DGcXhVRM-jh_BYp1IJxmofPfC05FqJ3cK09jW3NtaBM4gx3o4FUbBe_EZxhg7G6tRcFdp3=w1200" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Daroji Bears" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Daroji Bears</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "3 / 1 / 4 / 3" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczO5Sqsy7hUbRYQ3TJ4RcsIAjcDidrYsrd9OJTDftpeRHT6oTD7zo3LmpYIKplMDJHyzp5kE0spelSyh7MIpfHdas5KCHxSXCf7RSJ71ulTqHbTLLZ6D=w1200" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Tal Chapar" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Tal Chapar</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "3 / 3 / 4 / 5" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczOLYowST2soOmh0YEsQDumlHVMFDhptWzlTe6lh27y0qPqHBQLv9m20KyjSEq7JXlWacYT7NOMGmnaxE3t6I-U=w1920" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Kaziranga" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Kaziranga</div>
        </div>

        <div style={{ position: "relative", overflow: "hidden", gridArea: "3 / 5 / 4 / 7" }}>
          <img src="https://lh3.googleusercontent.com/pw/AP1GczPbSt17yxY1Ns4sdO1g_eQephiiFT_NvhAPG3GWAGQNhNlWSzzLZBD8uXVpJgAGb3_gq4P5E-uogZwBvAtVRGuxE7NRFp_UIfO0FZwNRoe9h8Lri=w1200" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50.0% 50.0%", display: "block" }} alt="Ratnagiri" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: "1.2vh", left: "1.2vw", fontSize: "0.6vw", color: "rgba(196,134,42,0.9)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Ratnagiri</div>
        </div>

      </div>

      <div style={{ position: "absolute", top: "3.5vh", left: "3.5vw", zIndex: 2 }}>
        <span style={{ fontSize: "0.75vw", color: "rgba(196,134,42,0.8)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase" }}>Select Work</span>
      </div>
      <div style={{ position: "absolute", bottom: "3vh", right: "3.5vw", fontSize: "0.8vw", color: "#333330", fontFamily: "'DM Mono', monospace", zIndex: 2 }}>20</div>
    </div>
  );
}
