/**
 * Abstract campus-intelligence visualization for the login brand panel.
 * A subtle grid, connected detection nodes, and glowing paths — evocative of
 * an aerial/drone monitoring view without being a literal map or photograph.
 */
export function CampusVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* base grid */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0H0V48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/[0.04]"
            />
          </pattern>
          <radialGradient id="glow" cx="35%" cy="40%" r="65%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#glow)" />

        {/* connection paths */}
        <g className="text-primary/40" stroke="currentColor" strokeWidth="1.25" fill="none">
          <path d="M120 130 L300 210 L250 380 L470 300" />
          <path d="M300 210 L520 160" />
          <path d="M250 380 L120 470" />
          <path d="M470 300 L560 450" />
        </g>

        {/* detection nodes */}
        <g>
          {[
            { x: 120, y: 130 },
            { x: 300, y: 210 },
            { x: 250, y: 380 },
            { x: 470, y: 300 },
            { x: 520, y: 160 },
            { x: 120, y: 470 },
            { x: 560, y: 450 },
          ].map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="14" className="fill-primary/10" />
              <circle cx={n.x} cy={n.y} r="4" className="fill-primary" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
