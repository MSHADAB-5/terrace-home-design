import { useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import { features } from '../data/features'
import { themes } from '../data/themes'
import { rooms, type Shot } from '../data/layout'
import { useStore } from '../store'
import { Plan2D } from './Plan2D'
import { fmtTime } from './format'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const shots = {
  hero: { pos: [40, 52, 40], target: [12.5, 2, 18] },
  plan: { pos: [12.5, 64, 19.6], target: [12.5, 0, 19.5] },
  styles: { pos: [21, 27, 33], target: [12, 0, 7.5] },
  day: { pos: [12.5, 8, 47], target: [12.5, 5.5, 8] },
  specs: { pos: [-24, 34, 56], target: [12.5, 3, 18] },
} satisfies Record<string, Shot>

function useShot(ref: RefObject<HTMLElement | null>, shot: Shot, roof: boolean, extra?: () => void) {
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: self => {
        if (!self.isActive) return
        useStore.getState().set({ scrollShot: shot, scrollRoof: roof, selectedFeature: null })
        extra?.()
      },
    })
  }, { scope: ref })
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  useShot(ref, shots.hero, false)
  const set = useStore(s => s.set)
  const words = ['A', '25 × 15 ft', 'terrace', 'home']
  return (
    <section ref={ref} className="section hero">
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        Concept preview · v3
      </motion.p>
      <h1>
        {words.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {w}{' '}
          </motion.span>
        ))}
      </h1>
      <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        A full 12 × 15 ft bedroom, a hall with an L-shaped kitchenette, a compact bath at the stair entry, and one
        insulated sheet roof that slopes west over the first 12 ft of a 25 × 23 ft terrace.
      </motion.p>
      <motion.div className="hero-cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
        <button className="cta" onClick={() => set({ explorer: true, view: 'orbit', selectedRoom: null, selectedFeature: null })}>
          Explore in 3D
        </button>
        <button className="cta ghost" onClick={() => set({ explorer: true, view: 'tour', tourIndex: 0, selectedFeature: null })}>
          Take the tour
        </button>
      </motion.div>
      <div className="scroll-cue" aria-hidden>Scroll</div>
    </section>
  )
}

export function PlanSection() {
  const ref = useRef<HTMLElement>(null)
  const [dims, setDims] = useState(true)
  const [furnished, setFurnished] = useState(100)
  useShot(ref, shots.plan, false)
  useGSAP(() => {
    const reduced = useStore.getState().reducedMotion
    if (reduced) {
      gsap.set('.sketch', { opacity: 0 })
      return
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.plan-stage', start: 'top top', end: '+=160%', scrub: 0.6, pin: true },
    })
    tl.fromTo('.sketch', { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.15)
      .fromTo('.plan .wall', { strokeDashoffset: 1, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.004 }, 0.2)
      .to('.plan .wall', { fillOpacity: 1, duration: 0.1 }, 0.5)
      .fromTo('.plan .win, .plan .doors', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.55)
      .fromTo('.plan .room, .plan .room-label', { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.03 }, 0.6)
      .fromTo('.plan .furniture > *', { opacity: 0, scale: 0.6, transformOrigin: 'center', transformBox: 'fill-box' }, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.006 }, 0.72)
      .fromTo('.plan-copy li', { opacity: 0.25 }, { opacity: 1, stagger: 0.2, duration: 0.2 }, 0)
  }, { scope: ref })
  return (
    <section ref={ref} className="section plan-section">
      <div className="plan-stage">
        <div className="plan-copy">
          <p className="eyebrow">From your sketch to the plan</p>
          <h2>Suite on the north, social on the south</h2>
          <ul>
            <li>Stairs arrive at the south-east corner; the entry opens into a short passage to every room.</li>
            <li>The bath takes that corner, as sketched, freeing a full 12 × 15 ft bedroom with a study nook.</li>
            <li>The hall opens onto a 12 ft covered sit-out, then open terrace out to 39 ft.</li>
          </ul>
          <div className="row">
            <button className={`chip ${dims ? 'on' : ''}`} onClick={() => setDims(!dims)} aria-pressed={dims}>Dimensions</button>
          </div>
          <label className="ba">
            <span>Shell</span>
            <input type="range" min={0} max={100} value={furnished} onChange={e => setFurnished(Number(e.target.value))} aria-label="Before and after: shell vs furnished" />
            <span>Furnished</span>
          </label>
          <p className="hint">Hover a room for its size, click to open it in 3D.</p>
        </div>
        <Plan2D showDims={dims} furnishedPct={furnished} />
      </div>
    </section>
  )
}

function FeatureCard({ i }: { i: number }) {
  const f = features[i]
  const ref = useRef<HTMLElement>(null)
  useShot(ref, { pos: f.cam, target: f.look }, f.id === 'roof', () => useStore.getState().set({ selectedFeature: f.id }))
  return (
    <article ref={ref} className="feature">
      <small>{String(i + 1).padStart(2, '0')} · {rooms.find(r => r.id === f.room)?.name}</small>
      <h3>{f.title}</h3>
      <p>{f.text}</p>
    </article>
  )
}

export function FeaturesSection() {
  return (
    <section className="section features-section">
      <div className="features-intro">
        <p className="eyebrow">Walk-through</p>
        <h2>{features.length} ideas, room by room</h2>
      </div>
      {features.map((_, i) => <FeatureCard key={i} i={i} />)}
    </section>
  )
}

export function StylesSection() {
  const ref = useRef<HTMLElement>(null)
  useShot(ref, shots.styles, false)
  const theme = useStore(s => s.theme)
  const set = useStore(s => s.set)
  useGSAP(() => {
    gsap.from('.mood', {
      y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 70%' },
    })
  }, { scope: ref })
  return (
    <section ref={ref} className="section styles-section">
      <p className="eyebrow">Five styles, one layout</p>
      <h2>Pick a mood</h2>
      <div className="moods">
        {themes.map(t => (
          <button key={t.id} className={`mood ${theme === t.id ? 'on' : ''}`} onClick={() => set({ theme: t.id })} aria-pressed={theme === t.id}>
            <div className="swatches">
              {t.mood.map(c => <span key={c} style={{ background: c }} />)}
            </div>
            <strong>{t.name}</strong>
            <em>{t.tagline}</em>
            <small>{t.floorType} floor · {t.accentType} accents{t.arches ? ' · arches' : ''}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

export function DayNightSection() {
  const ref = useRef<HTMLElement>(null)
  const time = useStore(s => s.time)
  useShot(ref, shots.day, false, () => useStore.getState().set({ scene: 'auto' }))
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => useStore.getState().set({ time: 7 + self.progress * 15 }),
    })
  }, { scope: ref })
  return (
    <section ref={ref} className="section day-section">
      <div className="day-card">
        <p className="eyebrow">Sun path</p>
        <h2>{fmtTime(time)}</h2>
        <p>
          Morning sun comes over the east wall. By evening it drops below the sit-out roof and warms the west glass;
          after dark the cove LEDs, bed underglow and pendants take over.
        </p>
      </div>
    </section>
  )
}

export function SpecsSection() {
  const ref = useRef<HTMLElement>(null)
  useShot(ref, shots.specs, false)
  const areas = [...rooms.map(r => ({ label: r.name, value: r.area, size: r.size })), { label: 'Inside total', value: 375, size: "25' × 15'" }]
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.num').forEach(el => {
      const end = Number(el.dataset.v)
      const o = { v: 0 }
      gsap.to(o, {
        v: end, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => { el.textContent = String(Math.round(o.v)) },
      })
    })
  }, { scope: ref })
  return (
    <section ref={ref} className="section specs-section">
      <p className="eyebrow">Numbers</p>
      <h2>Areas and specs</h2>
      <div className="stats">
        {areas.map(a => (
          <div key={a.label} className="stat">
            <span className="num" data-v={a.value}>0</span><span className="unit">sq ft</span>
            <strong>{a.label}</strong>
            <small>{a.size}</small>
          </div>
        ))}
      </div>
      <div className="spec-grid">
        <div><h4>Roof</h4><p>Double-layer insulated sheets, single slope to the west. About 12'6" at the east wall and 9'9" at the sit-out edge, on slim steel posts.</p></div>
        <div><h4>Ceiling</h4><p>Flat false ceiling at 10 ft with cove LEDs. Bath ceiling at 8 ft with a storage loft above.</p></div>
        <div><h4>Walls</h4><p>9" outer brick, 4.5" partitions. Chimney and bath exhaust both vent through the east wall.</p></div>
        <div><h4>Light</h4><p>One skylight over the bed with a light-well and motorized blind. Glass-block corner window in the bath.</p></div>
      </div>
      <p className="disclaimer">
        Concept preview only: no cost estimates or construction drawings. Vastu not applied. A structural engineer
        should confirm the existing roof slab can carry the new walls and the steel frame for the sheet roof.
      </p>
      <footer>Built with React, Three.js and GSAP · all geometry generated in code</footer>
    </section>
  )
}
