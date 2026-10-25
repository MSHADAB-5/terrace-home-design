import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PointerLockControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useStore } from '../store'
import { blockers, overviewShot, planShot, roomShots, tourStops, type Shot } from '../data/layout'
import { features } from '../data/features'
import { walkInput } from './walkInput'

const goalPos = new THREE.Vector3(...overviewShot.pos)
const goalTarget = new THREE.Vector3(...overviewShot.target)
const lookAt = new THREE.Vector3(...overviewShot.target)
const EYE = 5.4
const RADIUS = 0.7
const SPEED = 6

const doorRects = {
  entry: [25, 0.5, 25.75, 3.75],
  bedroom: [12, 11.9, 12.375, 14.6],
  bath: [2.25, 7, 4.75, 7.375],
  sitout: [19.5, 15, 23.5, 15.75],
} as const

function Walk() {
  const { camera } = useThree()
  const keys = useRef(new Set<string>())
  const staticRects = useRef(blockers(true))

  useEffect(() => {
    camera.position.set(23.2, EYE, 2.6)
    camera.lookAt(14, EYE - 0.6, 12)
    const down = (e: KeyboardEvent) => keys.current.add(e.code)
    const up = (e: KeyboardEvent) => keys.current.delete(e.code)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [camera])

  useFrame((_, dt) => {
    const k = keys.current
    const doors = useStore.getState().doors
    const rects = [...staticRects.current]
    for (const id of Object.keys(doorRects) as (keyof typeof doorRects)[])
      if (!doors[id]) rects.push([...doorRects[id]])
    const hit = (x: number, z: number) =>
      x < -5 || x > 33 || z < -4 || z > 28 ||
      rects.some(([x0, y0, x1, y1]) => x > x0 - RADIUS && x < x1 + RADIUS && z > y0 - RADIUS && z < y1 + RADIUS)

    let fwd = walkInput.forward
    let side = 0
    if (k.has('KeyW') || k.has('ArrowUp')) fwd += 1
    if (k.has('KeyS') || k.has('ArrowDown')) fwd -= 1
    if (k.has('KeyA')) side -= 1
    if (k.has('KeyD')) side += 1
    let turn = walkInput.turn
    if (k.has('ArrowLeft')) turn -= 1
    if (k.has('ArrowRight')) turn += 1
    if (turn) camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -turn * dt * 1.8)
    if (!fwd && !side) return

    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    dir.y = 0
    dir.normalize()
    const right = new THREE.Vector3(-dir.z, 0, dir.x)
    const step = dir.multiplyScalar(fwd).add(right.multiplyScalar(side)).normalize().multiplyScalar(SPEED * Math.min(dt, 0.05))
    const p = camera.position
    if (!hit(p.x + step.x, p.z)) camera.position.setX(p.x + step.x)
    if (!hit(p.x, p.z + step.z)) camera.position.setZ(p.z + step.z)
    camera.position.setY(EYE)
  })

  return <PointerLockControls selector="#walk-lock" />
}

export function CameraRig() {
  const explorer = useStore(s => s.explorer)
  const view = useStore(s => s.view)
  const tourIndex = useStore(s => s.tourIndex)
  const room = useStore(s => s.selectedRoom)
  const feature = useStore(s => s.selectedFeature)
  const scrollShot = useStore(s => s.scrollShot)
  const controls = useRef<OrbitControlsImpl>(null)
  const flying = useRef(true)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(75, 60, 105)
  }, [camera])

  useEffect(() => {
    let shot: Shot | undefined
    if (!explorer) shot = scrollShot ?? overviewShot
    else if (view === 'plan') shot = planShot
    else if (view === 'tour') shot = tourStops[tourIndex]
    else if (view === 'walk') return
    else if (feature) {
      const f = features.find(x => x.id === feature)
      if (f) shot = { pos: f.cam, target: f.look }
    } else if (room) shot = roomShots[room]
    shot ??= overviewShot
    goalPos.set(...shot.pos)
    goalTarget.set(...shot.target)
    flying.current = true
  }, [explorer, view, tourIndex, room, feature, scrollShot])

  // Tour auto-advance
  useEffect(() => {
    if (!explorer || view !== 'tour' || useStore.getState().reducedMotion) return
    const id = setTimeout(() => useStore.getState().set({ tourIndex: (tourIndex + 1) % tourStops.length }), 6500)
    return () => clearTimeout(id)
  }, [explorer, view, tourIndex])

  // Leaving walk mode: re-sync the look target with where the camera faces.
  useEffect(() => {
    if (view !== 'walk') return
    return () => {
      const d = new THREE.Vector3()
      camera.getWorldDirection(d)
      lookAt.copy(camera.position).add(d.multiplyScalar(6))
    }
  }, [view, camera])

  useFrame((_, dt) => {
    const s = useStore.getState()
    if (s.explorer && s.view === 'walk') return
    if (flying.current) {
      const rate = s.reducedMotion ? 60 : s.explorer ? 2.6 : 1.7
      const k = 1 - Math.exp(-dt * rate)
      camera.position.lerp(goalPos, k)
      lookAt.lerp(goalTarget, k)
      if (controls.current) controls.current.target.copy(lookAt)
      if (controls.current && camera.position.distanceTo(goalPos) < 0.05 && lookAt.distanceTo(goalTarget) < 0.05)
        flying.current = false
    } else if (controls.current) lookAt.copy(controls.current.target)
    if (!controls.current) camera.lookAt(lookAt)
  })

  if (explorer && view === 'walk') return <Walk />
  if (!explorer || view === 'tour') return null
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={lookAt.toArray()}
      enableRotate={view !== 'plan'}
      enableDamping
      maxPolarAngle={view === 'plan' ? 0.01 : Math.PI / 2.05}
      minDistance={3}
      maxDistance={130}
      onStart={() => (flying.current = false)}
    />
  )
}
