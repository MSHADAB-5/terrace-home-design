import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'
import { themeById } from '../data/themes'
import { applyThemeMaps, mats, themedKeys } from './materials'

export function ThemeAnimator() {
  const theme = useStore(s => s.theme)
  const reduced = useStore(s => s.reducedMotion)
  const targets = useMemo(() => {
    const c = themeById[theme].colors
    return Object.fromEntries(themedKeys.map(k => [k, new THREE.Color(c[k])])) as Record<(typeof themedKeys)[number], THREE.Color>
  }, [theme])

  useEffect(() => applyThemeMaps(themeById[theme]), [theme])

  useFrame((_, dt) => {
    const k = reduced ? 1 : 1 - Math.exp(-dt * 4)
    for (const key of themedKeys) mats[key].color.lerp(targets[key], k)
  })
  return null
}
