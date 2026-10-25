import { useMemo } from 'react'
import * as THREE from 'three'
import {
  BATH_CEILING, CEILING, D, EXT, PART, ROOF, W, roofY, walls, type Opening, type Wall,
} from '../data/layout'
import { useRoofVisible } from '../store'
import { boxGeo, openingFrame, wallGeometry, wallTransform } from './geometry'
import { mats, type MatKey } from './materials'
import { Explode } from './Explode'

/** Box positioned by plan coords: x0..x1, y0..y1 (plan), z0..z1 (height). */
export function PBox({ x0, x1, y0, y1, z0, z1, m, cast = true }: {
  x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; m: MatKey; cast?: boolean
}) {
  return (
    <mesh
      geometry={boxGeo(x1 - x0, z1 - z0, y1 - y0)}
      material={mats[m]}
      position={[(x0 + x1) / 2, (z0 + z1) / 2, (y0 + y1) / 2]}
      castShadow={cast}
      receiveShadow
    />
  )
}

function WindowFill({ w, o }: { w: Wall; o: Opening }) {
  const f = openingFrame(w, o)
  const depth = w.t + 0.04
  if (o.kind === 'glassblock')
    return (
      <mesh position={f.pos} rotation={[0, f.rotY, 0]} geometry={boxGeo(f.width, f.height, 0.3)} material={mats.glassBlock} />
    )
  if (o.kind === 'vent')
    return (
      <group position={f.pos} rotation={[0, f.rotY, 0]}>
        <mesh geometry={boxGeo(f.width, f.height, depth * 0.6)} material={mats.black} />
        {[-0.2, 0, 0.2].map(dy => (
          <mesh key={dy} position={[0, dy * f.height, depth * 0.31]} geometry={boxGeo(f.width, 0.04, 0.04)} material={mats.frame} />
        ))}
      </group>
    )
  if (o.kind !== 'window') return null
  const panes = Math.max(1, Math.round(f.width / 3))
  const bar = 0.14
  return (
    <group position={f.pos} rotation={[0, f.rotY, 0]}>
      <mesh geometry={boxGeo(f.width, f.height - bar, 0.04)} material={mats.glass} />
      <mesh position={[0, f.height / 2 - bar / 2, 0]} geometry={boxGeo(f.width, bar, 0.3)} material={mats.frame} />
      <mesh position={[0, -f.height / 2 + bar / 2, 0]} geometry={boxGeo(f.width, bar, depth)} material={mats.frame} />
      {Array.from({ length: panes + 1 }, (_, i) => (
        <mesh
          key={i}
          position={[-f.width / 2 + (i * f.width) / panes + (i === 0 ? bar / 2 : i === panes ? -bar / 2 : 0), 0, 0]}
          geometry={boxGeo(bar, f.height, 0.3)}
          material={mats.frame}
        />
      ))}
    </group>
  )
}

function Walls() {
  const geos = useMemo(() => walls.map(w => wallGeometry(w)), [])
  return (
    <>
      {walls.map((w, i) => {
        const tr = wallTransform(w)
        return (
          <group key={w.id}>
            <mesh geometry={geos[i]} material={mats.wall} position={tr.position} rotation={tr.rotation} castShadow receiveShadow />
            {w.openings.map(o => <WindowFill key={o.id} w={w} o={o} />)}
          </group>
        )
      })}
      {/* Skirting + bath wall tiles */}
      {([[0, 0.5, 0, 8], [3, 5, 0, 8], [0.5, 3, 0, 4.5], [0.5, 3, 7, 8]] as const).map(([a, b, z0, z1], i) => (
        <PBox key={`e${i}`} x0={a} x1={b} y0={0} y1={0.02} z0={z0} z1={z1} m="bathTile" cast={false} />
      ))}
      {([[0, 0.5, 0, 8], [2.5, 4.6, 0, 8], [5.4, 7, 0, 8], [0.5, 2.5, 0, 4.5], [0.5, 2.5, 7, 8], [4.6, 5.4, 0, 6.9], [4.6, 5.4, 7.6, 8]] as const).map(([a, b, z0, z1], i) => (
        <PBox key={`n${i}`} x0={0} x1={0.02} y0={a} y1={b} z0={z0} z1={z1} m="bathTile" cast={false} />
      ))}
      <PBox x0={4.98} x1={5} y0={0} y1={7} z0={0} z1={BATH_CEILING} m="bathTile" cast={false} />
      <PBox x0={0} x1={2.25} y0={6.98} y1={7} z0={0} z1={BATH_CEILING} m="bathTile" cast={false} />
    </>
  )
}

function Floors() {
  return (
    <>
      <PBox x0={0} x1={W} y0={0} y1={D} z0={-0.05} z1={0.01} m="floor" cast={false} />
      <PBox x0={0} x1={5} y0={0} y1={7} z0={0.01} z1={0.02} m="bathTile" cast={false} />
      {/* Floor drain */}
      <PBox x0={2.2} x1={2.8} y0={1.1} y1={1.7} z0={0.02} z1={0.03} m="metal" cast={false} />
      <PBox x0={-EXT} x1={W + EXT} y0={D + EXT} y1={ROOF.edgeY} z0={-0.05} z1={-0.02} m="sitoutFloor" cast={false} />
      {/* Rugs */}
      <PBox x0={5.6} x1={11.8} y0={4.6} y1={11.2} z0={0.01} z1={0.04} m="rug" cast={false} />
      <PBox x0={15.6} x1={21.2} y0={5.6} y1={11.6} z0={0.01} z1={0.04} m="rug" cast={false} />
    </>
  )
}

function Terrace() {
  const x0 = -EXT - 0.5, x1 = 34, y0 = -4.5, y1 = ROOF.edgeY + 0.5
  const ph = 3.5
  return (
    <>
      <PBox x0={x0 - 2} x1={x1 + 2} y0={y0 - 2} y1={y1 + 2} z0={-1.2} z1={-0.06} m="terrace" cast={false} />
      <PBox x0={x0} x1={x1} y0={y1 - 0.5} y1={y1} z0={-0.06} z1={ph} m="parapet" />
      <PBox x0={x0} x1={x1} y0={y0} y1={y0 + 0.5} z0={-0.06} z1={ph} m="parapet" />
      <PBox x0={x0} x1={x0 + 0.5} y0={y0} y1={y1} z0={-0.06} z1={ph} m="parapet" />
      <PBox x0={x1 - 0.5} x1={x1} y0={y0} y1={y1} z0={-0.06} z1={ph} m="parapet" />
      {/* Stair head from the floor below, next to the entry */}
      <PBox x0={28.6} x1={33.5} y0={-4} y1={-3.5} z0={-0.06} z1={3} m="steel" />
      {Array.from({ length: 7 }, (_, i) => (
        <PBox key={i} x0={29 + i * 0.65} x1={29.65 + i * 0.65} y0={-3.5} y1={0.2} z0={-1.2} z1={-0.1 - i * 0.16} m="parapet" cast={false} />
      ))}
      <PBox x0={28.6} x1={28.75} y0={-3.5} y1={0.2} z0={-0.06} z1={3.2} m="frame" />
      <PBox x0={28.6} x1={33.5} y0={0.2} y1={0.35} z0={2.9} z1={3.05} m="frame" />
      {/* Plants at the parapet */}
      {[3, 10, 16, 31].map(x => (
        <group key={x} position={[x, 0, y1 - 1.2]}>
          <mesh position={[0, 0.6, 0]} material={mats.pot} castShadow>
            <cylinderGeometry args={[0.55, 0.4, 1.2, 16]} />
          </mesh>
          <mesh position={[0, 1.7, 0]} material={mats.leaf} castShadow>
            <icosahedronGeometry args={[0.85, 1]} />
          </mesh>
        </group>
      ))}
    </>
  )
}

type Band = { x0: number; x1: number; y0: number; y1: number; edge: '+x' | '-x' | '+y' | '-y' }
const BAND_DROP = 0.5
const bands: Band[] = [
  { x0: 5 + PART, x1: 12, y0: 0, y1: 1.25, edge: '+y' },
  { x0: 10.75, x1: 12, y0: 1.25, y1: 13.75, edge: '-x' },
  { x0: 2, x1: 12, y0: 13.75, y1: D, edge: '-y' },
  { x0: 12 + PART, x1: W, y0: 0, y1: 1.25, edge: '+y' },
  { x0: 12 + PART, x1: W, y0: 13.75, y1: D, edge: '-y' },
  { x0: 12 + PART, x1: 13.625, y0: 1.25, y1: 13.75, edge: '+x' },
  { x0: 23.75, x1: W, y0: 1.25, y1: 13.75, edge: '-x' },
]

function Ceiling() {
  const sk = ROOF.skylight
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 7 + PART)
    s.lineTo(5 + PART, 7 + PART)
    s.lineTo(5 + PART, 0)
    s.lineTo(W, 0)
    s.lineTo(W, D)
    s.lineTo(0, D)
    s.closePath()
    const h = new THREE.Path()
    h.moveTo(sk.x0, sk.y0)
    h.lineTo(sk.x1, sk.y0)
    h.lineTo(sk.x1, sk.y1)
    h.lineTo(sk.x0, sk.y1)
    h.closePath()
    s.holes.push(h)
    return new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false })
  }, [sk.x0, sk.x1, sk.y0, sk.y1])
  const wellTop = roofY(sk.y0)
  return (
    <>
      <mesh geometry={geo} material={mats.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING + 0.12, 0]} receiveShadow />
      {bands.map((b, i) => {
        const lx = b.edge === '+x' ? b.x1 : b.edge === '-x' ? b.x0 : (b.x0 + b.x1) / 2
        const ly = b.edge === '+y' ? b.y1 : b.edge === '-y' ? b.y0 : (b.y0 + b.y1) / 2
        const alongX = b.edge === '+y' || b.edge === '-y'
        const len = alongX ? b.x1 - b.x0 : b.y1 - b.y0
        return (
          <group key={i}>
            <PBox x0={b.x0} x1={b.x1} y0={b.y0} y1={b.y1} z0={CEILING - BAND_DROP} z1={CEILING} m="ceiling" cast={false} />
            <mesh
              position={[lx, CEILING - BAND_DROP - 0.03, ly]}
              geometry={alongX ? boxGeo(len, 0.05, 0.06) : boxGeo(0.06, 0.05, len)}
              material={mats.led}
            />
          </group>
        )
      })}
      {/* Skylight light-well */}
      <PBox x0={sk.x0 - 0.1} x1={sk.x0} y0={sk.y0} y1={sk.y1} z0={CEILING} z1={wellTop} m="ceiling" cast={false} />
      <PBox x0={sk.x1} x1={sk.x1 + 0.1} y0={sk.y0} y1={sk.y1} z0={CEILING} z1={wellTop} m="ceiling" cast={false} />
      <PBox x0={sk.x0} x1={sk.x1} y0={sk.y0 - 0.1} y1={sk.y0} z0={CEILING} z1={wellTop} m="ceiling" cast={false} />
      <PBox x0={sk.x0} x1={sk.x1} y0={sk.y1} y1={sk.y1 + 0.1} z0={CEILING} z1={roofY(sk.y1)} m="ceiling" cast={false} />
      {/* Bathroom ceiling + storage loft over it */}
      <PBox x0={0} x1={5 + PART} y0={0} y1={7 + PART} z0={BATH_CEILING} z1={BATH_CEILING + 0.15} m="ceiling" cast={false} />
      <PBox x0={0} x1={5 + PART} y0={0} y1={7 + PART} z0={BATH_CEILING + 0.15} z1={CEILING} m="wood" />
      {[0.15, 1.95, 3.75].map(x => (
        <PBox key={x} x0={x} x1={x + 1.7} y0={7 + PART} y1={7 + PART + 0.04} z0={BATH_CEILING + 0.3} z1={CEILING - 0.15} m="accent" cast={false} />
      ))}
    </>
  )
}

export function Structure() {
  const roofOn = useRoofVisible()
  return (
    <>
      <Explode level={0}>
        <Terrace />
        <Floors />
      </Explode>
      <Explode level={2}>
        <Walls />
      </Explode>
      {roofOn && (
        <Explode level={3}>
          <Ceiling />
        </Explode>
      )}
    </>
  )
}
