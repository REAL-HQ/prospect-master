export function MapBackground() {
  const blocks = [
    // residential (green tint)
    { x: 20, y: 30, w: 110, h: 70, c: "#D6E8C8" },
    { x: 150, y: 40, w: 90, h: 60, c: "#D6E8C8" },
    { x: 30, y: 120, w: 80, h: 70, c: "#E2EED4" },
    { x: 130, y: 130, w: 110, h: 60, c: "#D6E8C8" },
    // commercial (warm)
    { x: 270, y: 30, w: 130, h: 90, c: "#FCE4B6" },
    { x: 420, y: 40, w: 100, h: 70, c: "#F9D9A0" },
    { x: 270, y: 140, w: 100, h: 70, c: "#FCE4B6" },
    { x: 390, y: 130, w: 130, h: 80, c: "#F9D9A0" },
    // water (blue) right side
    { x: 770, y: 20, w: 130, h: 220, c: "#BFE0F2" },
    // mixed mid
    { x: 540, y: 30, w: 100, h: 80, c: "#E8DCEF" },
    { x: 660, y: 40, w: 90, h: 70, c: "#F2D6DC" },
    { x: 540, y: 140, w: 110, h: 70, c: "#F2D6DC" },
    { x: 670, y: 130, w: 90, h: 80, c: "#E8DCEF" },

    // lower half
    { x: 20, y: 240, w: 100, h: 80, c: "#D6E8C8" },
    { x: 140, y: 250, w: 110, h: 70, c: "#E2EED4" },
    { x: 270, y: 240, w: 120, h: 80, c: "#FCE4B6" },
    { x: 410, y: 250, w: 100, h: 70, c: "#F9D9A0" },
    { x: 530, y: 240, w: 100, h: 80, c: "#E8DCEF" },
    { x: 650, y: 250, w: 110, h: 70, c: "#F2D6DC" },

    { x: 30, y: 350, w: 120, h: 80, c: "#E2EED4" },
    { x: 170, y: 360, w: 90, h: 70, c: "#D6E8C8" },
    { x: 280, y: 350, w: 110, h: 80, c: "#F9D9A0" },
    { x: 410, y: 360, w: 100, h: 70, c: "#FCE4B6" },
    { x: 530, y: 350, w: 120, h: 80, c: "#F2D6DC" },
    { x: 670, y: 360, w: 100, h: 70, c: "#E8DCEF" },
    { x: 790, y: 260, w: 100, h: 170, c: "#BFE0F2" },

    { x: 30, y: 450, w: 100, h: 60, c: "#D6E8C8" },
    { x: 150, y: 460, w: 130, h: 50, c: "#E2EED4" },
    { x: 300, y: 450, w: 110, h: 60, c: "#FCE4B6" },
    { x: 430, y: 460, w: 110, h: 50, c: "#F9D9A0" },
    { x: 560, y: 450, w: 100, h: 60, c: "#E8DCEF" },
    { x: 680, y: 460, w: 100, h: 50, c: "#F2D6DC" },
  ];

  const hRoads = [110, 225, 335, 445];
  const vRoads = [135, 260, 385, 525, 655, 780];

  // Decorative map pins (red dots scattered)
  const dots = [
    { x: 80, y: 70, r: 4 },
    { x: 200, y: 165, r: 3 },
    { x: 320, y: 90, r: 4 },
    { x: 470, y: 180, r: 3 },
    { x: 600, y: 80, r: 4 },
    { x: 700, y: 175, r: 3 },
    { x: 90, y: 290, r: 3 },
    { x: 240, y: 395, r: 4 },
    { x: 360, y: 290, r: 3 },
    { x: 500, y: 400, r: 4 },
    { x: 620, y: 295, r: 3 },
    { x: 740, y: 405, r: 4 },
    { x: 180, y: 485, r: 3 },
    { x: 460, y: 485, r: 4 },
    { x: 700, y: 485, r: 3 },
  ];

  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    >
      <rect width="900" height="520" fill="#F4EFE6" />
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} rx="3" opacity="0.85" />
      ))}
      {/* Roads */}
      {hRoads.map((y, i) => (
        <g key={`h${i}`}>
          <line x1="0" y1={y} x2="900" y2={y} stroke="#FFFFFF" strokeWidth="8" />
          <line x1="0" y1={y} x2="900" y2={y} stroke="#E8DFD0" strokeWidth="1" />
        </g>
      ))}
      {vRoads.map((x, i) => (
        <g key={`v${i}`}>
          <line x1={x} y1="0" x2={x} y2="520" stroke="#FFFFFF" strokeWidth="7" />
          <line x1={x} y1="0" x2={x} y2="520" stroke="#E8DFD0" strokeWidth="1" />
        </g>
      ))}
      {/* Highway diagonal */}
      <line x1="-50" y1="520" x2="950" y2="80" stroke="#FFD27A" strokeWidth="10" opacity="0.55" />
      <line x1="-50" y1="520" x2="950" y2="80" stroke="#F5B547" strokeWidth="1.5" opacity="0.7" strokeDasharray="6 6" />

      {/* Decorative pin dots */}
      {dots.map((d, i) => (
        <g key={`d${i}`}>
          <circle cx={d.x} cy={d.y} r={d.r + 4} fill="#CC0000" opacity="0.12" />
          <circle cx={d.x} cy={d.y} r={d.r} fill="#CC0000" />
          <circle cx={d.x} cy={d.y} r={d.r * 0.4} fill="#fff" />
        </g>
      ))}
    </svg>
  );
}
