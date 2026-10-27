import { useState } from 'react'
import { D, EXT, ROOF, STAIR, TERRACE_END, W, furniture, rooms, stairEndY, walls, type Room, type Wall } from '../data/layout'
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
      <svg className="plan" viewBox="-5 -3.5 38 45" role="img" aria-label="Floor plan: 25 by 15 foot home on a 25 by 39 foot terrace, bath at the stair corner, 12 foot covered sit-out then open terrace">
        <defs>
          <filter id="pencil">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="0.35" />
          </filter>
          <pattern id="hatch" width="0.5" height="0.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="0.5" stroke="currentColor" strokeWidth="0.06" opacity="0.35" />
          </pattern>
          <clipPath id="furnished-clip">
            <rect x={-5 + ((100 - furnishedPct) / 100) * 38} y={-4} width={38} height={46} />
          </clipPath>
        </defs>

        {/* Your sketch */}
        <g className="sketch" filter="url(#pencil)">
          <path d={jitter([[-1, -1], [26, -1], [26, 40], [-1, 40], [-1, -1]])} />
          <path d={jitter([[-1, 16], [26, 16]])} strokeDasharray="0.6 0.5" />
          <path d={jitter([[18, -1], [18, 5], [26, 5]])} strokeDasharray="0.6 0.5" />
          <path d={jitter([[26, 5.2], [29, 5.2], [29, 16.5]])} />
          <path d={jitter([[26, 8.45], [28.5, 8.45]])} />
          <path d={jitter([[21.5, 14.6], [21.5, 17.6], [21, 17], [21.5, 17.6], [22, 17]])} />
          <text x={4} y={8}>built-up area</text>
          <text x={4} y={28}>rest of the terrace</text>
          <text x={26.6} y={4.3}>stairs</text>
          <text x={20} y={2.8}>bath</text>
          <text x={22.4} y={18.6} className="small">door to sit-out</text>
          <text x={11.6} y={-1.6} className="small">25'</text>
          <text x={-2.6} y={8} className="small">15'</text>
          <text x={-2.6} y={28} className="small">39'</text>
        </g>

        <g className="plan-clean">
          {/* Sit-out: covered under the roof, then open terrace */}
          <rect className="sitout" x={0} y={D + EXT} width={W} height={ROOF.edgeY - D - EXT} />
          <rect className="sitout open" x={0} y={ROOF.edgeY} width={W} height={TERRACE_END - ROOF.edgeY} />
          <rect className="parapet" x={-EXT} y={D + EXT} width={EXT} height={TERRACE_END - D} />
          <rect className="parapet" x={W} y={D + EXT} width={EXT} height={TERRACE_END - D} />
          <rect className="parapet" x={-EXT} y={TERRACE_END} width={W + 2 * EXT} height={EXT} />
          <line className="roof-edge" x1={-EXT - 1} y1={ROOF.edgeY + 0.6} x2={W + EXT + 1} y2={ROOF.edgeY + 0.6} />
          {ROOF.posts.map(x => <rect key={x} className="post" x={x - 0.17} y={ROOF.edgeY - 0.52} width={0.34} height={0.34} />)}
          <g className="stairs">
            <rect x={STAIR.x0} y={STAIR.landingY0} width={STAIR.x1 - STAIR.x0} height={STAIR.landingY1 - STAIR.landingY0} />
            <rect x={STAIR.x0} y={STAIR.landingY1} width={STAIR.x1 - STAIR.x0} height={stairEndY - STAIR.landingY1} />
            {Array.from({ length: STAIR.treads - 1 }, (_, i) => {
              const y = STAIR.landingY1 + (i + 1) * STAIR.tread
              return <line key={i} x1={STAIR.x0} y1={y} x2={STAIR.x1} y2={y} />
            })}
            <text x={(STAIR.x0 + STAIR.x1) / 2} y={STAIR.landingY0 - 0.5} textAnchor="middle">stairs</text>
            <path className="arrow" d={`M${(STAIR.x0 + STAIR.x1) / 2} ${STAIR.landingY1 + 0.6} V${stairEndY - 0.6} l-0.4 -0.6 M${(STAIR.x0 + STAIR.x1) / 2} ${stairEndY - 0.6} l0.4 -0.6`} />
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
            <path d="M25 5.25 L21.8 5.25 A3.2 3.2 0 0 1 25 8.45" />
            <path d="M12 7.9 L9.35 7.9 A2.65 2.65 0 0 1 12 5.25" />
            <path d="M18.3 4.65 L20.8 4.65 M20.8 4.65 L23.3 4.65" strokeDasharray="0.3 0.2" />
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

          <g className="compass" transform="translate(-2.2 36.5)">
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
              <line x1={-4.2} y1={0} x2={-4.2} y2={TERRACE_END} />
              <text x={-4.5} y={TERRACE_END / 2} transform={`rotate(-90 -4.5 ${TERRACE_END / 2})`}>terrace 39'</text>
              <line x1={30.5} y1={0} x2={30.5} y2={5.2} />
              <text x={30.8} y={2.6} transform="rotate(90 30.8 2.6)">5'2"</text>
              <line x1={30.5} y1={5.2} x2={30.5} y2={8.45} />
              <text x={30.8} y={6.8} transform="rotate(90 30.8 6.8)">3'3"</text>
              <line x1={30.5} y1={D + EXT} x2={30.5} y2={ROOF.edgeY} />
              <text x={30.8} y={21.75} transform="rotate(90 30.8 21.75)">12' covered</text>
              <line x1={30.5} y1={ROOF.edgeY} x2={30.5} y2={TERRACE_END} />
              <text x={30.8} y={33.4} transform="rotate(90 30.8 33.4)">11'3" open</text>
              <line x1={18} y1={-1.2} x2={W} y2={-1.2} />
              <text x={21.5} y={-1.45}>bath 7'</text>
              <line x1={26.4} y1={0} x2={26.4} y2={4.75} />
              <text x={26.7} y={2.4} transform="rotate(90 26.7 2.4)">4'9"</text>
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
