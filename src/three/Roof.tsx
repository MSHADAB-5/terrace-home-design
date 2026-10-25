import { useMemo } from 'react'
import * as THREE from 'three'
import { EXT, ROOF, W, roofSlope, roofY } from '../data/layout'
import { useRoofVisible } from '../store'
import { mats } from './materials'
import { Explode } from './Explode'
import { PBox } from './Structure'

const beta = Math.atan(roofSlope)
const cosB = Math.cos(beta)
const toS = (y: number) => (y - ROOF.eastY) / cosB

export function Roof() {
  const visible = useRoofVisible()
  const sk = ROOF.skylight
  const geo = useMemo(() => {
    const x0 = -EXT - ROOF.overhang, x1 = W + EXT + ROOF.overhang
    const s0 = -ROOF.overhang, s1 = toS(ROOF.edgeY + 0.6)
    const s = new THREE.Shape()
    s.moveTo(x0, s0)
    s.lineTo(x1, s0)
    s.lineTo(x1, s1)
    s.lineTo(x0, s1)
    s.closePath()
    const h = new THREE.Path()
    h.moveTo(sk.x0, toS(sk.y0))
    h.lineTo(sk.x1, toS(sk.y0))
    h.lineTo(sk.x1, toS(sk.y1))
    h.lineTo(sk.x0, toS(sk.y1))
    h.closePath()
    s.holes.push(h)
    return new THREE.ExtrudeGeometry(s, { depth: ROOF.thickness, bevelEnabled: false })
  }, [sk])

  if (!visible) return null
  const postY = ROOF.edgeY - 0.35
  return (
    <Explode level={4}>
      <group position={[0, ROOF.eastHeight, ROOF.eastY]} rotation={[beta, 0, 0]}>
        <mesh geometry={geo} material={mats.roof} rotation={[Math.PI / 2, 0, 0]} position={[0, ROOF.thickness, 0]} castShadow receiveShadow />
        <mesh
          position={[(sk.x0 + sk.x1) / 2, ROOF.thickness + 0.05, (toS(sk.y0) + toS(sk.y1)) / 2]}
          material={mats.skylight}
        >
          <boxGeometry args={[sk.x1 - sk.x0 + 0.3, 0.12, toS(sk.y1) - toS(sk.y0) + 0.3]} />
        </mesh>
        {/* Ridge flashing at the high east edge */}
        <mesh position={[W / 2, ROOF.thickness + 0.05, -ROOF.overhang + 0.15]} material={mats.steel}>
          <boxGeometry args={[W + 2 * EXT + 2 * ROOF.overhang, 0.12, 0.3]} />
        </mesh>
      </group>
      {/* Slim MS posts + edge beam carry the sit-out end */}
      {ROOF.posts.map(x => (
        <PBox key={x} x0={x - 0.17} x1={x + 0.17} y0={postY - 0.17} y1={postY + 0.17} z0={0} z1={roofY(postY)} m="steel" />
      ))}
      <PBox x0={-EXT} x1={W + EXT} y0={postY - 0.2} y1={postY + 0.2} z0={roofY(postY) - 0.5} z1={roofY(postY)} m="steel" />
      {/* Rain gutter */}
      <mesh position={[W / 2, roofY(ROOF.edgeY + 0.6) - 0.1, ROOF.edgeY + 0.75]} rotation={[0, 0, Math.PI / 2]} material={mats.steel}>
        <cylinderGeometry args={[0.2, 0.2, W + 2 * EXT + 2, 12, 1, true, 0, Math.PI]} />
      </mesh>
    </Explode>
  )
}
