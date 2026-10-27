import { useRef, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import type { Group } from 'three'
import { useStore, type DoorId } from '../store'
import { boxGeo } from './geometry'
import { mats } from './materials'
import { Explode } from './Explode'

function useDoorProgress(id: DoorId) {
  const p = useRef(useStore.getState().doors[id] ? 1 : 0)
  useFrame((_, dt) => {
    const s = useStore.getState()
    const target = s.doors[id] ? 1 : 0
    p.current += (target - p.current) * (1 - Math.exp(-dt * (s.reducedMotion ? 60 : 4)))
  })
  return p
}

function Clickable({ id, children }: { id: DoorId; children: ReactNode }) {
  const toggle = useStore(s => s.toggleDoor)
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    toggle(id)
  }
  return (
    <group
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      {children}
    </group>
  )
}

function SwingDoor({ id, pivot, len, dir, openAngle, m }: {
  id: DoorId; pivot: [number, number]; len: number; dir: 1 | -1; openAngle: number; m: 'wood' | 'wall'
}) {
  const p = useDoorProgress(id)
  const ref = useRef<Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.rotation.y = openAngle * p.current
  })
  return (
    <Clickable id={id}>
      <group ref={ref} position={[pivot[0], 0, pivot[1]]}>
        <mesh position={[0, 3.5, (dir * len) / 2]} geometry={boxGeo(0.15, 7, len - 0.05)} material={mats[m]} castShadow />
        <mesh position={[0.1, 3.4, dir * (len - 0.35)]} geometry={boxGeo(0.06, 0.1, 0.5)} material={mats.metal} />
        <mesh position={[-0.1, 3.4, dir * (len - 0.35)]} geometry={boxGeo(0.06, 0.1, 0.5)} material={mats.metal} />
      </group>
    </Clickable>
  )
}

function BathSlider() {
  const p = useDoorProgress('bath')
  const ref = useRef<Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.position.x = 19.55 + 2.45 * p.current
  })
  return (
    <Clickable id="bath">
      {/* Runs on the bath side of the wall so it never meets the open entry door */}
      <group ref={ref} position={[19.55, 3.55, 4.69]}>
        <mesh geometry={boxGeo(2.6, 7.1, 0.06)} material={mats.frosted} />
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[-1.2 + i * 0.22, 0, -0.035]} geometry={boxGeo(0.03, 7, 0.02)} material={mats.frosted} />
        ))}
        <mesh position={[-1.15, 0, -0.06]} geometry={boxGeo(0.06, 1.6, 0.06)} material={mats.metal} />
      </group>
      <mesh position={[20.8, 7.2, 4.69]} geometry={boxGeo(5.4, 0.12, 0.12)} material={mats.frame} />
    </Clickable>
  )
}

/** Four-panel slide-and-fold glass door that stacks at the south end. */
function FoldingDoor() {
  const p = useDoorProgress('sitout')
  const refs = useRef<(Group | null)[]>([])
  const x0 = 19.5, n = 4, pw = 1, z = 15.375
  useFrame(() => {
    const t = p.current
    refs.current.forEach((g, i) => {
      if (!g) return
      const closedX = x0 + i * pw + pw / 2
      const openX = 23.35 - (n - 1 - i) * 0.14
      g.position.x = closedX + (openX - closedX) * t
      g.position.z = z + (i % 2 ? 0.25 : -0.25) * t + 0.45 * t
      g.rotation.y = (Math.PI / 2) * t * (i % 2 ? -1 : 1) * 0.98
    })
  })
  return (
    <Clickable id="sitout">
      {Array.from({ length: n }, (_, i) => (
        <group key={i} ref={el => { refs.current[i] = el }} position={[x0 + i * pw + pw / 2, 3.75, z]}>
          <mesh geometry={boxGeo(pw - 0.04, 7.4, 0.04)} material={mats.glass} />
          <mesh position={[-pw / 2 + 0.04, 0, 0]} geometry={boxGeo(0.08, 7.5, 0.12)} material={mats.frame} />
          <mesh position={[pw / 2 - 0.04, 0, 0]} geometry={boxGeo(0.08, 7.5, 0.12)} material={mats.frame} />
          <mesh position={[0, 3.7, 0]} geometry={boxGeo(pw, 0.08, 0.12)} material={mats.frame} />
          <mesh position={[0, -3.7, 0]} geometry={boxGeo(pw, 0.08, 0.12)} material={mats.frame} />
        </group>
      ))}
    </Clickable>
  )
}

export function Doors() {
  return (
    <Explode level={2}>
      <SwingDoor id="entry" pivot={[25.15, 5.25]} len={3.2} dir={1} openAngle={-Math.PI / 2 * 0.95} m="wood" />
      <SwingDoor id="bedroom" pivot={[12.19, 7.85]} len={2.65} dir={-1} openAngle={Math.PI / 2 * 0.95} m="wall" />
      <BathSlider />
      <FoldingDoor />
    </Explode>
  )
}
