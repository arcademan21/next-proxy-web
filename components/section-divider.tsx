import { cn } from "@/lib/utils"

type Sphere = {
  cx: number
  cy: number
  r: number
  /** animation phase offset in seconds, so spheres don't bob in sync */
  delay: number
  /** highlight intensity 0..1 */
  light?: number
}

// Cluster laid out around the horizontal center line (y = 60 in a 0..120 box).
// One dominant core sphere, a few mid orbiters, and small satellites.
const SPHERES: Sphere[] = [
  { cx: 600, cy: 60, r: 18, delay: 0, light: 1 }, // core
  { cx: 565, cy: 50, r: 9, delay: 0.6 },
  { cx: 632, cy: 50, r: 11, delay: 1.1 },
  { cx: 578, cy: 74, r: 12, delay: 0.3 },
  { cx: 628, cy: 73, r: 8, delay: 1.4 },
  { cx: 552, cy: 64, r: 5, delay: 0.9 },
  { cx: 650, cy: 64, r: 5, delay: 1.7 },
  { cx: 612, cy: 40, r: 6, delay: 0.45 },
  { cx: 600, cy: 84, r: 4, delay: 1.25 },
]

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // desktop / PC only — mobile gets the natural section gap instead
        "relative hidden h-40 w-full overflow-hidden bg-background lg:block",
        className,
      )}
    >
      {/* dotted-grid backdrop, masked so it fades at the edges (same language as the hero) */}
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(75%_120%_at_50%_50%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* central green glow — pulses slowly */}
      <div
        className="divider-glow pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 60% at 50% 50%, oklch(0.72 0.16 162 / 0.28), transparent 72%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          {/* one radial gradient per sphere keeps the 3D highlight crisp at any size */}
          {SPHERES.map((s, i) => (
            <radialGradient
              key={`grad-${i}`}
              id={`sphere-${i}`}
              cx="35%"
              cy="32%"
              r="75%"
            >
              <stop offset="0%" stopColor="oklch(0.99 0 0)" />
              <stop offset="45%" stopColor="oklch(0.9 0.005 240)" />
              <stop offset="100%" stopColor="oklch(0.55 0.01 245)" />
            </radialGradient>
          ))}
          {/* soft ambient halo behind the cluster */}
          <radialGradient id="divider-core-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.16 162 / 0.5)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 162 / 0)" />
          </radialGradient>
        </defs>

        {/* horizontal beam: green bulge in the middle, thin lines reaching the edges */}
        <line
          x1="0"
          y1="60"
          x2="1200"
          y2="60"
          stroke="oklch(0.72 0.16 162 / 0.45)"
          strokeWidth="1"
        />
        <ellipse
          cx="600"
          cy="60"
          rx="260"
          ry="9"
          fill="oklch(0.72 0.16 162 / 0.22)"
        />
        {/* bright white guide segments that stop short of the cluster */}
        <line x1="40" y1="60" x2="500" y2="60" stroke="oklch(1 0 0 / 0.85)" strokeWidth="1.5" />
        <line x1="700" y1="60" x2="1160" y2="60" stroke="oklch(1 0 0 / 0.85)" strokeWidth="1.5" />

        {/* ambient halo behind the molecule cluster */}
        <circle cx="600" cy="60" r="60" fill="url(#divider-core-halo)" />

        {/* the spheres — each bobs gently, offset by its delay */}
        {SPHERES.map((s, i) => (
          <g
            key={`sphere-g-${i}`}
            className="divider-sphere"
            style={{ animationDelay: `${s.delay}s`, transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={s.cx} cy={s.cy} r={s.r} fill={`url(#sphere-${i})`} />
            {/* tiny specular dot for extra depth on larger spheres */}
            {s.r >= 8 ? (
              <circle
                cx={s.cx - s.r * 0.32}
                cy={s.cy - s.r * 0.36}
                r={s.r * 0.18}
                fill="oklch(1 0 0 / 0.9)"
              />
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  )
}
