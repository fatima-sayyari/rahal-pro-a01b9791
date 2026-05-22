import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plane as PlaneIcon, MapPin, Calendar, Users, Search, ShieldCheck } from "lucide-react";

/**
 * Cinematic hero inspired by the "Flying Private — Made Simple" reference.
 * - Front-view airplane centered, scales/zooms forward on mount + scroll
 * - Split mega-typography: right & left of the plane
 * - Drifting clouds parallax
 * - Floating glass search bar at bottom
 */
export function HeroPlane() {
  const [scroll, setScroll] = useState(0);
  const [mounted, setMounted] = useState(0);

  useEffect(() => {
    const onScroll = () => setScroll(Math.min(1, window.scrollY / 600));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // mount-in animation (0 -> 1 over ~1.4s)
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      // ease-out cubic
      const e = 1 - Math.pow(1 - p, 3);
      setMounted(e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Plane: starts small/far, zooms forward
  const planeScale = 0.55 + mounted * 0.55 + scroll * 0.4; // 0.55 → 1.1 → 1.5
  const planeY = (1 - mounted) * 80 - scroll * 60;
  const planeRot = (1 - mounted) * -8;

  // Typography parallax (split apart as plane comes forward)
  const textSplit = mounted * 1 + scroll * 0.4;
  const textOpacity = mounted;

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

      {/* Drifting clouds */}
      <Clouds />

      {/* Sun glow behind plane */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,210,122,0.45) 0%, rgba(217,164,65,0.2) 35%, transparent 70%)",
          opacity: 0.6 + mounted * 0.4,
        }}
      />

      {/* Mega split typography */}
      <div className="absolute inset-0 flex items-center justify-between px-6 md:px-16 pointer-events-none select-none">
        <div
          className="text-right"
          style={{
            transform: `translateX(${-textSplit * 40}px)`,
            opacity: textOpacity,
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
            transform: `translateX(${textSplit * 40}px)`,
            opacity: textOpacity,
            transition: "opacity .6s",
          }}
        >
          <div
            className="font-black leading-[0.85] tracking-tight"
            style={{
              fontSize: "clamp(60px, 11vw, 180px)",
              background: "linear-gradient(180deg, #fff 0%, #d9d4c4 60%, #b9a978 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 10px 60px rgba(255,255,255,.1)",
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

      {/* Front-view airplane */}
      <div
        className="relative z-10"
        style={{
          transform: `translateY(${planeY}px) scale(${planeScale}) rotate(${planeRot}deg)`,
          transition: "transform .08s linear",
          filter: `drop-shadow(0 40px 60px rgba(0,0,0,.7)) drop-shadow(0 0 40px rgba(244,210,122,.3))`,
        }}
      >
        <FrontPlaneSVG />
      </div>

      {/* Sub-headline + ribbon */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 text-center px-6"
        style={{ bottom: "180px", opacity: mounted }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-black/40 backdrop-blur-md text-amber-200 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" /> منصة السفر الفاخرة الأولى عربياً
        </div>
      </div>

      {/* Floating search bar (like reference) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 w-[min(1100px,94vw)]"
        style={{
          bottom: "40px",
          transform: `translate(-50%, ${(1 - mounted) * 40}px)`,
          opacity: mounted,
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

/** Detailed front-view private jet inspired by the reference video. */
function FrontPlaneSVG() {
  return (
    <svg
      width="min(720px, 80vw)"
      height="auto"
      viewBox="0 0 600 420"
      style={{ width: "min(720px, 80vw)", height: "auto" }}
    >
      <defs>
        <linearGradient id="fuselage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="50%" stopColor="#cfcfd2" />
          <stop offset="100%" stopColor="#6e6e74" />
        </linearGradient>
        <linearGradient id="wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9aa0" />
          <stop offset="60%" stopColor="#3d3d42" />
          <stop offset="100%" stopColor="#15151a" />
        </linearGradient>
        <linearGradient id="cockpit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2230" />
          <stop offset="100%" stopColor="#0a0d14" />
        </linearGradient>
        <linearGradient id="engine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a40" />
          <stop offset="100%" stopColor="#0a0a0e" />
        </linearGradient>
        <radialGradient id="engineGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f4d27a" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#d9a441" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="goldTrim" x1="0" x2="1">
          <stop offset="0%" stopColor="#f6e3a3" />
          <stop offset="50%" stopColor="#d9a441" />
          <stop offset="100%" stopColor="#b67d2a" />
        </linearGradient>
      </defs>

      {/* Wings (behind fuselage) */}
      <path
        d="M 60 260 L 230 235 L 280 250 L 280 275 L 220 285 L 60 290 Z"
        fill="url(#wing)"
        stroke="#0a0a0e"
        strokeWidth="1"
      />
      <path
        d="M 540 260 L 370 235 L 320 250 L 320 275 L 380 285 L 540 290 Z"
        fill="url(#wing)"
        stroke="#0a0a0e"
        strokeWidth="1"
      />
      {/* Wing tip lights */}
      <circle cx="62" cy="275" r="3" fill="#ff5252" />
      <circle cx="538" cy="275" r="3" fill="#4ade80" />

      {/* Engines under wings */}
      <g>
        <ellipse cx="180" cy="320" rx="38" ry="42" fill="url(#engine)" stroke="#0a0a0e" strokeWidth="1.5" />
        <ellipse cx="180" cy="320" rx="28" ry="32" fill="#000" />
        <circle cx="180" cy="320" r="22" fill="url(#engineGlow)" opacity="0.6" />
        <circle cx="180" cy="320" r="6" fill="#f4d27a" opacity="0.9" />
      </g>
      <g>
        <ellipse cx="420" cy="320" rx="38" ry="42" fill="url(#engine)" stroke="#0a0a0e" strokeWidth="1.5" />
        <ellipse cx="420" cy="320" rx="28" ry="32" fill="#000" />
        <circle cx="420" cy="320" r="22" fill="url(#engineGlow)" opacity="0.6" />
        <circle cx="420" cy="320" r="6" fill="#f4d27a" opacity="0.9" />
      </g>

      {/* Fuselage (front view, tapering body) */}
      <path
        d="M 270 60 Q 300 50 330 60 L 345 240 Q 345 320 320 380 Q 300 395 280 380 Q 255 320 255 240 Z"
        fill="url(#fuselage)"
        stroke="#3a3a40"
        strokeWidth="1.5"
      />
      {/* Gold pinstripe */}
      <path
        d="M 258 240 Q 258 320 285 385 M 342 240 Q 342 320 315 385"
        stroke="url(#goldTrim)"
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />

      {/* Cockpit windshield */}
      <path
        d="M 278 80 Q 300 70 322 80 L 328 130 Q 300 122 272 130 Z"
        fill="url(#cockpit)"
        stroke="#f4d27a"
        strokeWidth="1"
        opacity="0.95"
      />
      <path d="M 285 90 Q 300 85 315 90 L 318 115 Q 300 110 282 115 Z" fill="#f4d27a" opacity="0.15" />

      {/* Tail fin behind */}
      <path
        d="M 290 50 L 310 50 L 305 5 L 295 5 Z"
        fill="url(#fuselage)"
        stroke="#3a3a40"
        strokeWidth="1"
      />
      <line x1="300" y1="15" x2="300" y2="45" stroke="url(#goldTrim)" strokeWidth="1.5" />

      {/* Nose light */}
      <circle cx="300" cy="385" r="4" fill="#fff8e0" opacity="0.9" />

      {/* Subtle window dots on body */}
      {[170, 200, 230, 260, 290, 320, 350].map((y, i) => (
        <g key={i}>
          <circle cx={272 + i * 0.3} cy={y} r="2.5" fill="#1b2230" opacity="0.7" />
          <circle cx={328 - i * 0.3} cy={y} r="2.5" fill="#1b2230" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}
