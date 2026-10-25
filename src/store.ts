import { create } from 'zustand'
import type { ThemeId } from './data/themes'
import type { RoomId, Shot } from './data/layout'

export type ViewMode = 'orbit' | 'plan' | 'tour' | 'walk'
export type LightScene = 'auto' | 'morning' | 'work' | 'movie' | 'romance' | 'night'
export type DoorId = 'entry' | 'bedroom' | 'bath' | 'sitout'

interface State {
  theme: ThemeId
  explorer: boolean
  view: ViewMode
  time: number
  scene: LightScene
  showRoof: boolean
  showFurniture: boolean
  showDims: boolean
  showHotspots: boolean
  exploded: boolean
  doors: Record<DoorId, boolean>
  selectedRoom: RoomId | null
  selectedFeature: string | null
  tourIndex: number
  /** Camera shot driven by page scroll (when not in explorer). */
  scrollShot: Shot | null
  scrollRoof: boolean
  reducedMotion: boolean
  set: (p: Partial<State>) => void
  toggleDoor: (d: DoorId) => void
}

export const useStore = create<State>(set => ({
  theme: 'japandi',
  explorer: false,
  view: 'orbit',
  time: 16.5,
  scene: 'auto',
  showRoof: false,
  showFurniture: true,
  showDims: false,
  showHotspots: true,
  exploded: false,
  doors: { entry: false, bedroom: true, bath: false, sitout: true },
  selectedRoom: null,
  selectedFeature: null,
  tourIndex: 0,
  scrollShot: null,
  scrollRoof: false,
  reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  set: p => set(p),
  toggleDoor: d => set(s => ({ doors: { ...s.doors, [d]: !s.doors[d] } })),
}))

export function useRoofVisible() {
  return useStore(s => (s.explorer ? (s.view === 'plan' ? false : s.view === 'orbit' ? s.showRoof : true) : s.scrollRoof))
}

/** 0 at night, 1 in full daylight. */
export function daylight(time: number) {
  const s = Math.sin(((time - 6) / 12) * Math.PI)
  return Math.min(1, Math.max(0, s * 1.6 + 0.08))
}
