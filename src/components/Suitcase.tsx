import { useEffect, useRef, useState } from "react";

/**
 * 3D-styled suitcase that opens on scroll. Pure SVG + CSS transforms.
 * Acts as a "portal" — content beyond hero flows through it.
 */
export function Suitcase({ className = "w-[360px]" }: { className?: string }) {
  const [openDeg, setOpenDeg] = useState(0);
  const [rotY, setRotY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = 800;
      const p = Math.min(1, y / max);
      setOpenDeg(p * 110);
      setRotY(p * 18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className={`suitcase-portal relative mx-auto aspect-square ${className}`}>
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(circle, rgba(244,210,122,.45), transparent 65%)" }} />

      <div
        className="relative w-full h-full"
        style={{ transform: `rotateY(${rotY}deg) rotateX(6deg)`, transformStyle: "preserve-3d", transition: "transform .1s linear" }}
      >
        {/* Handle */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-24 h-10 border-[6px] rounded-t-full"
          style={{ borderColor: "#d9a441", borderBottom: "none", boxShadow: "0 0 20px rgba(217,164,65,.6)" }} />

        {/* Body */}
        <div className="suitcase-leather absolute inset-x-4 top-8 bottom-4 rounded-2xl border border-amber-700/40 shadow-2xl"
          style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,.7), inset 0 0 30px rgba(0,0,0,.4)" }}>

          {/* Gold corner studs */}
          {[[8,8],[8,"auto"], ["auto",8], ["auto","auto"]].map((p,i) => (
            <span key={i} className="absolute w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(244,210,122,.8)]"
              style={{ top: p[0] as number, bottom: p[0] === "auto" ? 8 : undefined, left: p[1] as number, right: p[1] === "auto" ? 8 : undefined }} />
          ))}

          {/* Logo emboss on body: palms + swooshes */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full p-10 opacity-90">
            <defs>
              <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#f4d27a"/>
                <stop offset="50%" stopColor="#d9a441"/>
                <stop offset="100%" stopColor="#b67d2a"/>
              </linearGradient>
            </defs>
            {/* Palm trees */}
            <g fill="url(#gold)">
              <path d="M55 130 q-2 -30 5 -50 q-12 8 -18 22 q14 -6 18 -22 q4 18 18 24 q-8 -16 -18 -22 q12 -2 22 8 q-8 -14 -22 -10 z M58 130 l4 -50 l-2 -2 l-4 52 z"/>
              <path d="M85 140 q-2 -36 6 -56 q-14 8 -20 24 q16 -6 20 -24 q4 20 20 26 q-8 -18 -20 -24 q12 -2 24 8 q-8 -16 -24 -10 z M88 140 l4 -56 l-2 -2 l-4 58 z"/>
            </g>
            {/* Gold swooshes / road */}
            <path d="M30 175 C 80 130, 120 110, 175 40" stroke="url(#gold)" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M40 178 C 90 140, 130 120, 180 55" stroke="url(#gold)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8"/>
            <path d="M50 180 C 100 150, 140 130, 185 70" stroke="url(#gold)" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6"/>
          </svg>

          {/* Center seam */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        </div>

        {/* Lid — opens on scroll */}
        <div
          className="suitcase-leather suitcase-lid absolute inset-x-4 top-8 h-[48%] rounded-2xl border border-amber-700/40"
          style={{
            transform: `rotateX(-${openDeg}deg)`,
            transformOrigin: "top center",
            boxShadow: "0 -20px 40px -10px rgba(0,0,0,.6)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-2 rounded-xl border border-amber-600/30" />
        </div>

        {/* Plane flying out */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: `translateZ(60px)` }}>
          <g style={{ transform: `translate(${180 + openDeg*1.5}px, ${100 - openDeg*0.8}px) rotate(${-30 - openDeg*0.2}deg)`, transition: "transform .1s linear" }}>
            <path d="M0 0 L40 -10 L80 -4 L100 -2 L80 4 L40 10 Z M30 0 L20 -25 L10 -25 L18 0 Z M30 0 L20 25 L10 25 L18 0 Z"
              fill="url(#gold)" />
          </g>
          <defs>
            <linearGradient id="gold" x1="0" x2="1">
              <stop offset="0%" stopColor="#f6e3a3"/>
              <stop offset="50%" stopColor="#d9a441"/>
              <stop offset="100%" stopColor="#b67d2a"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
