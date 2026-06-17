export function MapBackground() {
  // Small green parks scattered around
  const parks = [
    { x: 80, y: 60, w: 50, h: 35 },
    { x: 280, y: 40, w: 60, h: 40 },
    { x: 470, y: 150, w: 55, h: 38 },
    { x: 700, y: 90, w: 45, h: 30 },
    { x: 180, y: 280, w: 50, h: 35 },
    { x: 540, y: 360, w: 70, h: 45 },
    { x: 780, y: 320, w: 50, h: 35 },
    { x: 100, y: 450, w: 60, h: 40 },
    { x: 380, y: 470, w: 55, h: 38 },
    { x: 820, y: 470, w: 45, h: 35 },
  ];

  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Tan/beige map base */}
      <rect width="900" height="520" fill="#E8E2D5" />

      {/* Water body on the left edge */}
      <path
        d="M -20 80 Q 30 140 20 220 T 40 360 Q 30 440 -20 520 L -40 520 L -40 60 Z"
        fill="#A8D0E8"
      />
      <path
        d="M -20 80 Q 30 140 20 220 T 40 360 Q 30 440 -20 520"
        stroke="#8DBED9"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Parks */}
      {parks.map((p, i) => (
        <rect key={`p${i}`} x={p.x} y={p.y} width={p.w} height={p.h} rx={3} fill="#C8DEB8" />
      ))}

      {/* Rotated street grid - creates the diagonal block pattern from the reference */}
      <g transform="rotate(-12 450 260)">
        {/* Main avenues (thicker) */}
        {[-40, 60, 160, 260, 360, 460, 560].map((y, i) => (
          <line
            key={`av${i}`}
            x1="-200"
            y1={y}
            x2="1100"
            y2={y}
            stroke="#FFFFFF"
            strokeWidth="11"
          />
        ))}
        {/* Cross streets (thinner) */}
        {[-100, 10, 110, 210, 310, 410, 510, 610].map((y, i) => (
          <line
            key={`cs${i}`}
            x1="-200"
            y1={y + 50}
            x2="1100"
            y2={y + 50}
            stroke="#FFFFFF"
            strokeWidth="5"
            opacity="0.85"
          />
        ))}
        {/* Vertical streets */}
        {[-100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((x, i) => (
          <line
            key={`vs${i}`}
            x1={x}
            y1="-200"
            x2={x}
            y2="800"
            stroke="#FFFFFF"
            strokeWidth="9"
          />
        ))}
        {/* Vertical cross streets (thinner) */}
        {[-50, 50, 150, 250, 350, 450, 550, 650, 750, 850, 950].map((x, i) => (
          <line
            key={`vcs${i}`}
            x1={x}
            y1="-200"
            x2={x}
            y2="800"
            stroke="#FFFFFF"
            strokeWidth="4"
            opacity="0.8"
          />
        ))}
      </g>
    </svg>
  );
}
