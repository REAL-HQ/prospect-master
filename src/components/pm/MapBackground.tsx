export function MapBackground() {
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
      <rect width="900" height="520" fill="#FAFAFA" />

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

      {/* Subtle pin dots scattered around the map */}
      {[
        { x: 90, y: 90 },
        { x: 260, y: 170 },
        { x: 430, y: 110 },
        { x: 610, y: 200 },
        { x: 740, y: 130 },
        { x: 150, y: 290 },
        { x: 350, y: 330 },
        { x: 500, y: 380 },
        { x: 680, y: 320 },
        { x: 230, y: 440 },
        { x: 460, y: 470 },
        { x: 770, y: 460 },
      ].map((d, i) => (
        <g key={`d${i}`} opacity="0.55">
          <circle cx={d.x} cy={d.y} r={7} fill="#CC0000" opacity="0.18" />
          <circle cx={d.x} cy={d.y} r={3} fill="#CC0000" />
        </g>
      ))}
    </svg>
  );
}
