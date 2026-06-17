export function MapBackground() {
  // Faint grid + a few soft color blobs and pin dots, mostly white.
  const blobs = [
    { cx: 180, cy: 110, r: 70, c: "#FCE7C8", o: 0.5 },
    { cx: 760, cy: 90, r: 90, c: "#FFE0E0", o: 0.45 },
    { cx: 520, cy: 260, r: 110, c: "#E4EEFF", o: 0.5 },
    { cx: 120, cy: 380, r: 80, c: "#E1F1DC", o: 0.5 },
    { cx: 820, cy: 420, r: 95, c: "#F1E6FA", o: 0.45 },
    { cx: 380, cy: 460, r: 70, c: "#FFE0E0", o: 0.4 },
  ];

  const dots = [
    { x: 90, y: 90, c: "#CC0000" },
    { x: 260, y: 170, c: "#1F9D55" },
    { x: 430, y: 110, c: "#CC0000" },
    { x: 610, y: 200, c: "#1F9D55" },
    { x: 740, y: 130, c: "#CC0000" },
    { x: 150, y: 290, c: "#1F9D55" },
    { x: 350, y: 330, c: "#CC0000" },
    { x: 500, y: 380, c: "#1F9D55" },
    { x: 680, y: 320, c: "#CC0000" },
    { x: 230, y: 440, c: "#1F9D55" },
    { x: 460, y: 470, c: "#CC0000" },
    { x: 770, y: 460, c: "#1F9D55" },
  ];

  const gridStep = 60;
  const hLines = Array.from({ length: 9 }, (_, i) => (i + 1) * gridStep);
  const vLines = Array.from({ length: 15 }, (_, i) => (i + 1) * gridStep);

  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <rect width="900" height="520" fill="#FFFFFF" />

      {/* Soft color blobs */}
      {blobs.map((b, i) => (
        <circle key={`b${i}`} cx={b.cx} cy={b.cy} r={b.r} fill={b.c} opacity={b.o} />
      ))}

      {/* Faint grid */}
      {hLines.map((y, i) => (
        <line key={`h${i}`} x1="0" y1={y} x2="900" y2={y} stroke="#EEEEEE" strokeWidth="1" />
      ))}
      {vLines.map((x, i) => (
        <line key={`v${i}`} x1={x} y1="0" x2={x} y2="520" stroke="#EEEEEE" strokeWidth="1" />
      ))}

      {/* Single warm diagonal accent */}
      <line x1="-50" y1="520" x2="950" y2="80" stroke="#F5C97A" strokeWidth="3" opacity="0.35" />
      <line x1="-50" y1="520" x2="950" y2="80" stroke="#F5B547" strokeWidth="1" opacity="0.5" strokeDasharray="5 7" />

      {/* Pin dots */}
      {dots.map((d, i) => (
        <g key={`d${i}`} opacity="0.55">
          <circle cx={d.x} cy={d.y} r={7} fill={d.c} opacity="0.18" />
          <circle cx={d.x} cy={d.y} r={3} fill={d.c} />
        </g>
      ))}
    </svg>
  );
}
