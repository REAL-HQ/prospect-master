export function MapBackground() {
  // Generate building rects + roads
  const buildings = [
    { x: 30, y: 40, w: 70, h: 50, c: "#ccc8c0", o: 0.42 },
    { x: 120, y: 30, w: 90, h: 70, c: "#d4d0c8", o: 0.38 },
    { x: 230, y: 50, w: 60, h: 40, c: "#ccc8c0", o: 0.46 },
    { x: 310, y: 30, w: 110, h: 80, c: "#d4d0c8", o: 0.4 },
    { x: 440, y: 40, w: 80, h: 60, c: "#ccc8c0", o: 0.44 },
    { x: 540, y: 30, w: 70, h: 50, c: "#d4d0c8", o: 0.38 },
    { x: 630, y: 50, w: 90, h: 70, c: "#ccc8c0", o: 0.42 },
    { x: 740, y: 30, w: 130, h: 90, c: "#d4d0c8", o: 0.36 },

    { x: 40, y: 150, w: 100, h: 80, c: "#ccc8c0", o: 0.4 },
    { x: 160, y: 160, w: 70, h: 60, c: "#d4d0c8", o: 0.44 },
    { x: 250, y: 150, w: 80, h: 70, c: "#ccc8c0", o: 0.4 },
    { x: 350, y: 170, w: 110, h: 70, c: "#d4d0c8", o: 0.38 },
    { x: 480, y: 150, w: 90, h: 80, c: "#ccc8c0", o: 0.42 },
    { x: 590, y: 160, w: 70, h: 60, c: "#d4d0c8", o: 0.46 },
    { x: 680, y: 150, w: 100, h: 80, c: "#ccc8c0", o: 0.4 },
    { x: 800, y: 170, w: 70, h: 60, c: "#d4d0c8", o: 0.36 },

    { x: 30, y: 280, w: 80, h: 60, c: "#ccc8c0", o: 0.44 },
    { x: 130, y: 290, w: 110, h: 50, c: "#d4d0c8", o: 0.4 },
    { x: 260, y: 280, w: 70, h: 70, c: "#ccc8c0", o: 0.42 },
    { x: 350, y: 300, w: 90, h: 60, c: "#d4d0c8", o: 0.38 },
    { x: 460, y: 280, w: 100, h: 70, c: "#ccc8c0", o: 0.44 },
    { x: 580, y: 290, w: 80, h: 60, c: "#d4d0c8", o: 0.4 },
    { x: 680, y: 280, w: 90, h: 70, c: "#ccc8c0", o: 0.42 },
    { x: 790, y: 300, w: 80, h: 50, c: "#d4d0c8", o: 0.36 },

    { x: 50, y: 400, w: 90, h: 70, c: "#ccc8c0", o: 0.4 },
    { x: 160, y: 410, w: 80, h: 60, c: "#d4d0c8", o: 0.42 },
    { x: 260, y: 400, w: 110, h: 80, c: "#ccc8c0", o: 0.44 },
    { x: 390, y: 420, w: 70, h: 50, c: "#d4d0c8", o: 0.38 },
    { x: 480, y: 400, w: 100, h: 70, c: "#ccc8c0", o: 0.42 },
    { x: 600, y: 410, w: 80, h: 60, c: "#d4d0c8", o: 0.4 },
    { x: 700, y: 400, w: 90, h: 70, c: "#ccc8c0", o: 0.44 },
    { x: 810, y: 420, w: 60, h: 50, c: "#d4d0c8", o: 0.38 },
  ];

  const hRoads = [120, 250, 370, 490]; // y positions
  const vRoads = [110, 240, 340, 460, 580, 680, 790]; // x positions

  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    >
      <rect width="900" height="520" fill="#FAF8F5" />
      {buildings.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={b.c}
          opacity={b.o * 0.55}
          rx="2"
        />
      ))}
      {hRoads.map((y, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={y}
          x2="900"
          y2={y}
          stroke="#c8c4bc"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      {vRoads.map((x, i) => (
        <line
          key={`v${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2="520"
          stroke="#c8c4bc"
          strokeWidth="1"
          opacity="0.35"
        />
      ))}
      {/* Warm diagonal rays */}
      <line x1="-50" y1="520" x2="950" y2="80" stroke="#F5C97A" strokeWidth="3" opacity="0.35" />
      <line x1="-50" y1="600" x2="950" y2="180" stroke="#F5C97A" strokeWidth="2" opacity="0.22" />
    </svg>
  );
}
