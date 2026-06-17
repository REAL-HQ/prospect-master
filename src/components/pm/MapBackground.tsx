export function MapBackground() {
  const gridStep = 60;
  const hLines = Array.from({ length: 9 }, (_, i) => (i + 1) * gridStep);
  const vLines = Array.from({ length: 15 }, (_, i) => (i + 1) * gridStep);

  // Gray building blocks representing businesses on the map
  const buildings = [
    { x: 40, y: 40, w: 35, h: 25 },
    { x: 90, y: 85, w: 28, h: 22 },
    { x: 160, y: 30, w: 40, h: 30 },
    { x: 220, y: 120, w: 32, h: 24 },
    { x: 300, y: 70, w: 45, h: 28 },
    { x: 380, y: 140, w: 30, h: 20 },
    { x: 450, y: 50, w: 38, h: 26 },
    { x: 520, y: 110, w: 35, h: 25 },
    { x: 600, y: 60, w: 42, h: 32 },
    { x: 680, y: 150, w: 30, h: 22 },
    { x: 750, y: 40, w: 36, h: 28 },
    { x: 820, y: 100, w: 28, h: 20 },
    { x: 50, y: 200, w: 40, h: 30 },
    { x: 130, y: 260, w: 32, h: 24 },
    { x: 210, y: 210, w: 35, h: 26 },
    { x: 280, y: 280, w: 45, h: 30 },
    { x: 360, y: 220, w: 30, h: 22 },
    { x: 430, y: 290, w: 38, h: 28 },
    { x: 510, y: 240, w: 34, h: 26 },
    { x: 580, y: 310, w: 40, h: 30 },
    { x: 660, y: 250, w: 32, h: 24 },
    { x: 740, y: 320, w: 36, h: 28 },
    { x: 810, y: 220, w: 30, h: 22 },
    { x: 80, y: 350, w: 42, h: 32 },
    { x: 160, y: 400, w: 35, h: 26 },
    { x: 240, y: 340, w: 30, h: 22 },
    { x: 320, y: 420, w: 40, h: 30 },
    { x: 400, y: 360, w: 34, h: 26 },
    { x: 480, y: 430, w: 38, h: 28 },
    { x: 560, y: 370, w: 32, h: 24 },
    { x: 640, y: 440, w: 36, h: 28 },
    { x: 720, y: 380, w: 30, h: 22 },
    { x: 800, y: 460, w: 42, h: 32 },
    { x: 860, y: 350, w: 28, h: 20 },
    { x: 110, y: 480, w: 35, h: 26 },
    { x: 280, y: 490, w: 40, h: 28 },
    { x: 450, y: 490, w: 32, h: 24 },
    { x: 600, y: 500, w: 38, h: 28 },
    { x: 780, y: 500, w: 30, h: 22 },
  ];

  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <rect width="900" height="520" fill="#FAFAFA" />

      {/* Lake */}
      <path
        d="M -20 320 Q 60 280 120 310 T 240 340 Q 320 380 400 340 T 520 320 Q 600 290 680 340 T 820 360 L 900 380 L 900 520 L -20 520 Z"
        fill="#B8D4E8"
        opacity="0.35"
      />
      <path
        d="M -20 350 Q 80 320 160 360 T 300 380 Q 400 410 480 370 T 620 360 Q 720 330 800 390 L 900 420 L 900 520 L -20 520 Z"
        fill="#A8C8E0"
        opacity="0.2"
      />

      {/* Gray building blocks */}
      {buildings.map((b, i) => (
        <rect
          key={`bld${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={3}
          fill="#E0E0E0"
          opacity="0.6"
        />
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

      {/* Subtle background pin dots scattered around the map */}
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
        <g key={`d${i}`} opacity="0.4">
          <circle cx={d.x} cy={d.y} r={7} fill="#CC0000" opacity="0.12" />
          <circle cx={d.x} cy={d.y} r={3} fill="#CC0000" />
        </g>
      ))}
    </svg>
  );
}
