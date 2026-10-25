import { useMemo } from 'react'
import * as THREE from 'three'
import { CEILING, PART, W } from '../data/layout'
import { themeById } from '../data/themes'
import { useStore } from '../store'
import { archShape } from './geometry'
import { mats, type MatKey } from './materials'
import { Explode } from './Explode'
import { PBox } from './Structure'

const B = PBox
const D_WEST = 15
const BATH_LIGHT = 7.95

/** Arch-topped panel standing on a wall. `facing` is the direction the face points to. */
function Arch({ at, w, h, z0, facing, m, halo }: {
  at: [number, number]; w: number; h: number; z0: number; facing: '+x' | '-x' | '+y' | '-y'; m: MatKey; halo?: boolean
}) {
  const geo = useMemo(() => new THREE.ShapeGeometry(archShape(w, h), 24), [w, h])
  const haloGeo = useMemo(() => new THREE.ShapeGeometry(archShape(w + 0.2, h + 0.1), 24), [w, h])
  const rotY = { '+x': Math.PI / 2, '-x': -Math.PI / 2, '+y': 0, '-y': Math.PI }[facing]
  const n = { '+x': [1, 0], '-x': [-1, 0], '+y': [0, 1], '-y': [0, -1] }[facing]
  return (
    <group position={[at[0] + n[0] * 0.06, z0, at[1] + n[1] * 0.06]} rotation={[0, rotY, 0]}>
      {halo && <mesh geometry={haloGeo} material={mats.led} position={[0, -0.05, -0.03]} />}
      <mesh geometry={geo} material={mats[m]} />
    </group>
  )
}

function Plant({ x, y, s = 1, hanging = false }: { x: number; y: number; s?: number; hanging?: boolean }) {
  if (hanging)
    return (
      <group position={[x, CEILING - 2.5, y]}>
        <mesh position={[0, 1.6, 0]} material={mats.frame}>
          <cylinderGeometry args={[0.01, 0.01, 3, 4]} />
        </mesh>
        <mesh material={mats.pot}>
          <sphereGeometry args={[0.45, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        </mesh>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} material={mats.leaf} position={[Math.cos(i * 1.3) * 0.35, -0.3 - (i % 3) * 0.35, Math.sin(i * 1.3) * 0.35]}>
            <icosahedronGeometry args={[0.28, 0]} />
          </mesh>
        ))}
      </group>
    )
  return (
    <group position={[x, 0, y]} scale={s}>
      <mesh position={[0, 0.7, 0]} material={mats.pot} castShadow>
        <cylinderGeometry args={[0.6, 0.45, 1.4, 20]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <mesh
          key={i}
          material={mats.leaf}
          castShadow
          position={[Math.cos(i * 0.9) * 0.45, 2.1 + (i % 3) * 0.7, Math.sin(i * 0.9) * 0.45]}
          rotation={[i * 0.4, i, 0]}
          scale={[0.9, 0.25, 0.6]}
        >
          <sphereGeometry args={[0.8, 10, 8]} />
        </mesh>
      ))}
      <mesh position={[0, 2, 0]} material={mats.wood}>
        <cylinderGeometry args={[0.05, 0.06, 2.4, 6]} />
      </mesh>
    </group>
  )
}

function Pendant({ x, y, drop = 3.2 }: { x: number; y: number; drop?: number }) {
  return (
    <group position={[x, CEILING, y]}>
      <mesh position={[0, -drop / 2, 0]} material={mats.frame}>
        <cylinderGeometry args={[0.012, 0.012, drop, 4]} />
      </mesh>
      <mesh position={[0, -drop, 0]} material={mats.led}>
        <sphereGeometry args={[0.28, 20, 14]} />
      </mesh>
      <mesh position={[0, -drop + 0.18, 0]} material={mats.metal}>
        <cylinderGeometry args={[0.15, 0.32, 0.25, 20, 1, true]} />
      </mesh>
    </group>
  )
}

function Bedroom() {
  return (
    <>
      {/* Fluted headboard wall + cove wash */}
      <B x0={5 + PART} x1={12} y0={0} y1={0.22} z0={0} z1={CEILING - 0.5} m="accent" />
      <B x0={5 + PART} x1={12} y0={0.24} y1={0.3} z0={CEILING - 0.6} z1={CEILING - 0.55} m="led" cast={false} />
      <B x0={6.1} x1={11.3} y0={0.22} y1={0.5} z0={1.2} z1={4.3} m="fabric" />
      {/* Floating bed */}
      <B x0={6.6} x1={10.8} y0={0.7} y1={6.3} z0={0} z1={0.6} m="black" />
      <B x0={6.55} x1={10.85} y0={0.65} y1={6.35} z0={0.03} z1={0.07} m="led" cast={false} />
      <B x0={6.2} x1={11.2} y0={0.5} y1={6.75} z0={0.6} z1={1.05} m="wood" />
      <B x0={6.3} x1={11.1} y0={0.6} y1={6.65} z0={1.05} z1={1.75} m="white" />
      <B x0={6.24} x1={11.16} y0={3} y1={6.72} z0={1.5} z1={1.9} m="fabric2" />
      <B x0={6.6} x1={8.55} y0={0.75} y1={1.75} z0={1.75} z1={2.25} m="white" />
      <B x0={8.85} x1={10.8} y0={0.75} y1={1.75} z0={1.75} z1={2.25} m="white" />
      {/* Floating nightstands + pendants */}
      <B x0={5.45} x1={6.1} y0={0.22} y1={1.4} z0={1.6} z1={2.2} m="wood" />
      <B x0={11.3} x1={11.95} y0={0.22} y1={1.4} z0={1.6} z1={2.2} m="wood" />
      <Pendant x={5.78} y={0.9} drop={5.2} />
      <Pendant x={11.62} y={0.9} drop={5.2} />
      {/* 7 ft sliding wardrobe + loft */}
      <B x0={0} x1={1.95} y0={7.5} y1={14.5} z0={0} z1={CEILING} m="wood" />
      <B x0={1.95} x1={2.02} y0={7.55} y1={11} z0={0.15} z1={6.9} m="accent" />
      <B x0={2.02} x1={2.08} y0={10.9} y1={14.45} z0={0.15} z1={6.9} m="mirror" />
      <B x0={1.95} x1={2.0} y0={7.55} y1={14.45} z0={7.05} z1={CEILING - 0.1} m="accent" />
      <B x0={2.02} x1={2.1} y0={10.85} y1={10.95} z0={3} z1={4.5} m="metal" />
      {/* Floating dresser + arched backlit mirror */}
      <B x0={10.75} x1={12} y0={8} y1={11.5} z0={2.4} z1={2.85} m="wood" />
      <Arch at={[12, 9.75]} w={2.2} h={3.8} z0={3.3} facing="-x" m="mirror" halo />
      <mesh position={[10, 0.9, 9.75]} material={mats.fabric} castShadow>
        <cylinderGeometry args={[0.6, 0.55, 1.6, 20]} />
      </mesh>
      {/* Window bench */}
      <B x0={4} x1={8.5} y0={13.75} y1={D_WEST} z0={0} z1={1.4} m="wood" />
      <B x0={4.05} x1={8.45} y0={13.8} y1={D_WEST} z0={1.4} z1={1.7} m="fabric" />
      <B x0={4.3} x1={5.4} y0={14.45} y1={D_WEST} z0={1.7} z1={2.7} m="fabric2" />
      <B x0={7.2} x1={8.3} y0={14.45} y1={D_WEST} z0={1.7} z1={2.7} m="fabric2" />
    </>
  )
}

function Bath() {
  return (
    <>
      {/* Wall-hung WC on the north wall */}
      <B x0={0.02} x1={1.75} y0={3.8} y1={4.95} z0={1.0} z1={1.45} m="white" />
      <B x0={0.02} x1={0.6} y0={3.75} y1={5.0} z0={0.7} z1={2.6} m="white" />
      <B x0={0.02} x1={0.06} y0={4.1} y1={4.65} z0={3.1} z1={3.5} m="metal" />
      {/* Floating vanity + basin on the bath partition */}
      <B x0={3.65} x1={5} y0={3.2} y1={4.7} z0={2.0} z1={2.65} m="wood" />
      <mesh position={[4.3, 2.8, 3.95]} material={mats.white} castShadow>
        <cylinderGeometry args={[0.55, 0.45, 0.3, 28]} />
      </mesh>
      <B x0={4.85} x1={5} y0={3.9} y1={4.0} z0={2.9} z1={3.4} m="metal" />
      <Arch at={[5, 3.95]} w={1.4} h={3} z0={3.6} facing="-x" m="mirror" halo />
      {/* Hand shower + LED niche */}
      <B x0={0.02} x1={0.15} y0={1.25} y1={1.6} z0={3.4} z1={3.75} m="metal" />
      <B x0={0.05} x1={0.12} y0={1.38} y1={1.46} z0={3.75} z1={6.2} m="metal" />
      <B x0={0.1} x1={0.35} y0={1.3} y1={1.55} z0={6.2} z1={6.4} m="metal" />
      <B x0={2} x1={4} y0={0.02} y1={0.25} z0={3.7} z1={3.75} m="led" cast={false} />
      <B x0={2} x1={4} y0={0.02} y1={0.18} z0={3.5} z1={4.6} m="bathTile" />
      {/* Towel rail by the door */}
      <B x0={0.1} x1={0.2} y0={5.6} y1={6.7} z0={4.2} z1={4.28} m="metal" />
      <B x0={0.15} x1={0.32} y0={5.65} y1={6.65} z0={3.1} z1={4.25} m="fabric" />
      <mesh position={[2.5, BATH_LIGHT, 3.5]} material={mats.led}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 20]} />
      </mesh>
    </>
  )
}

function Hall({ arches, plants }: { arches: boolean; plants: number }) {
  return (
    <>
      {/* Kitchenette run on the east wall */}
      <B x0={14.45} x1={21} y0={0.1} y1={1.85} z0={0} z1={0.33} m="black" />
      <B x0={14.45} x1={21} y0={0} y1={2} z0={0.33} z1={2.75} m="wood" />
      <B x0={14.4} x1={21} y0={0} y1={2.1} z0={2.75} z1={2.9} m="counter" />
      <B x0={12.4} x1={14.4} y0={0} y1={2.2} z0={0} z1={6.3} m="steel" />
      <B x0={14.3} x1={14.38} y0={2.0} y1={2.1} z0={2} z1={5} m="metal" />
      <B x0={15.6} x1={17.2} y0={0.4} y1={1.6} z0={2.88} z1={2.92} m="black" />
      <B x0={16.3} x1={16.45} y0={0.2} y1={0.35} z0={2.9} z1={3.8} m="metal" />
      <B x0={16.3} x1={16.45} y0={0.2} y1={0.9} z0={3.7} z1={3.8} m="metal" />
      <B x0={18.4} x1={20.2} y0={0.3} y1={1.7} z0={2.9} z1={2.93} m="black" />
      {[18.85, 19.75].map(x => (
        <mesh key={x} position={[x, 2.95, 1]} rotation={[-Math.PI / 2, 0, 0]} material={mats.ledCool}>
          <ringGeometry args={[0.22, 0.27, 24]} />
        </mesh>
      ))}
      <B x0={18.45} x1={20.15} y0={0} y1={1.7} z0={5.3} z1={5.8} m="metal" />
      <B x0={18.95} x1={19.65} y0={0} y1={0.7} z0={5.8} z1={7.8} m="metal" />
      <B x0={14.45} x1={18.4} y0={0} y1={1.15} z0={4.75} z1={7.4} m="accent" />
      <B x0={20.2} x1={21} y0={0} y1={1.15} z0={4.75} z1={7.4} m="accent" />
      <B x0={14.45} x1={21} y0={0.95} y1={1.05} z0={4.7} z1={4.75} m="led" cast={false} />
      {/* Floating shoe cabinet + mirror */}
      <B x0={23.6} x1={W} y0={4} y1={6} z0={0.6} z1={3.2} m="wood" />
      <B x0={23.55} x1={W} y0={3.95} y1={6.05} z0={0.53} z1={0.58} m="led" cast={false} />
      <mesh position={[W - 0.05, 5.3, 5]} rotation={[0, -Math.PI / 2, 0]} material={mats.mirror}>
        <circleGeometry args={[0.9, 32]} />
      </mesh>
      {/* Fluted TV wall + floating console */}
      <B x0={24.82} x1={W} y0={6.25} y1={11.25} z0={0} z1={8.6} m="accent" />
      <B x0={23.6} x1={24.82} y0={6.25} y1={11.25} z0={1} z1={1.9} m="wood" />
      <B x0={23.55} x1={24.82} y0={6.2} y1={11.3} z0={0.93} z1={0.98} m="led" cast={false} />
      <B x0={24.62} x1={24.8} y0={6.75} y1={10.75} z0={3.4} z1={5.75} m="tv" />
      {/* Sofa-cum-bed */}
      <B x0={12.6} x1={15.25} y0={5.5} y1={11.5} z0={0.35} z1={1.45} m="fabric" />
      <B x0={12.4} x1={13.3} y0={5.5} y1={11.5} z0={1.45} z1={2.9} m="fabric" />
      <B x0={13.3} x1={15.25} y0={5.5} y1={6.05} z0={1.45} z1={2.15} m="fabric" />
      <B x0={13.3} x1={15.25} y0={10.95} y1={11.5} z0={1.45} z1={2.15} m="fabric" />
      <B x0={13.3} x1={15.1} y0={6.1} y1={8.45} z0={1.45} z1={1.8} m="fabric" />
      <B x0={13.3} x1={15.1} y0={8.55} y1={10.9} z0={1.45} z1={1.8} m="fabric" />
      <B x0={13.3} x1={13.75} y0={6.4} y1={7.5} z0={1.8} z1={2.8} m="fabric2" />
      <B x0={13.3} x1={13.75} y0={9.5} y1={10.6} z0={1.8} z1={2.8} m="fabric2" />
      {/* Nesting coffee tables */}
      <mesh position={[17.6, 1.3, 8.6]} material={mats.wood} castShadow>
        <cylinderGeometry args={[1, 1, 0.12, 40]} />
      </mesh>
      <mesh position={[17.6, 0.62, 8.6]} material={mats.metal}>
        <cylinderGeometry args={[0.18, 0.4, 1.25, 16]} />
      </mesh>
      <mesh position={[18.5, 0.95, 9.5]} material={mats.counter} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.1, 32]} />
      </mesh>
      <mesh position={[18.5, 0.45, 9.5]} material={mats.metal}>
        <cylinderGeometry args={[0.1, 0.25, 0.9, 12]} />
      </mesh>
      {/* Window bar for two */}
      <B x0={13} x1={17.5} y0={14} y1={15} z0={3.3} z1={3.45} m="counter" />
      <B x0={13.2} x1={13.35} y0={14.3} y1={14.9} z0={0} z1={3.3} m="metal" />
      <B x0={17.15} x1={17.3} y0={14.3} y1={14.9} z0={0} z1={3.3} m="metal" />
      {[14.25, 16.25].map(x => (
        <group key={x}>
          <mesh position={[x, 2.45, 13.3]} material={mats.fabric2} castShadow>
            <cylinderGeometry args={[0.55, 0.5, 0.25, 20]} />
          </mesh>
          <mesh position={[x, 1.2, 13.3]} material={mats.metal}>
            <cylinderGeometry args={[0.05, 0.3, 2.4, 10]} />
          </mesh>
          <Pendant x={x} y={14.4} drop={3.6} />
        </group>
      ))}
      {/* Feature wall behind the sofa: arch (Boho) or framed art */}
      {arches ? (
        <Arch at={[12 + PART, 8.5]} w={4.6} h={7.6} z0={0} facing="+x" m="accent" />
      ) : (
        <>
          <B x0={12 + PART} x1={12.45} y0={6.6} y1={10.4} z0={4} z1={6.6} m="frame" />
          <B x0={12.45} x1={12.48} y0={6.75} y1={10.25} z0={4.15} z1={6.45} m="accent" />
        </>
      )}
      <Plant x={24.3} y={12.5} />
      {plants >= 3 && <Plant x={21.6} y={1.4} s={0.6} />}
      {plants >= 4 && <Plant x={14.7} y={12.4} hanging />}
      {plants >= 5 && <Plant x={4.5} y={12.8} hanging />}
      {plants >= 6 && <Plant x={22} y={14.2} s={0.75} />}
      {plants >= 6 && <Plant x={9.6} y={14.2} hanging />}
    </>
  )
}

export function Furniture() {
  const show = useStore(s => s.showFurniture)
  const theme = useStore(s => s.theme)
  const t = themeById[theme]
  if (!show) return null
  return (
    <Explode level={1}>
      <Bedroom />
      <Bath />
      <Hall arches={t.arches} plants={t.plants} />
    </Explode>
  )
}
