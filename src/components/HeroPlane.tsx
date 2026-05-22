import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Calendar, Users, Search, ShieldCheck } from "lucide-react";

/**
 * Cinematic hero — gold private jet takeoff sequence.
 * Stage 1 (0 – 1.6s): plane lifts off (translateY from +260 to 0, scale 0.4 → 1)
 * Stage 2 (1.6s+):   texts, ribbon and search bar fade/slide in
 * Stage 3 (scroll):  plane keeps zooming forward as user scrolls
 */
export function HeroPlane() {
  const [scroll, setScroll] = useState(0);
  const [takeoff, setTakeoff] = useState(0); // 0 → 1 over ~1.6s
  const [reveal, setReveal] = useState(0); // texts reveal 0 → 1 after takeoff

  useEffect(() => {
    const onScroll = () => setScroll(Math.min(1, window.scrollY / 600));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const start = performance.now();
    const TAKEOFF_MS = 1600;
    const REVEAL_DELAY = 1200;
    const REVEAL_MS = 900;
    const tick = (t: number) => {
      const elapsed = t - start;
      const tp = Math.min(1, elapsed / TAKEOFF_MS);
      // ease-out cubic for liftoff
      setTakeoff(1 - Math.pow(1 - tp, 3));
      const rp = Math.min(1, Math.max(0, (elapsed - REVEAL_DELAY) / REVEAL_MS));
      setReveal(1 - Math.pow(1 - rp, 3));
      if (elapsed < TAKEOFF_MS + REVEAL_DELAY + REVEAL_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Takeoff: starts low on runway, scales up, slight roll
  const planeScale = 0.4 + takeoff * 0.7 + scroll * 0.4; // 0.4 → 1.1 → 1.5
  const planeY = (1 - takeoff) * 280 - scroll * 60; // rises from below
  const planeRot = (1 - takeoff) * 12 - scroll * 4; // nose-up on takeoff
  const planeBlur = (1 - takeoff) * 4; // motion blur eases out

  const textSplit = reveal + scroll * 0.4;

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-24 pb-32">
      {/* Sky / atmosphere gradient */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 35%, rgba(244,210,122,0.18), transparent 65%), radial-gradient(ellipse 80% 70% at 50% 100%, rgba(0,0,0,0.6), transparent 70%)",
        }}
      />

      {/* Runway light streaks during takeoff */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] h-[40%] -z-10 pointer-events-none"
        style={{
          opacity: (1 - takeoff) * 0.6,
          background:
            "linear-gradient(to top, rgba(244,210,122,0.25), transparent 80%)",
          filter: "blur(20px)",
        }}
      />

      {/* Drifting clouds */}
      <Clouds />

      {/* Sun glow behind plane */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,210,122,0.5) 0%, rgba(217,164,65,0.22) 35%, transparent 70%)",
          opacity: 0.4 + takeoff * 0.6,
        }}
      />

      {/* Mega split typography — appears after takeoff */}
      <div className="absolute inset-0 flex items-center justify-between px-6 md:px-16 pointer-events-none select-none">
        <div
          className="text-right"
          style={{
            transform: `translateX(${-textSplit * 40 - (1 - reveal) * 60}px)`,
            opacity: reveal,
            transition: "opacity .6s",
          }}
        >
          <div
            className="font-black leading-[0.85] tracking-tight gold-text"
            style={{ fontSize: "clamp(60px, 11vw, 180px)", textShadow: "0 10px 60px rgba(244,210,122,.25)" }}
          >
            الرحال
          </div>
          <div
            className="font-light text-amber-100/70 mt-2"
            style={{ fontSize: "clamp(18px, 1.6vw, 26px)", letterSpacing: ".15em" }}
          >
            رحلات • فخامة • ثقة
          </div>
        </div>
        <div
          className="text-left"
          style={{
            transform: `translateX(${textSplit * 40 + (1 - reveal) * 60}px)`,
            opacity: reveal,
            transition: "opacity .6s",
          }}
        >
          <div
            className="font-black leading-[0.85] tracking-tight gold-text"
            style={{
              fontSize: "clamp(60px, 11vw, 180px)",
              textShadow: "0 10px 60px rgba(244,210,122,.25)",
            }}
          >
            برو
          </div>
          <div
            className="font-light text-amber-100/70 mt-2 text-right"
            style={{ fontSize: "clamp(18px, 1.6vw, 26px)", letterSpacing: ".15em" }}
          >
            PRO TRAVEL
          </div>
        </div>
      </div>

      {/* Front-view airplane — takes off first */}
      <div
        className="relative z-10"
        style={{
          transform: `translateY(${planeY}px) scale(${planeScale}) rotate(${planeRot}deg)`,
          transition: "transform .08s linear",
          filter: `drop-shadow(0 40px 60px rgba(0,0,0,.7)) drop-shadow(0 0 50px rgba(244,210,122,.45)) blur(${planeBlur}px)`,
        }}
      >
        <FrontPlaneSVG />
      </div>

      {/* Sub-headline + ribbon */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 text-center px-6"
        style={{ bottom: "180px", opacity: reveal, transform: `translate(-50%, ${(1 - reveal) * 20}px)` }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-black/40 backdrop-blur-md text-amber-200 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" /> منصة السفر الفاخرة الأولى عربياً
        </div>
      </div>

      {/* Floating search bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 w-[min(1100px,94vw)]"
        style={{
          bottom: "40px",
          transform: `translate(-50%, ${(1 - reveal) * 60}px)`,
          opacity: reveal,
        }}
      >
        <div
          className="rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 border border-amber-400/30 shadow-2xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,22,16,0.85), rgba(20,16,12,0.92))",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.8), 0 0 40px -10px rgba(244,210,122,.25)",
          }}
        >
          <SearchField icon={MapPin} label="من" placeholder="مطار الانطلاق" />
          <Divider />
          <SearchField icon={MapPin} label="إلى" placeholder="مطار الوصول" />
          <Divider />
          <SearchField icon={Calendar} label="التاريخ" placeholder="موعد الإقلاع" />
          <Divider />
          <SearchField icon={Users} label="المسافرون" placeholder="مسافر واحد" />
          <Link
            to="/login"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-background"
            style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}
          >
            <Search className="w-4 h-4" />
            بحث
          </Link>
        </div>
      </div>
    </section>
  );
}

function SearchField({ icon: Icon, label, placeholder }: { icon: any; label: string; placeholder: string }) {
  return (
    <div className="flex-1 min-w-0 flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-amber-400/5 transition cursor-pointer">
      <Icon className="w-5 h-5 text-amber-300 shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-amber-300/80">{label}</div>
        <div className="text-sm font-semibold text-foreground/90 truncate">{placeholder}</div>
      </div>
    </div>
  );
}
function Divider() {
  return <div className="hidden md:block w-px bg-amber-400/15 my-2" />;
}

function Clouds() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {[
        { top: "18%", left: "-10%", scale: 1.1, dur: 60, op: 0.18 },
        { top: "30%", left: "70%",  scale: 0.7, dur: 75, op: 0.14 },
        { top: "55%", left: "-5%",  scale: 0.9, dur: 90, op: 0.12 },
        { top: "65%", left: "75%",  scale: 1.2, dur: 100, op: 0.16 },
        { top: "8%",  left: "40%",  scale: 0.6, dur: 80, op: 0.1 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: c.left,
            transform: `scale(${c.scale})`,
            opacity: c.op,
            animation: `cloud-drift ${c.dur}s linear infinite`,
            animationDelay: `${-i * 12}s`,
          }}
        >
          <CloudSVG />
        </div>
      ))}
    </div>
  );
}

function CloudSVG() {
  return (
    <svg width="280" height="120" viewBox="0 0 280 120" fill="none">
      <ellipse cx="140" cy="70" rx="120" ry="35" fill="white" />
      <ellipse cx="80" cy="60" rx="50" ry="35" fill="white" />
      <ellipse cx="180" cy="50" rx="60" ry="40" fill="white" />
      <ellipse cx="220" cy="65" rx="40" ry="28" fill="white" />
    </svg>
  );
}

/** Front-view private jet — fully gold, color-matched to the logo. */
function FrontPlaneSVG() {
  return (
    <svg
      width="min(720px, 80vw)"
      height="auto"
      viewBox="0 0 600 420"
      style={{ width: "min(720px, 80vw)", height: "auto" }}
    >
      <defs>
        {/* Polished gold body with realistic highlight */}
        <linearGradient id="goldFuselage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4c8" />
          <stop offset="22%" stopColor="#f6e3a3" />
          <stop offset="50%" stopColor="#d9a441" />
          <stop offset="78%" stopColor="#a87324" />
          <stop offset="100%" stopColor="#6a4615" />
        </linearGradient>
        <linearGradient id="goldFuselageSide" x1="0" x2="1">
          <stop offset="0%" stopColor="#8a5a1f" />
          <stop offset="50%" stopColor="#f6e3a3" />
          <stop offset="100%" stopColor="#8a5a1f" />
        </linearGradient>
        <linearGradient id="goldWing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4d27a" />
          <stop offset="50%" stopColor="#b67d2a" />
          <stop offset="100%" stopColor="#4a300d" />
        </linearGradient>
        <linearGradient id="goldEngine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e3a3" />
          <stop offset="55%" stopColor="#a87324" />
          <stop offset="100%" stopColor="#3a2308" />
        </linearGradient>
        <linearGradient id="cockpit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2230" />
          <stop offset="100%" stopColor="#0a0d14" />
        </linearGradient>
        <radialGradient id="engineGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff4c8" stopOpacity="1" />
          <stop offset="50%" stopColor="#f4d27a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="goldTrim" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff4c8" />
          <stop offset="50%" stopColor="#d9a441" />
          <stop offset="100%" stopColor="#6a4615" />
        </linearGradient>
        <filter id="goldShine">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Wings */}
      <path
        d="M 60 260 L 230 235 L 280 250 L 280 275 L 220 285 L 60 290 Z"
        fill="url(#goldWing)"
        stroke="#3a2308"
        strokeWidth="1"
      />
      <path
        d="M 540 260 L 370 235 L 320 250 L 320 275 L 380 285 L 540 290 Z"
        fill="url(#goldWing)"
        stroke="#3a2308"
        strokeWidth="1"
      />
      {/* Wing highlights */}
      <path d="M 70 263 L 228 240 L 278 252" stroke="#fff4c8" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M 530 263 L 372 240 L 322 252" stroke="#fff4c8" strokeWidth="1.2" fill="none" opacity="0.6" />
      {/* Wing tip lights */}
      <circle cx="62" cy="275" r="3" fill="#ff5252" />
      <circle cx="538" cy="275" r="3" fill="#4ade80" />

      {/* Engines */}
      <g>
        <ellipse cx="180" cy="320" rx="38" ry="42" fill="url(#goldEngine)" stroke="#3a2308" strokeWidth="1.5" />
        <ellipse cx="180" cy="320" rx="28" ry="32" fill="#1a0f04" />
        <circle cx="180" cy="320" r="22" fill="url(#engineGlow)" />
        <circle cx="180" cy="320" r="7" fill="#fff4c8" />
        <ellipse cx="170" cy="305" rx="6" ry="14" fill="#fff4c8" opacity="0.35" />
      </g>
      <g>
        <ellipse cx="420" cy="320" rx="38" ry="42" fill="url(#goldEngine)" stroke="#3a2308" strokeWidth="1.5" />
        <ellipse cx="420" cy="320" rx="28" ry="32" fill="#1a0f04" />
        <circle cx="420" cy="320" r="22" fill="url(#engineGlow)" />
        <circle cx="420" cy="320" r="7" fill="#fff4c8" />
        <ellipse cx="410" cy="305" rx="6" ry="14" fill="#fff4c8" opacity="0.35" />
      </g>

      {/* Fuselage — gold body */}
      <path
        d="M 270 60 Q 300 50 330 60 L 345 240 Q 345 320 320 380 Q 300 395 280 380 Q 255 320 255 240 Z"
        fill="url(#goldFuselage)"
        stroke="#3a2308"
        strokeWidth="1.5"
      />
      {/* Side shading for 3D feel */}
      <path
        d="M 255 240 Q 255 320 280 380 Q 290 388 295 386 L 295 70 Q 282 66 270 70 Z"
        fill="#000"
        opacity="0.18"
      />
      <path
        d="M 345 240 Q 345 320 320 380 Q 310 388 305 386 L 305 70 Q 318 66 330 70 Z"
        fill="#fff4c8"
        opacity="0.18"
      />
      {/* Bright vertical highlight */}
      <path
        d="M 298 80 Q 300 220 300 380"
        stroke="#fff4c8"
        strokeWidth="2"
        fill="none"
        opacity="0.55"
        filter="url(#goldShine)"
      />
      {/* Gold pinstripes along edges */}
      <path
        d="M 258 240 Q 258 320 285 385 M 342 240 Q 342 320 315 385"
        stroke="url(#goldTrim)"
        strokeWidth="2"
        fill="none"
      />

      {/* Cockpit windshield */}
      <path
        d="M 278 80 Q 300 70 322 80 L 328 130 Q 300 122 272 130 Z"
        fill="url(#cockpit)"
        stroke="#f4d27a"
        strokeWidth="1.2"
      />
      <path d="M 285 90 Q 300 85 315 90 L 318 115 Q 300 110 282 115 Z" fill="#fff4c8" opacity="0.22" />

      {/* Tail fin */}
      <path
        d="M 290 50 L 310 50 L 305 5 L 295 5 Z"
        fill="url(#goldFuselage)"
        stroke="#3a2308"
        strokeWidth="1"
      />
      <line x1="300" y1="15" x2="300" y2="45" stroke="url(#goldTrim)" strokeWidth="1.5" />

      {/* Nose light */}
      <circle cx="300" cy="385" r="5" fill="#fff8e0" />

      {/* Cabin windows — small dark portholes */}
      {[170, 200, 230, 260, 290, 320, 350].map((y, i) => (
        <g key={i}>
          <circle cx={272 + i * 0.3} cy={y} r="2.6" fill="#1a0f04" />
          <circle cx={328 - i * 0.3} cy={y} r="2.6" fill="#1a0f04" />
        </g>
      ))}
    </svg>
  );
}
