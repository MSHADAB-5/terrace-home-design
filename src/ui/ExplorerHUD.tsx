import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { features } from '../data/features'
import { rooms, tourStops } from '../data/layout'
import { useStore, type DoorId, type ViewMode } from '../store'
import { walkInput } from '../three/walkInput'

const views: { id: ViewMode; label: string }[] = [
  { id: 'orbit', label: 'Orbit' },
  { id: 'plan', label: 'Top plan' },
  { id: 'tour', label: 'Guided tour' },
  { id: 'walk', label: 'Walk' },
]

const doorList: { id: DoorId; label: string }[] = [
  { id: 'entry', label: 'Entry' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'bath', label: 'Bath' },
  { id: 'sitout', label: 'Sit-out' },
]

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  )
}

function HoldButton({ label, onDown }: { label: string; onDown: () => void }) {
  const stop = () => {
    walkInput.forward = 0
    walkInput.turn = 0
  }
  return (
    <button
      className="pad"
      aria-label={label}
      onPointerDown={onDown}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {label}
    </button>
  )
}

export function ExplorerHUD() {
  const s = useStore()
  const { set } = s
  const feature = features.find(f => f.id === s.selectedFeature)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.pointerLockElement) set({ explorer: false })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [set])

  const setView = (v: ViewMode) => set({ view: v, selectedFeature: null, selectedRoom: null, tourIndex: 0 })
  const tourGo = (d: number) => set({ tourIndex: (s.tourIndex + d + tourStops.length) % tourStops.length })

  return (
    <motion.div className="hud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="hud-top">
        <button className="back" onClick={() => set({ explorer: false, exploded: false })}>← Back</button>
        <div className="tabs" role="tablist" aria-label="View mode">
          {views.map(v => (
            <button key={v.id} role="tab" aria-selected={s.view === v.id} className={s.view === v.id ? 'on' : ''} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {(s.view === 'orbit' || s.view === 'plan') && (
        <aside className="hud-panel">
          <h4>Go to</h4>
          <div className="row">
            {rooms.map(r => (
              <Toggle key={r.id} on={s.selectedRoom === r.id} onClick={() => set({ selectedRoom: r.id, selectedFeature: null })}>
                {r.name.split(' ')[0]}
              </Toggle>
            ))}
            <Toggle on={!s.selectedRoom && !s.selectedFeature} onClick={() => set({ selectedRoom: null, selectedFeature: null })}>All</Toggle>
          </div>
          <h4>Show</h4>
          <div className="row">
            {s.view === 'orbit' && <Toggle on={s.showRoof} onClick={() => set({ showRoof: !s.showRoof })}>Roof</Toggle>}
            <Toggle on={s.showFurniture} onClick={() => set({ showFurniture: !s.showFurniture })}>Furniture</Toggle>
            <Toggle on={s.showDims} onClick={() => set({ showDims: !s.showDims })}>Dimensions</Toggle>
            <Toggle on={s.showHotspots} onClick={() => set({ showHotspots: !s.showHotspots })}>Hotspots</Toggle>
            <Toggle on={s.exploded} onClick={() => set({ exploded: !s.exploded, showRoof: true })}>Exploded</Toggle>
          </div>
          <h4>Doors</h4>
          <div className="row">
            {doorList.map(d => (
              <Toggle key={d.id} on={s.doors[d.id]} onClick={() => s.toggleDoor(d.id)}>{d.label}</Toggle>
            ))}
          </div>
          <p className="hint">Drag to orbit · scroll to zoom · right-drag to pan · click doors to open</p>
        </aside>
      )}

      {s.view === 'tour' && (
        <div className="tour-bar">
          <button onClick={() => tourGo(-1)} aria-label="Previous stop">‹</button>
          <AnimatePresence mode="wait">
            <motion.div key={s.tourIndex} className="tour-label" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
              <small>{s.tourIndex + 1} / {tourStops.length}</small>
              {tourStops[s.tourIndex].label}
            </motion.div>
          </AnimatePresence>
          <button onClick={() => tourGo(1)} aria-label="Next stop">›</button>
          <div className="tour-dots">
            {tourStops.map((_, i) => <span key={i} className={i === s.tourIndex ? 'on' : ''} />)}
          </div>
        </div>
      )}

      {s.view === 'walk' && (
        <>
          <button id="walk-lock" className="walk-lock">Click to look around</button>
          <p className="walk-help">W A S D / arrows to move · mouse to look · Esc to release · doors block when closed</p>
          <div className="pads">
            <HoldButton label="⟲" onDown={() => (walkInput.turn = -1)} />
            <HoldButton label="▲" onDown={() => (walkInput.forward = 1)} />
            <HoldButton label="▼" onDown={() => (walkInput.forward = -1)} />
            <HoldButton label="⟳" onDown={() => (walkInput.turn = 1)} />
          </div>
        </>
      )}

      <AnimatePresence>
        {feature && (
          <motion.div
            key={feature.id}
            className="feature-card"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
          >
            <button className="close" onClick={() => set({ selectedFeature: null })} aria-label="Close">×</button>
            <small>{rooms.find(r => r.id === feature.room)?.name}</small>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
