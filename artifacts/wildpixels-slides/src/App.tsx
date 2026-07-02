/**
 * Platform contract file — do not restructure.
 *
 * This file is part of the contract between the slides artifact and
 * the surrounding workspace tooling (preview, thumbnails, exports).
 * Reorganizing it, swapping the router, or changing the structure
 * of `AllSlides` can quietly break that tooling even when the page
 * still looks correct in the preview.
 *
 * Agents: see the slides skill `<workspace_contract>` for the full
 * rules, and `references/visual_qa.md` → "Platform contract sanity
 * check" if this file has been hand-edited and needs repair.
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

import { slides } from "@/slideLoader";

function getSlideIndex(pathname: string): number {
  const match = pathname.match(/^\/slide(\d+)$/);
  if (!match) return -1;
  const position = parseInt(match[1], 10);
  return slides.findIndex((s) => s.position === position);
}

function SlideEditor() {
  const [location, navigate] = useLocation();
  const currentIndex = getSlideIndex(location);

  const [adjustMode, setAdjustMode] = useState(false);
  const [photoPositions, setPhotoPositions] = useState<{ x: string; y: string; label: string }[]>([]);
  const [saveStates, setSaveStates] = useState<Record<number, "idle" | "saving" | "saved" | "error">>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);
  const adjustModeRef = useRef(false);

  const savePhoto = async (imageIndex: number, x: string, y: string) => {
    const slide = slides[currentIndex];
    if (!slide) return;
    const filepath = `artifacts/wildpixels-slides/${slide.filepath}`;
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    setSaveStates((prev) => ({ ...prev, [imageIndex]: "saving" }));
    try {
      const res = await fetch(`${base}/api/slides/photo-position`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filepath, imageIndex, x, y }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaveStates((prev) => ({ ...prev, [imageIndex]: "saved" }));
      setTimeout(() => setSaveStates((prev) => ({ ...prev, [imageIndex]: "idle" })), 2000);
    } catch {
      setSaveStates((prev) => ({ ...prev, [imageIndex]: "error" }));
      setTimeout(() => setSaveStates((prev) => ({ ...prev, [imageIndex]: "idle" })), 2500);
    }
  };

  // Keep ref in sync with state so navigation handlers can read it
  useEffect(() => {
    adjustModeRef.current = adjustMode;
  }, [adjustMode]);

  // In the workspace, the slide iframe is nested inside another iframe,
  // so window.parent !== window.parent.parent. In the deployed SlideViewer,
  // the parent is the top-level window, so they're equal. Disable local
  // navigation only in the workspace — the parent owns it there.
  const navigationDisabledRef = useRef(window.parent !== window.parent.parent);
  const touchHandledRefStable = useRef(false);

  useEffect(() => {
    if (currentIndex === -1) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (adjustModeRef.current) return;
      if (navigationDisabledRef.current) return;
      if (event.key === " ") {
        event.preventDefault();
      }
      if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && currentIndex > 0) {
        navigate(`/slide${slides[currentIndex - 1].position}`);
      }
      if (
        (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") &&
        currentIndex < slides.length - 1
      ) {
        navigate(`/slide${slides[currentIndex + 1].position}`);
      }
    };

    const INTERACTIVE =
      "a,button,video,audio,input,select,textarea,details,summary,iframe,svg,canvas," +
      '[role="button"],[contenteditable="true"]';

    const isInteractive = (target: EventTarget | null) =>
      (target as HTMLElement | null)?.closest?.(INTERACTIVE);

    const touchHandledRef = touchHandledRefStable;

    const onClick = (event: MouseEvent) => {
      if (adjustModeRef.current) return;
      if (touchHandledRef.current) {
        touchHandledRef.current = false;
        return;
      }
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
      if (isInteractive(event.target)) return;

      if (navigationDisabledRef.current) {
        window.parent.postMessage({ type: "advanceSlide" }, "*");
        return;
      }

      if (currentIndex < slides.length - 1) {
        navigate(`/slide${slides[currentIndex + 1].position}`);
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchTarget: EventTarget | null = null;

    const onTouchStart = (event: TouchEvent) => {
      touchHandledRef.current = false;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchTarget = event.target;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (adjustModeRef.current) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) >= 10 || Math.abs(dy) >= 10) return;
      if (isInteractive(touchTarget)) return;
      touchHandledRef.current = true;

      if (navigationDisabledRef.current) {
        window.parent.postMessage({ type: "advanceSlide" }, "*");
        return;
      }

      const fraction = touchStartX / window.innerWidth;
      if (fraction < 0.4 && currentIndex > 0) {
        navigate(`/slide${slides[currentIndex - 1].position}`);
      } else if (fraction >= 0.4 && currentIndex < slides.length - 1) {
        navigate(`/slide${slides[currentIndex + 1].position}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, navigate]);

  // Photo adjust: attach drag handlers to all imgs in the current slide
  useEffect(() => {
    cleanupRef.current.forEach((fn) => fn());
    cleanupRef.current = [];

    if (!adjustMode) {
      setPhotoPositions([]);
      return;
    }

    const parsePos = (style: CSSStyleDeclaration): [number, number] => {
      const pos = style.objectPosition || "50% 50%";
      const parts = pos.trim().split(/\s+/);
      const parseVal = (v = "50%"): number => {
        if (v === "center") return 50;
        if (v === "left" || v === "top") return 0;
        if (v === "right" || v === "bottom") return 100;
        if (v.endsWith("%")) return parseFloat(v);
        return 50;
      };
      return [parseVal(parts[0]), parseVal(parts[1] ?? parts[0])];
    };

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      // Find visible slide (display: block)
      const children = Array.from(container.children) as HTMLElement[];
      const visibleSlide = children[currentIndex] ?? children[0];
      if (!visibleSlide) return;

      const imgs = Array.from(visibleSlide.querySelectorAll<HTMLImageElement>("img"));
      if (imgs.length === 0) {
        setPhotoPositions([]);
        return;
      }

      const initialPositions = imgs.map((img, idx) => {
        const cs = window.getComputedStyle(img);
        const [x, y] = parsePos(cs);
        return { x: x.toFixed(1), y: y.toFixed(1), label: `Photo ${idx + 1}` };
      });
      setPhotoPositions(initialPositions);

      imgs.forEach((img, idx) => {
        // Inject a transparent drag-handle div on top of the image's container
        // so it sits above any gradient overlays that would otherwise eat pointer events.
        const container = img.parentElement as HTMLElement;
        const savedContainerPos = container.style.position;
        if (!savedContainerPos || savedContainerPos === "static") {
          container.style.position = "relative";
        }

        const handle = document.createElement("div");
        handle.style.cssText =
          "position:absolute;inset:0;z-index:500;cursor:grab;touch-action:none;";
        container.appendChild(handle);

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startPosX = 50;
        let startPosY = 50;

        const onDown = (e: PointerEvent) => {
          e.stopPropagation();
          e.preventDefault();
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const cs = window.getComputedStyle(img);
          [startPosX, startPosY] = parsePos(cs);
          handle.style.cursor = "grabbing";
          handle.setPointerCapture(e.pointerId);
        };

        const onMove = (e: PointerEvent) => {
          if (!isDragging) return;
          const rect = img.getBoundingClientRect();
          const nat =
            img.naturalWidth && img.naturalHeight
              ? img.naturalWidth / img.naturalHeight
              : 16 / 9;
          const boxAspect = rect.width / rect.height;

          let displayW: number;
          let displayH: number;
          if (nat > boxAspect) {
            displayH = rect.height;
            displayW = rect.height * nat;
          } else {
            displayW = rect.width;
            displayH = rect.width / nat;
          }

          const overflowX = Math.max(displayW - rect.width, 1);
          const overflowY = Math.max(displayH - rect.height, 1);

          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          const newX = Math.max(0, Math.min(100, startPosX - (dx / overflowX) * 100));
          const newY = Math.max(0, Math.min(100, startPosY - (dy / overflowY) * 100));

          img.style.objectPosition = `${newX.toFixed(1)}% ${newY.toFixed(1)}%`;

          setPhotoPositions((prev) => {
            const next = [...prev];
            next[idx] = { x: newX.toFixed(1), y: newY.toFixed(1), label: `Photo ${idx + 1}` };
            return next;
          });
        };

        const onUp = () => {
          isDragging = false;
          handle.style.cursor = "grab";
        };

        handle.addEventListener("pointerdown", onDown);
        handle.addEventListener("pointermove", onMove);
        handle.addEventListener("pointerup", onUp);

        cleanupRef.current.push(() => {
          handle.removeEventListener("pointerdown", onDown);
          handle.removeEventListener("pointermove", onMove);
          handle.removeEventListener("pointerup", onUp);
          handle.remove();
          img.style.objectPosition = "";
          if (!savedContainerPos || savedContainerPos === "static") {
            container.style.position = savedContainerPos;
          }
        });
      });
    }, 80);

    return () => {
      clearTimeout(timer);
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, [adjustMode, currentIndex]);

  return (
    <div style={{ position: "relative" }}>
      {/* Photo Adjust Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setAdjustMode((v) => !v);
        }}
        style={{
          position: "fixed",
          top: "1.4vh",
          right: "1.5vw",
          zIndex: 9999,
          background: adjustMode ? "#C4862A" : "rgba(12,12,10,0.88)",
          color: adjustMode ? "#0A0A0A" : "#C4862A",
          border: `1px solid ${adjustMode ? "#C4862A" : "#3A3A38"}`,
          borderRadius: "4px",
          padding: "0.55vh 1.1vw",
          fontSize: "0.72vw",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.14em",
          cursor: "pointer",
          textTransform: "uppercase" as const,
          backdropFilter: "blur(10px)",
          transition: "all 0.18s",
          userSelect: "none" as const,
        }}
      >
        {adjustMode ? "✕  Exit Adjust" : "⊹  Adjust Photos"}
      </button>

      {/* Position HUD */}
      {adjustMode && photoPositions.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "2.5vh",
            right: "1.5vw",
            zIndex: 9999,
            background: "rgba(8,8,6,0.94)",
            border: "1px solid #252522",
            borderRadius: "6px",
            padding: "1.4vh 1.6vw",
            fontFamily: "'DM Mono', monospace",
            backdropFilter: "blur(14px)",
            minWidth: "20vw",
          }}
        >
          <div
            style={{
              fontSize: "0.63vw",
              color: "#C4862A",
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              marginBottom: "1.2vh",
            }}
          >
            objectPosition values
          </div>
          {photoPositions.map(
            (p, i) =>
              p && (
                <div
                  key={i}
                  style={{
                    marginBottom: "1.2vh",
                    padding: "1vh 1vw",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "4px",
                    border: "1px solid #1E1E1C",
                  }}
                >
                  {/* Label + position row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.8vh",
                    }}
                  >
                    <span style={{ fontSize: "0.7vw", color: "#666660" }}>{p.label}</span>
                    <span style={{ fontSize: "0.85vw", color: "#F5F3EF", fontWeight: 700, letterSpacing: "0.05em" }}>
                      {p.x}% &nbsp;{p.y}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(`${p.x}% ${p.y}%`);
                      }}
                      style={{
                        fontSize: "0.65vw",
                        color: "#555550",
                        background: "none",
                        border: "1px solid #2A2A28",
                        borderRadius: "3px",
                        padding: "0.3vh 0.6vw",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      copy
                    </button>
                  </div>
                  {/* Prominent Save button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePhoto(i, p.x, p.y);
                    }}
                    disabled={saveStates[i] === "saving"}
                    style={{
                      width: "100%",
                      padding: "0.9vh 0",
                      fontSize: "0.78vw",
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      fontWeight: 600,
                      cursor: saveStates[i] === "saving" ? "wait" : "pointer",
                      border: "none",
                      borderRadius: "3px",
                      transition: "all 0.2s",
                      background:
                        saveStates[i] === "saved"
                          ? "#3A6A3A"
                          : saveStates[i] === "error"
                            ? "#6A2A2A"
                            : "#C4862A",
                      color:
                        saveStates[i] === "saved" || saveStates[i] === "error"
                          ? "#F5F3EF"
                          : "#0A0A0A",
                    }}
                  >
                    {saveStates[i] === "saving"
                      ? "Saving…"
                      : saveStates[i] === "saved"
                        ? "✓  Saved"
                        : saveStates[i] === "error"
                          ? "✕  Error — retry"
                          : "Save Position"}
                  </button>
                </div>
              ),
          )}
          <div
            style={{
              marginTop: "0.2vh",
              fontSize: "0.6vw",
              color: "#333330",
              borderTop: "1px solid #181816",
              paddingTop: "0.8vh",
              lineHeight: 1.5,
            }}
          >
            Drag to reposition · Save writes to the file.
          </div>
        </div>
      )}

      {adjustMode && photoPositions.length === 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "2.5vh",
            right: "1.5vw",
            zIndex: 9999,
            background: "rgba(8,8,6,0.88)",
            border: "1px solid #252522",
            borderRadius: "6px",
            padding: "1.2vh 1.4vw",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68vw",
            color: "#555550",
            backdropFilter: "blur(12px)",
          }}
        >
          No photos on this slide
        </div>
      )}

      <div className="select-none" ref={containerRef}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{ display: index === currentIndex ? "block" : "none", position: "relative" }}
          >
            <slide.Component />
            <div
              style={{
                position: "absolute",
                bottom: "2vh",
                left: "3.5vw",
                fontSize: "0.65vw",
                color: "rgba(180,175,165,0.4)",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.12em",
                pointerEvents: "none",
                zIndex: 100,
              }}
            >
              © Vadiraj BK · Wildpixels
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Do not rewrite this component. Each slide must remain wrapped in
// `<div className="slide">` sized 1920×1080 — the class name and
// dimensions are part of the platform contract. See the file-level
// banner above for context.
function AllSlides() {
  return (
    <div className="bg-black">
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="slide relative aspect-video overflow-hidden"
          style={{ width: "1920px", height: "1080px" }}
        >
          <div className="h-full w-full [&_.h-screen]:!h-full [&_.w-screen]:!w-full">
            <slide.Component />
          </div>
          <div style={{ position: "absolute", bottom: "22px", left: "54px", fontSize: "13px", color: "rgba(180,175,165,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em", pointerEvents: "none", zIndex: 100 }}>© Vadiraj BK · Wildpixels</div>
        </div>
      ))}
    </div>
  );
}

// This component is used for the deployed view at `/`
function SlideViewer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [dims, setDims] = useState(() => ({
    width: Math.min(window.innerWidth, window.innerHeight * (16 / 9)),
    height: Math.min(window.innerHeight, window.innerWidth * (9 / 16)),
  }));

  useEffect(() => {
    const update = () => {
      setDims({
        width: Math.min(window.innerWidth, window.innerHeight * (16 / 9)),
        height: Math.min(window.innerHeight, window.innerWidth * (9 / 16)),
      });
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== " ") return;
      if (event.key === " ") event.preventDefault();
      iframeRef.current?.contentWindow?.dispatchEvent(
        new KeyboardEvent("keydown", { key: event.key, code: event.code, bubbles: true }),
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const firstPosition = slides.length > 0 ? slides[0].position : 1;

  return (
    <div
      className="slide-viewer h-screen w-screen overflow-hidden bg-black flex items-center justify-center"
      onClick={() => iframeRef.current?.focus()}
    >
      <iframe
        ref={iframeRef}
        src={`${base}/slide${firstPosition}`}
        style={{ width: dims.width, height: dims.height, border: "none" }}
        onLoad={() => iframeRef.current?.focus()}
        title="Slide viewer"
      />
    </div>
  );
}

export default function App() {
  const [location, navigate] = useLocation();

  // DO NOT edit this useEffect - redirects unknown routes to the first slide.
  // The "/" and "/allslides" routes are handled separately below.
  useEffect(() => {
    if (
      location !== "/" &&
      location !== "/allslides" &&
      getSlideIndex(location) === -1
    ) {
      if (slides.length > 0) {
        navigate(`/slide${slides[0].position}`, { replace: true });
      }
    }
  }, [location, navigate]);

  // DO NOT edit this useEffect - allows the parent frame to navigate
  // between slides via postMessage so it can avoid changing the iframe
  // src (which causes a white flash).
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "navigateToSlide" &&
        typeof event.data.position === "number" &&
        slides.some((s) => s.position === event.data.position)
      ) {
        navigate(`/slide${event.data.position}`);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  if (location === "/") return <SlideViewer />;
  if (location === "/allslides") return <AllSlides />;
  return <SlideEditor />;
}
