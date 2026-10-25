import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useStore } from '../store'

const GAP = 5.5

/** Lifts its children when the exploded view is on. */
export function Explode({ level, children }: { level: number; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    const s = useStore.getState()
    const target = s.explorer && s.exploded ? level * GAP : 0
    const g = ref.current
    if (!g) return
    g.position.y += (target - g.position.y) * (1 - Math.exp(-dt * (s.reducedMotion ? 60 : 3.5)))
  })
  return <group ref={ref}>{children}</group>
}
