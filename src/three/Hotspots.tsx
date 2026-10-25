import { Html } from '@react-three/drei'
import { features } from '../data/features'
import { useStore } from '../store'

export function Hotspots() {
  const explorer = useStore(s => s.explorer)
  const show = useStore(s => s.showHotspots)
  const view = useStore(s => s.view)
  const selected = useStore(s => s.selectedFeature)
  const roofOn = useStore(s => s.showRoof)
  const exploded = useStore(s => s.exploded)
  const set = useStore(s => s.set)

  const list = explorer
    ? show && view !== 'walk' && !exploded
      ? features.filter(f => !(f.id === 'roof' && view === 'orbit' && !roofOn) && !(f.id === 'roof' && view === 'plan'))
      : []
    : features.filter(f => f.id === selected)

  return (
    <>
      {list.map(f => (
        <Html key={f.id} position={f.at} center zIndexRange={[20, 0]}>
          <button
            className={`hotspot ${selected === f.id ? 'active' : ''}`}
            aria-label={f.title}
            title={f.title}
            onClick={() => explorer && set({ selectedFeature: selected === f.id ? null : f.id })}
          >
            <span />
          </button>
        </Html>
      ))}
    </>
  )
}
