import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from './store'
import { Loader } from './ui/Loader'
import { ControlBar } from './ui/ControlBar'
import { ExplorerHUD } from './ui/ExplorerHUD'
import { DayNightSection, FeaturesSection, Hero, PlanSection, SpecsSection, StylesSection } from './ui/sections'
import './App.css'

const Experience = lazy(() => import('./three/Experience'))

export default function App() {
  const explorer = useStore(s => s.explorer)
  const [ready, setReady] = useState(false)
  const lenis = useRef<Lenis | null>(null)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (useStore.getState().reducedMotion) return
    const l = new Lenis({ autoRaf: false, lerp: 0.09 })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('explorer', explorer)
    if (explorer) lenis.current?.stop()
    else lenis.current?.start()
  }, [explorer])

  return (
    <>
      <div className={`stage ${explorer ? 'live' : ''}`}>
        <Suspense fallback={null}>
          <Experience onReady={onReady} />
        </Suspense>
      </div>
      <Loader done={ready} />
      <main className={explorer ? 'away' : ''} aria-hidden={explorer}>
        <Hero />
        <PlanSection />
        <FeaturesSection />
        <StylesSection />
        <DayNightSection />
        <SpecsSection />
      </main>
      <AnimatePresence>{explorer && <ExplorerHUD key="hud" />}</AnimatePresence>
      <ControlBar />
    </>
  )
}
