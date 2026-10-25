import { themes } from '../data/themes'
import { useStore, type LightScene } from '../store'
import { fmtTime } from './format'

const scenes: { id: LightScene; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'morning', label: 'Morning' },
  { id: 'work', label: 'Work' },
  { id: 'movie', label: 'Movie' },
  { id: 'romance', label: 'Romance' },
  { id: 'night', label: 'Night' },
]

export function ControlBar() {
  const theme = useStore(s => s.theme)
  const time = useStore(s => s.time)
  const scene = useStore(s => s.scene)
  const explorer = useStore(s => s.explorer)
  const set = useStore(s => s.set)
  const day = time >= 6 && time <= 18.3

  return (
    <div className="control-bar" role="toolbar" aria-label="Style, time and lights">
      <div className="cb-group" aria-label="Style">
        {themes.map(t => (
          <button
            key={t.id}
            className={`swatch ${theme === t.id ? 'on' : ''}`}
            style={{ background: `linear-gradient(135deg, ${t.mood[0]} 0 45%, ${t.mood[1]} 45% 70%, ${t.mood[2]} 70%)` }}
            onClick={() => set({ theme: t.id })}
            title={t.name}
            aria-label={`${t.name} style`}
            aria-pressed={theme === t.id}
          />
        ))}
      </div>
      <label className="cb-group time">
        <span className="ico" aria-hidden>{day ? '☀' : '☾'}</span>
        <input
          type="range"
          min={5}
          max={23.5}
          step={0.25}
          value={time}
          onChange={e => set({ time: Number(e.target.value) })}
          aria-label="Time of day"
        />
        <span className="time-label">{fmtTime(time)}</span>
      </label>
      <div className="cb-group scenes">
        <select value={scene} onChange={e => set({ scene: e.target.value as LightScene })} aria-label="Light scene">
          {scenes.map(s => <option key={s.id} value={s.id}>{s.label} lights</option>)}
        </select>
      </div>
      {!explorer && (
        <button className="cta small" onClick={() => set({ explorer: true, view: 'orbit', selectedFeature: null, selectedRoom: null })}>
          Explore 3D
        </button>
      )}
    </div>
  )
}
