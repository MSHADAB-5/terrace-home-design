import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { daylight, useStore, type LightScene } from '../store'
import { themeById } from '../data/themes'
import { mats } from './materials'

const R = 80
const CENTER = new THREE.Vector3(12.5, 0, 18)

/** Sun rises in the east (−Z), arcs through the southern sky (+X) and sets in the west (+Z). */
function sunDirection(time: number) {
  const a = ((time - 6) / 12) * Math.PI
  return new THREE.Vector3(0.38 * Math.sin(a), Math.sin(a), -Math.cos(a)).normalize()
}

interface Levels {
  led: number
  lamps: number
  tv: number
  tint: string | null
}

function levels(scene: LightScene, day: number): Levels {
  switch (scene) {
    case 'morning': return { led: 0.8, lamps: 0.5, tv: 0, tint: '#ffe3b8' }
    case 'work': return { led: 1.4, lamps: 1.6, tv: 0, tint: '#fff6ea' }
    case 'movie': return { led: 1.6, lamps: 0.12, tv: 1.4, tint: '#7f9cff' }
    case 'romance': return { led: 2.2, lamps: 0.3, tv: 0, tint: '#ff8a66' }
    case 'night': return { led: 0.5, lamps: 0.04, tv: 0, tint: '#ffb36b' }
    default: {
      const n = 1 - day
      return { led: 0.25 + n * 2.4, lamps: n * 1.1, tv: 0, tint: null }
    }
  }
}

const lampSpots: [number, number, number][] = [
  [8.5, 8.6, 8], [18.5, 8.6, 7.5], [21.5, 7.4, 2.4], [12.5, 8.2, 21], [18.5, 8.6, 13],
]

export function Lighting() {
  const time = useStore(s => s.time)
  const theme = useStore(s => s.theme)
  const sun = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const lamps = useRef<(THREE.PointLight | null)[]>([])
  const tvLight = useRef<THREE.PointLight>(null)
  const day = daylight(time)
  const dir = useMemo(() => sunDirection(time), [time])
  const sunPos = useMemo(() => dir.clone().multiplyScalar(R).add(CENTER), [dir])
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.copy(CENTER)
    return o
  }, [])
  const ledTarget = useMemo(() => new THREE.Color(), [])
  const lampColor = useMemo(() => new THREE.Color(), [])
  const bg = useMemo(() => new THREE.Color(), [])

  useFrame(({ scene: s3 }, dt) => {
    const st = useStore.getState()
    const d = daylight(st.time)
    const lv = levels(st.scene, d)
    const k = 1 - Math.exp(-dt * 3)
    ledTarget.set(lv.tint ?? themeById[st.theme].colors.led)
    mats.led.emissive.lerp(ledTarget, k)
    mats.led.emissiveIntensity += (lv.led - mats.led.emissiveIntensity) * k
    mats.ledCool.emissiveIntensity = st.scene === 'work' ? 1.5 : 0.2
    mats.tv.emissiveIntensity += (lv.tv * 0.9 - mats.tv.emissiveIntensity) * k
    mats.skylight.emissiveIntensity = 0.1 + d * 0.5
    lampColor.set(lv.tint ?? themeById[st.theme].colors.led)
    for (const l of lamps.current) {
      if (!l) continue
      l.intensity += (lv.lamps * 22 - l.intensity) * k
      l.color.lerp(lampColor, k)
    }
    if (tvLight.current) tvLight.current.intensity += (lv.tv * 18 - tvLight.current.intensity) * k
    if (sun.current) sun.current.intensity = 3.2 * d
    if (hemi.current) hemi.current.intensity = 0.15 + d * 0.85
    bg.setRGB(0.04 + d * 0.5, 0.05 + d * 0.62, 0.11 + d * 0.8)
    if (s3.background instanceof THREE.Color) s3.background.lerp(bg, k)
    else s3.background = bg.clone()
    if (s3.fog) s3.fog.color.copy(s3.background as THREE.Color)
  })

  const evening = time > 16 && time < 19
  return (
    <>
      <fog attach="fog" args={['#9fb6d0', 90, 260]} />
      {day > 0.05 && (
        <Sky distance={4000} sunPosition={dir.toArray()} turbidity={evening ? 9 : 5} rayleigh={evening ? 3 : 1.2} mieCoefficient={0.006} mieDirectionalG={0.85} />
      )}
      {day < 0.35 && <Stars radius={300} depth={60} count={2500} factor={5} fade speed={0.6} />}
      <hemisphereLight ref={hemi} args={['#dfefff', '#b5a48e', 0.6]} />
      <primitive object={target} />
      <directionalLight
        ref={sun}
        position={sunPos}
        target={target}
        color={evening ? '#ffc58a' : '#fff5e8'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={10}
        shadow-camera-far={200}
      />
      {lampSpots.map((p, i) => (
        <pointLight key={i} ref={el => { lamps.current[i] = el }} position={p} distance={22} decay={1.6} intensity={0} />
      ))}
      <pointLight ref={tvLight} position={[13.9, 4.6, 10.75]} color="#6f8fff" distance={14} decay={1.5} intensity={0} />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={1.2} position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[30, 30, 1]} />
        <Lightformer intensity={0.6} position={[0, 2, 20]} scale={[30, 6, 1]} color={themeById[theme].colors.led} />
        <Lightformer intensity={0.4} position={[-20, 4, 0]} rotation={[0, Math.PI / 2, 0]} scale={[20, 6, 1]} />
      </Environment>
    </>
  )
}
