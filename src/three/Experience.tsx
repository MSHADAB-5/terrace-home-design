import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { ThemeAnimator } from './ThemeAnimator'
import { Lighting } from './Lighting'
import { Structure } from './Structure'
import { Roof } from './Roof'
import { Furniture } from './Furniture'
import { Doors } from './Doors'
import { Hotspots } from './Hotspots'
import { Dimensions } from './Dimensions'
import { CameraRig } from './CameraRig'

export default function Experience({ onReady }: { onReady: () => void }) {
  const [small] = useState(() => window.innerWidth < 760)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady))
    return () => cancelAnimationFrame(id)
  }, [onReady])

  return (
    <Canvas
      shadows
      dpr={[1, small ? 1.5 : 1.75]}
      camera={{ fov: 45, near: 0.1, far: 1500, position: [75, 60, 105] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <ThemeAnimator />
        <Lighting />
        <Structure />
        <Roof />
        <Furniture />
        <Doors />
        <Hotspots />
        <Dimensions />
        <CameraRig />
        {!small && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.9} />
            <Vignette offset={0.3} darkness={0.45} />
          </EffectComposer>
        )}
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  )
}
