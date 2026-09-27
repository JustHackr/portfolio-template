import { useState, type CSSProperties } from 'react'

export function OrbitVisual() {
  const [speed, setSpeed] = useState(50)
  const style = { '--orbit-duration': `${(9 - speed / 14).toFixed(2)}s` } as CSSProperties

  return (
    <div className="orbit-lab" style={style}>
      <div className="orbit-canvas" aria-hidden="true">
        <span className="orbit-path" />
        <span className="orbit-center" />
        <div className="orbit-arm">
          <span className="orbit-body" />
          <span className="orbit-vector velocity" />
          <span className="orbit-vector centripetal" />
        </div>
        <div className="orbit-legend">
          <span className="legend-velocity">v velocity</span>
          <span className="legend-centripetal">a꜀ centripetal</span>
        </div>
      </div>
      <label className="transform-control">
        <span>
          Angular speed
          <output>{speed}%</output>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        />
      </label>
    </div>
  )
}

const nodes = [
  { x: 50, y: 22 },
  { x: 32, y: 38 },
  { x: 68, y: 38 },
  { x: 50, y: 55 },
  { x: 36, y: 72 },
  { x: 64, y: 72 },
]

const links = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
]

export function ObservationVisual() {
  return (
    <div className="observation-lab" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="observation-map">
        <rect x="14" y="8" width="72" height="84" rx="34" className="observation-frame" />
        {links.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
          />
        ))}
        {nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={index === 3 ? 7 : 5}
            style={{ '--node-delay': `${index * 0.35}s` } as CSSProperties}
          />
        ))}
      </svg>
      <span className="observation-scan" />
      <span className="observation-caption">Spatial relationships</span>
    </div>
  )
}

export function GenericVisual() {
  return (
    <div className="generic-lab" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <span key={index} style={{ '--ring': index } as CSSProperties} />
      ))}
    </div>
  )
}
