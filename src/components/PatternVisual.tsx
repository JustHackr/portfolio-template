import { useId } from 'react'

const petals = [45, 135, 225, 315]

function Motif({ size = 60 }: { size?: number }) {
  const r = size / 2
  return (
    <>
      {petals.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy={-r * 0.44}
          rx={r * 0.26}
          ry={r * 0.42}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r={r * 0.09} className="pattern-core" />
    </>
  )
}

export function PatternMark() {
  return (
    <svg className="pattern-mark" viewBox="0 0 240 80" aria-hidden="true">
      {[40, 120, 200].map((x, i) => (
        <g key={x} transform={`translate(${x} 40) rotate(${i * 15})`} className="pattern-motif">
          <Motif size={68} />
        </g>
      ))}
    </svg>
  )
}

export function PatternVisual() {
  const id = useId().replace(/:/g, '')

  return (
    <figure className="pattern-art" aria-label="Tiled pattern built from rotated and reflected motifs">
      <svg viewBox="0 0 480 360" role="img" aria-hidden="true">
        <defs>
          <pattern id={`tile-${id}`} width="60" height="60" patternUnits="userSpaceOnUse">
            <g className="pattern-motif" transform="translate(30 30)">
              <Motif />
            </g>
            {[
              [0, 0],
              [60, 0],
              [0, 60],
              [60, 60],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" className="pattern-dot" />
            ))}
          </pattern>
          <radialGradient id={`fade-${id}`} cx="50%" cy="50%" r="65%">
            <stop offset="55%" stopColor="white" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`mask-${id}`}>
            <rect width="480" height="360" fill={`url(#fade-${id})`} />
          </mask>
        </defs>

        <rect width="480" height="360" className="pattern-ground" />
        <rect width="480" height="360" fill={`url(#tile-${id})`} mask={`url(#mask-${id})`} />

        <line x1="240" y1="0" x2="240" y2="360" className="pattern-axis" />
        <line x1="0" y1="180" x2="480" y2="180" className="pattern-axis" />

        <g transform="translate(240 180)" className="pattern-focus">
          <rect x="-62" y="-62" width="124" height="124" rx="16" className="pattern-frame" />
          <Motif size={112} />
        </g>
      </svg>
      <figcaption>
        <span className="pattern-matrix">R(90°) = [ 0 −1 ; 1 0 ]</span>
        <span>Reflection · y = x</span>
      </figcaption>
    </figure>
  )
}
