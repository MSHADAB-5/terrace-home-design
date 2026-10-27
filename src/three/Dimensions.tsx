import { Html, Line } from '@react-three/drei'
import { D, EXT, ROOF, TERRACE_END, W, roofY } from '../data/layout'
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
      <Dim a={[-EXT - 4, y, 0]} b={[-EXT - 4, y, TERRACE_END]} label="terrace 39'" />
      <Dim a={[18, 8.3, 5.5]} b={[W, 8.3, 5.5]} label="bath 7'" />
      <Dim a={[17.3, 8.3, 0]} b={[17.3, 8.3, 4.75]} label={`4'9"`} />
      <Dim a={[2.4, 7.4, 7.5]} b={[2.4, 7.4, 14.5]} label="wardrobe 7'" />
      <Dim a={[4.5, 2.4, 7.2]} b={[9.5, 2.4, 7.2]} label="bed 5'" />
      <Dim a={[W + EXT + 0.2, 7.6, 0]} b={[W + EXT + 0.2, 7.6, 5.2]} label={`5'2"`} tick={0.3} />
      <Dim a={[W + EXT + 0.2, 7.6, 5.2]} b={[W + EXT + 0.2, 7.6, 8.45]} label={`door 3'3"`} tick={0.3} />
      <Dim a={[30.25, y, D + EXT]} b={[30.25, y, ROOF.edgeY]} label="covered 12'" />
      <Dim a={[30.25, y, ROOF.edgeY]} b={[30.25, y, TERRACE_END]} label={`open 11'3"`} />
      <Height x={W + EXT + 0.6} z={-EXT} h={ROOF.eastHeight} label={`roof 12'6"`} />
      <Height x={W + EXT + 0.6} z={ROOF.edgeY - 0.35} h={roofY(ROOF.edgeY)} label={`9'9"`} />
    </>
  )
}
