import { Html, Line } from '@react-three/drei'
import { D, EXT, ROOF, W, roofY } from '../data/layout'
import { useStore } from '../store'

type V3 = [number, number, number]

function Dim({ a, b, label, tick = 0.5 }: { a: V3; b: V3; label: string; tick?: number }) {
  const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  const alongX = Math.abs(b[0] - a[0]) > Math.abs(b[2] - a[2])
  const t: V3 = alongX ? [0, 0, tick] : [tick, 0, 0]
  const tk = (p: V3): [V3, V3] => [[p[0] - t[0], p[1], p[2] - t[2]], [p[0] + t[0], p[1], p[2] + t[2]]]
  return (
    <group>
      <Line points={[a, b]} color="#ff5a36" lineWidth={2} />
      <Line points={tk(a)} color="#ff5a36" lineWidth={2} />
      <Line points={tk(b)} color="#ff5a36" lineWidth={2} />
      <Html position={mid} center zIndexRange={[15, 0]}>
        <span className="dim-label">{label}</span>
      </Html>
    </group>
  )
}

function Height({ x, z, h, label }: { x: number; z: number; h: number; label: string }) {
  return <Dim a={[x, 0, z]} b={[x, h, z]} label={label} tick={0.4} />
}

export function Dimensions() {
  const on = useStore(s => s.explorer && s.showDims && s.view !== 'walk')
  if (!on) return null
  const y = 0.3
  return (
    <>
      <Dim a={[0, y, -EXT - 2]} b={[W, y, -EXT - 2]} label="25' inside" />
      <Dim a={[-EXT - 2, y, 0]} b={[-EXT - 2, y, D]} label="15' inside" />
      <Dim a={[0, 8.3, 7.6]} b={[5, 8.3, 7.6]} label="bath 5'" />
      <Dim a={[5.2, 8.3, 0]} b={[5.2, 8.3, 7]} label="7'" />
      <Dim a={[2.4, 7.4, 7.5]} b={[2.4, 7.4, 14.5]} label="wardrobe 7'" />
      <Dim a={[6.2, 2.4, 7.2]} b={[11.2, 2.4, 7.2]} label="bed 5'" />
      <Dim a={[W + EXT + 2, y, D + EXT]} b={[W + EXT + 2, y, ROOF.edgeY]} label="sit-out 12'" />
      <Height x={W + EXT + 0.6} z={-EXT} h={ROOF.eastHeight} label={`roof 12'6"`} />
      <Height x={W + EXT + 0.6} z={ROOF.edgeY - 0.35} h={roofY(ROOF.edgeY)} label={`9'9"`} />
    </>
  )
}
