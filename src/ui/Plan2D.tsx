import { useState } from 'react'
import { D, EXT, ROOF, W, furniture, rooms, walls, type Room, type Wall } from '../data/layout'
import { useStore } from '../store'

function segments(w: Wall) {
  const out: [number, number][] = []
  let cur = w.from
  for (const o of [...w.openings].sort((a, b) => a.from - b.from)) {
    if (o.from > cur) out.push([cur, o.from])
    cur = Math.max(cur, o.to)
  }
  if (w.to > cur) out.push([cur, w.to])
  return out
}

const rectOf = (w: Wall, a: number, b: number) =>
  w.axis === 'x' ? { x: a, y: w.at, width: b - a, height: w.t } : { x: w.at, y: a, width: w.t, height: b - a }

const jitter = (pts: [number, number][], amt = 0.35) => {
  let s = 3
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * amt
  return 'M' + pts.map(([x, y]) => `${x + r()} ${y + r()}`).join(' L')
}

export function Plan2D({ showDims, furnishedPct = 100 }: { showDims: boolean; furnishedPct?: number }) {
  const [hover, setHover] = useState<Room | null>(null)
  const set = useStore(s => s.set)

  const open = (r: Room) =>
    set({ explorer: true, view: 'orbit', selectedRoom: r.id, selectedFeature: null, showRoof: false, exploded: false })

  return (
    <div className="plan-wrap">
      <svg className="plan" viewBox="-4 -6.5 40 36" role="img" aria-label="Floor plan, 25 by 15 feet with a 12 foot covered sit-out">
        <defs>
          <filter id="pencil">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="0.35" />
          </filter>
          <pattern id="hatch" width="0.5" height="0.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="0.5" stroke="currentColor" strokeWidth="0.06" opacity="0.35" />
          </pattern>
          <clipPath id="furnished-clip">
            <rect x={-4 + ((100 - furnishedPct) / 100) * 40} y={-7} width={40} height={40} />
          </clipPath>
        </defs>

        {/* Your sketch */}
        <g className="sketch" filter="url(#pencil)">
          <path d={jitter([[-1, -1], [26, -1], [26, 16], [-1, 16], [-1, -1]])} />
          <path d={jitter([[-1, 16], [-1, 28], [26, 28], [26, 16]])} strokeDasharray="0.6 0.5" />
          <path d={jitter([[12, -1], [12, 16]])} />
          <path d={jitter([[26, 0.5], [29, 0.5], [29, -3.5]])} />
          <text x={4} y={8}>room</text>
          <text x={17} y={8}>hall</text>
          <text x={27} y={-1.3}>stairs</text>
          <text x={9} y={23}>sit out</text>
          <text x={-0.6} y={-1.6} className="small">window</text>
          <text x={20} y={17.4} className="small">door?</text>
        </g>

        <g className="plan-clean">
          {/* Sit-out + terrace */}
          <rect className="sitout" x={-EXT} y={D + EXT} width={W + 2 * EXT} height={ROOF.edgeY - D - EXT} />
          <line className="roof-edge" x1={-EXT - 1} y1={ROOF.edgeY + 0.6} x2={W + EXT + 1} y2={ROOF.edgeY + 0.6} />
          {ROOF.posts.map(x => <rect key={x} className="post" x={x - 0.17} y={ROOF.edgeY - 0.52} width={0.34} height={0.34} />)}
          <g className="stairs">
            <rect x={28.6} y={-4} width={4.9} height={4.2} />
            {Array.from({ length: 7 }, (_, i) => <line key={i} x1={29 + i * 0.65} y1={-3.5} x2={29 + i * 0.65} y2={0.2} />)}
            <text x={31} y={-4.5}>stairs</text>
          </g>

          {/* Rooms */}
          {rooms.map(r => (
            <polygon
              key={r.id}
              className={`room ${hover?.id === r.id ? 'hover' : ''}`}
              points={r.poly.map(p => p.join(',')).join(' ')}
              onMouseEnter={() => setHover(r)}
              onMouseLeave={() => setHover(null)}
              onClick={() => open(r)}
              tabIndex={0}
              role="button"
              aria-label={`${r.name}, ${r.size}. Open in 3D`}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && open(r)}
            />
          ))}

          {/* Walls */}
          {walls.map(w =>
            segments(w).map(([a, b]) => (
              <rect key={`${w.id}-${a}`} className="wall" {...rectOf(w, a, b)} pathLength={1} />
            )),
          )}
          {walls.flatMap(w =>
            w.openings
              .filter(o => o.sill > 0)
              .map(o => <rect key={o.id} className={`win ${o.kind}`} {...rectOf(w, o.from, o.to)} />),
          )}

          {/* Doors */}
          <g className="doors">
            <path d="M25 0.5 L21.8 0.5 A3.2 3.2 0 0 1 25 3.7" />
            <path d="M12 14.6 L9.35 14.6 A2.65 2.65 0 0 1 12 11.95" />
            <path d="M2.25 7.55 L4.75 7.55 M4.75 7.55 L7.2 7.55" strokeDasharray="0.3 0.2" />
            <path d="M19.5 15.4 l0.5 0.6 l0.5 -0.6 l0.5 0.6 l0.5 -0.6 l0.5 0.6 l0.5 -0.6 l0.5 0.6 l0.5 -0.6" />
          </g>

          {/* Furniture (before/after clip) */}
          <g className="furniture" clipPath="url(#furnished-clip)">
            {furniture.map(f =>
              f.shape === 'round' ? (
                <ellipse key={f.id} cx={(f.x0 + f.x1) / 2} cy={(f.y0 + f.y1) / 2} rx={(f.x1 - f.x0) / 2} ry={(f.y1 - f.y0) / 2} />
              ) : (
                <g key={f.id}>
                  <rect x={f.x0} y={f.y0} width={f.x1 - f.x0} height={f.y1 - f.y0} rx={0.15} />
                  {f.label && (
                    <text x={(f.x0 + f.x1) / 2} y={(f.y0 + f.y1) / 2} className="flabel">
                      {f.label}
                    </text>
                  )}
                </g>
              ),
            )}
            <rect className="skylight" x={ROOF.skylight.x0} y={ROOF.skylight.y0} width={3} height={3} />
          </g>

          {rooms.map(r => (
            <g key={r.id} className="room-label">
              <text x={r.labelAt[0]} y={r.labelAt[1]}>{r.name}</text>
              <text x={r.labelAt[0]} y={r.labelAt[1] + 0.9} className="sub">{r.size}</text>
            </g>
          ))}

          <g className="compass" transform="translate(-2.4 25)">
            <circle r={1.4} />
            <path d="M0 -1.1 L0.35 0 L0 1.1 L-0.35 0 Z" transform="rotate(90)" />
            <text y={-1.8}>E</text>
            <text y={2.5}>W</text>
          </g>

          {showDims && (
            <g className="dims">
              <line x1={0} y1={-2.2} x2={W} y2={-2.2} />
              <text x={W / 2} y={-2.5}>25'</text>
              <line x1={-2.2} y1={0} x2={-2.2} y2={D} />
              <text x={-2.5} y={D / 2} transform={`rotate(-90 -2.5 ${D / 2})`}>15'</text>
              <line x1={W + 2} y1={D + EXT} x2={W + 2} y2={ROOF.edgeY} />
              <text x={W + 2.3} y={21.5} transform={`rotate(90 ${W + 2.3} 21.5)`}>12' sit-out</text>
              <line x1={0} y1={7.9} x2={5} y2={7.9} />
              <text x={2.5} y={8.6}>5'</text>
              <line x1={5.6} y1={0} x2={5.6} y2={7} />
              <text x={6.3} y={3.6}>7'</text>
            </g>
          )}
        </g>
      </svg>
      <div className={`plan-tip ${hover ? 'on' : ''}`} aria-live="polite">
        {hover && (
          <>
            <strong>{hover.name}</strong>
            <span>{hover.size} · {hover.area} sq ft</span>
            <em>Click to open in 3D</em>
          </>
        )}
      </div>
    </div>
  )
}
