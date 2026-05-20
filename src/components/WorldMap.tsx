/** Dotted world map with animated gold flight paths. */
export function WorldMap() {
  return (
    <svg viewBox="0 0 800 360" className="w-full h-auto opacity-90">
      <defs>
        <linearGradient id="goldLine" x1="0" x2="1">
          <stop offset="0%" stopColor="#f6e3a3" stopOpacity=".2"/>
          <stop offset="50%" stopColor="#f4d27a"/>
          <stop offset="100%" stopColor="#b67d2a" stopOpacity=".2"/>
        </linearGradient>
        <radialGradient id="dotG">
          <stop offset="0%" stopColor="#f4d27a"/>
          <stop offset="100%" stopColor="#b67d2a"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Dotted continents - sparse pattern */}
      <g fill="rgba(244,210,122,.35)">
        {Array.from({ length: 400 }).map((_, i) => {
          const x = (i * 53) % 800;
          const y = ((i * 37) % 320) + 20;
          // skew distribution to fake continents
          const inLand =
            (x > 80 && x < 280 && y > 60 && y < 200) ||
            (x > 320 && x < 460 && y > 60 && y < 180) ||
            (x > 480 && x < 700 && y > 70 && y < 220) ||
            (x > 200 && x < 330 && y > 200 && y < 320) ||
            (x > 580 && x < 720 && y > 230 && y < 320);
          if (!inLand) return null;
          return <circle key={i} cx={x} cy={y} r="1.5" />;
        })}
      </g>

      {/* Flight paths */}
      <path className="path-trail" d="M180 180 Q 320 60 500 140" stroke="url(#goldLine)" strokeWidth="2" fill="none" filter="url(#glow)" />
      <path className="path-trail" style={{ animationDelay: "1s" }} d="M250 150 Q 450 280 650 200" stroke="url(#goldLine)" strokeWidth="2" fill="none" filter="url(#glow)" />
      <path className="path-trail" style={{ animationDelay: "2s" }} d="M500 140 Q 600 80 700 130" stroke="url(#goldLine)" strokeWidth="2" fill="none" filter="url(#glow)" />

      {/* Destination dots */}
      {[[180,180],[500,140],[650,200],[250,150],[700,130],[400,260]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="url(#dotG)" className="pulse-dot" style={{ animationDelay: `${i*0.3}s` }} />
          <circle cx={x} cy={y} r="3" fill="#fff8e0"/>
        </g>
      ))}

      {/* Flying plane */}
      <g style={{ offsetPath: "path('M180 180 Q 320 60 500 140')", offsetRotate: "auto" } as React.CSSProperties}
         className="plane-flying">
        <path d="M-10 0 L10 -4 L18 0 L10 4 Z" fill="#f4d27a" filter="url(#glow)"/>
      </g>
    </svg>
  );
}
