export function MapBackground() {
  // Gray building blocks scattered across the map
  const buildings = [
    { x: 40, y: 40, w: 60, h: 40 }, { x: 115, y: 50, w: 45, h: 30 },
    { x: 180, y: 30, w: 70, h: 45 }, { x: 270, y: 45, w: 50, h: 35 },
    { x: 340, y: 30, w: 80, h: 50 }, { x: 440, y: 50, w: 55, h: 35 },
    { x: 515, y: 35, w: 65, h: 45 }, { x: 600, y: 45, w: 50, h: 35 },
    { x: 670, y: 30, w: 75, h: 50 }, { x: 765, y: 50, w: 50, h: 35 },
    { x: 830, y: 35, w: 55, h: 45 },
    { x: 40, y: 110, w: 50, h: 40 }, { x: 105, y: 120, w: 65, h: 35 },
    { x: 190, y: 105, w: 55, h: 45 }, { x: 265, y: 120, w: 70, h: 35 },
    { x: 355, y: 110, w: 50, h: 40 }, { x: 425, y: 120, w: 60, h: 35 },
    { x: 505, y: 105, w: 55, h: 45 }, { x: 580, y: 120, w: 70, h: 35 },
    { x: 670, y: 110, w: 50, h: 40 }, { x: 740, y: 120, w: 65, h: 35 },
    { x: 825, y: 105, w: 55, h: 45 },
    { x: 40, y: 185, w: 70, h: 45 }, { x: 130, y: 195, w: 50, h: 35 },
    { x: 200, y: 180, w: 60, h: 50 }, { x: 280, y: 195, w: 55, h: 35 },
    { x: 355, y: 185, w: 75, h: 45 }, { x: 450, y: 195, w: 50, h: 35 },
    { x: 520, y: 185, w: 65, h: 45 }, { x: 605, y: 195, w: 55, h: 35 },
    { x: 680, y: 185, w: 60, h: 45 }, { x: 760, y: 195, w: 50, h: 35 },
    { x: 830, y: 185, w: 60, h: 45 },
    { x: 40, y: 270, w: 55, h: 40 }, { x: 115, y: 280, w: 70, h: 35 },
    { x: 205, y: 265, w: 50, h: 45 }, { x: 275, y: 280, w: 60, h: 35 },
    { x: 355, y: 270, w: 55, h: 40 }, { x: 430, y: 280, w: 75, h: 35 },
    { x: 525, y: 265, w: 50, h: 45 }, { x: 595, y: 280, w: 60, h: 35 },
    { x: 675, y: 270, w: 70, h: 40 }, { x: 765, y: 280, w: 50, h: 35 },
    { x: 835, y: 265, w: 55, h: 45 },
    { x: 40, y: 355, w: 65, h: 40 }, { x: 125, y: 365, w: 50, h: 30 },
    { x: 195, y: 350, w: 70, h: 45 }, { x: 285, y: 365, w: 55, h: 30 },
    { x: 360, y: 355, w: 60, h: 40 }, { x: 440, y: 365, w: 50, h: 30 },
    { x: 510, y: 350, w: 70, h: 45 }, { x: 600, y: 365, w: 55, h: 30 },
    { x: 675, y: 355, w: 60, h: 40 }, { x: 755, y: 365, w: 50, h: 30 },
    { x: 825, y: 350, w: 65, h: 45 },
    { x: 60, y: 435, w: 70, h: 45 }, { x: 150, y: 445, w: 55, h: 35 },
    { x: 225, y: 435, w: 65, h: 45 }, { x: 310, y: 445, w: 50, h: 35 },
    { x: 380, y: 435, w: 70, h: 45 }, { x: 470, y: 445, w: 55, h: 35 },
  ];

  // Parks / green spaces
  const parks = [
    { x: 25, y: 60, w: 55, h: 38, r: 4 },
    { x: 380, y: 200, w: 65, h: 45, r: 6 },
    { x: 720, y: 360, w: 80, h: 50, r: 6 },
    { x: 250, y: 410, w: 50, h: 35, r: 4 },
  ];

  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Base map color */}
      <rect width="900" height="520" fill="#E8E6E1" />

      {/* Parks (green) */}
      {parks.map((p, i) => (
        <rect key={`p${i}`} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.r} fill="#C9E4C5" />
      ))}

      {/* Gray building blocks */}
      {buildings.map((b, i) => (
        <rect
          key={`bld${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={2}
          fill="#D4D2CD"
        />
      ))}

      {/* White street grid - horizontals */}
      {[85, 160, 245, 325, 410, 495].map((y, i) => (
        <line key={`sh${i}`} x1="0" y1={y} x2="900" y2={y} stroke="#FFFFFF" strokeWidth="10" />
      ))}
      {/* White street grid - verticals */}
      {[100, 185, 260, 345, 420, 500, 585, 660, 745, 820].map((x, i) => (
        <line key={`sv${i}`} x1={x} y1="0" x2={x} y2="520" stroke="#FFFFFF" strokeWidth="10" />
      ))}

      {/* Thinner cross streets */}
      {[120, 205, 290, 370, 455].map((y, i) => (
        <line key={`th${i}`} x1="0" y1={y} x2="900" y2={y} stroke="#FFFFFF" strokeWidth="4" opacity="0.7" />
      ))}

      {/* Orange highway diagonals */}
      <path d="M -20 380 L 380 -20" stroke="#F5B96B" strokeWidth="14" fill="none" opacity="0.85" />
      <path d="M -20 380 L 380 -20" stroke="#F4A94A" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="2 10" />

      <path d="M 540 540 L 940 140" stroke="#F5B96B" strokeWidth="14" fill="none" opacity="0.85" />
      <path d="M 540 540 L 940 140" stroke="#F4A94A" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="2 10" />

      {/* Blue river diagonal across lower right */}
      <path
        d="M 600 540 Q 700 460 780 420 T 940 320 L 940 540 Z"
        fill="#9CC8E8"
      />
      <path
        d="M 600 540 Q 700 460 780 420 T 940 320"
        stroke="#7FB5DC"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* River banks - small green strip */}
      <path
        d="M 605 540 Q 705 462 785 422 T 945 322"
        stroke="#B8D9B0"
        strokeWidth="6"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
