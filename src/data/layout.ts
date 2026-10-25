// All dimensions in feet. Plan x runs along the east wall (0 = north, 25 = south).
// Plan y runs from the east wall (0) to the west/sit-out side (15). 3D: X = x, Z = y, Y = up.

export const W = 25
export const D = 15
export const EXT = 0.75 // 9" outer brick wall
export const PART = 0.375 // 4.5" partition
export const CEILING = 10
export const BATH_CEILING = 8
export const SITOUT_DEPTH = 12

export const ROOF = {
  eastY: -EXT,
  eastHeight: 12.5,
  edgeY: D + EXT + SITOUT_DEPTH,
  edgeHeight: 9.75,
  thickness: 0.25,
  overhang: 1,
  skylight: { x0: 7.2, x1: 10.2, y0: 1.25, y1: 4.25 },
  posts: [0, 12.5, 25],
}

export const roofSlope = (ROOF.eastHeight - ROOF.edgeHeight) / (ROOF.edgeY - ROOF.eastY)
export const roofY = (y: number) => ROOF.eastHeight - (y - ROOF.eastY) * roofSlope

export type OpeningKind = 'door' | 'hidden' | 'sliding' | 'folding' | 'window' | 'glassblock' | 'vent'

export interface Opening {
  id: string
  from: number
  to: number
  sill: number
  head: number
  kind: OpeningKind
}

export interface Wall {
  id: string
  /** Direction the wall runs along. */
  axis: 'x' | 'y'
  /** Min face position on the perpendicular axis. */
  at: number
  t: number
  from: number
  to: number
  /** Top height at `from` and at `to` (linear in between). */
  top: [number, number]
  exterior: boolean
  openings: Opening[]
}

const sideTop: [number, number] = [roofY(-EXT), roofY(D + EXT)]

export const walls: Wall[] = [
  {
    id: 'east', axis: 'x', at: -EXT, t: EXT, from: -EXT, to: W + EXT,
    top: [roofY(0), roofY(0)], exterior: true,
    openings: [
      { id: 'bath-glassblock-e', from: 0.5, to: 3, sill: 4.5, head: 7, kind: 'glassblock' },
      { id: 'chimney-vent', from: 18.9, to: 19.6, sill: 7.2, head: 7.8, kind: 'vent' },
    ],
  },
  {
    id: 'north', axis: 'y', at: -EXT, t: EXT, from: -EXT, to: D + EXT,
    top: sideTop, exterior: true,
    openings: [
      { id: 'bath-glassblock-n', from: 0.5, to: 2.5, sill: 4.5, head: 7, kind: 'glassblock' },
      { id: 'bath-exhaust', from: 4.6, to: 5.4, sill: 6.9, head: 7.6, kind: 'vent' },
    ],
  },
  {
    id: 'south', axis: 'y', at: W, t: EXT, from: -EXT, to: D + EXT,
    top: sideTop, exterior: true,
    openings: [{ id: 'entry', from: 0.5, to: 3.75, sill: 0, head: 7, kind: 'door' }],
  },
  {
    id: 'west', axis: 'x', at: D, t: EXT, from: -EXT, to: W + EXT,
    top: [roofY(D + EXT), roofY(D + EXT)], exterior: true,
    openings: [
      { id: 'bed-window', from: 3, to: 11, sill: 1.5, head: 7.5, kind: 'window' },
      { id: 'hall-window', from: 13, to: 17.5, sill: 3.5, head: 7.5, kind: 'window' },
      { id: 'sitout-door', from: 19.5, to: 23.5, sill: 0, head: 7.5, kind: 'folding' },
    ],
  },
  {
    id: 'p1', axis: 'y', at: 12, t: PART, from: 0, to: D,
    top: [CEILING, CEILING], exterior: false,
    openings: [{ id: 'bedroom-door', from: 11.9, to: 14.6, sill: 0, head: 7, kind: 'hidden' }],
  },
  {
    id: 'bath-side', axis: 'y', at: 5, t: PART, from: 0, to: 7 + PART,
    top: [BATH_CEILING, BATH_CEILING], exterior: false, openings: [],
  },
  {
    id: 'bath-front', axis: 'x', at: 7, t: PART, from: 0, to: 5,
    top: [BATH_CEILING, BATH_CEILING], exterior: false,
    openings: [{ id: 'bath-door', from: 2.25, to: 4.75, sill: 0, head: 7, kind: 'sliding' }],
  },
]

export type RoomId = 'bedroom' | 'bath' | 'hall' | 'sitout'

export interface Room {
  id: RoomId
  name: string
  /** Polygon in plan coords. */
  poly: [number, number][]
  size: string
  area: number
  labelAt: [number, number]
}

export const rooms: Room[] = [
  {
    id: 'bedroom', name: 'Bedroom suite',
    poly: [[5 + PART, 0], [12, 0], [12, D], [0, D], [0, 7 + PART], [5 + PART, 7 + PART]],
    size: "12' × 15'", area: 140, labelAt: [7.5, 10.5],
  },
  { id: 'bath', name: 'Bathroom', poly: [[0, 0], [5, 0], [5, 7], [0, 7]], size: "5' × 7'", area: 35, labelAt: [2.5, 3.2] },
  {
    id: 'hall', name: 'Hall + kitchenette',
    poly: [[12 + PART, 0], [W, 0], [W, D], [12 + PART, D]],
    size: "12'7\" × 15'", area: 189, labelAt: [19, 6.5],
  },
  {
    id: 'sitout', name: 'Covered sit-out',
    poly: [[0, D + EXT], [W, D + EXT], [W, ROOF.edgeY], [0, ROOF.edgeY]],
    size: "25' × 12'", area: 300, labelAt: [12.5, 22],
  },
]

export interface Piece {
  id: string
  label: string
  x0: number
  y0: number
  x1: number
  y1: number
  /** Blocks walking in first-person mode. */
  solid?: boolean
  shape?: 'rect' | 'round'
}

export const furniture: Piece[] = [
  // Bedroom
  { id: 'bed', label: 'Queen bed', x0: 6.2, y0: 0.25, x1: 11.2, y1: 6.75, solid: true },
  { id: 'nightstand-l', label: '', x0: 5.45, y0: 0.25, x1: 6.15, y1: 1.4 },
  { id: 'nightstand-r', label: '', x0: 11.25, y0: 0.25, x1: 11.95, y1: 1.4 },
  { id: 'wardrobe', label: "7' wardrobe", x0: 0, y0: 7.5, x1: 2, y1: 14.5, solid: true },
  { id: 'dresser', label: 'Dresser', x0: 10.75, y0: 8, x1: 12, y1: 11.5, solid: true },
  { id: 'bench', label: 'Window bench', x0: 4, y0: 13.75, x1: 8.5, y1: 15, solid: true },
  // Bath
  { id: 'wc', label: 'WC', x0: 0, y0: 3.6, x1: 1.75, y1: 5.1, solid: true },
  { id: 'basin', label: 'Basin', x0: 3.6, y0: 3.2, x1: 5, y1: 4.7, solid: true },
  { id: 'shower', label: 'Hand shower', x0: 0, y0: 0, x1: 5, y1: 2.75 },
  // Hall
  { id: 'kitchen', label: "Kitchenette 8'7\"", x0: 12.375, y0: 0, x1: 21, y1: 2, solid: true },
  { id: 'shoe', label: 'Shoe', x0: 23.75, y0: 4, x1: 25, y1: 6, solid: true },
  { id: 'tv', label: 'TV wall', x0: 23.75, y0: 6.25, x1: 25, y1: 11.25, solid: true },
  { id: 'plant', label: '', x0: 23.75, y0: 11.75, x1: 25, y1: 13.25, solid: true, shape: 'round' },
  { id: 'sofa', label: 'Sofa-cum-bed', x0: 12.375, y0: 5.5, x1: 15.25, y1: 11.5, solid: true },
  { id: 'coffee', label: '', x0: 16.6, y0: 7.6, x1: 18.6, y1: 9.6, solid: true, shape: 'round' },
  { id: 'bar', label: 'Window bar', x0: 13, y0: 14, x1: 17.5, y1: 15, solid: true },
]

export interface Shot {
  pos: [number, number, number]
  target: [number, number, number]
  label?: string
}

export const roomShots: Record<RoomId, Shot> = {
  bedroom: { pos: [6, 20, 24], target: [6.5, 1, 7] },
  bath: { pos: [2.5, 17, 14], target: [2.5, 1, 3.5] },
  hall: { pos: [19, 21, 25], target: [18.5, 1, 7.5] },
  sitout: { pos: [12.5, 14, 42], target: [12.5, 3, 18] },
}

export const overviewShot: Shot = { pos: [34, 44, 27], target: [12.5, 2, 10] }
export const planShot: Shot = { pos: [12.5, 52, 13.01], target: [12.5, 0, 13] }

export const tourStops: Shot[] = [
  { label: 'Entry from the stairs', pos: [23.6, 5.4, 2.4], target: [14, 3.6, 12] },
  { label: 'Kitchenette', pos: [17, 5.4, 6.5], target: [17, 3.4, 0] },
  { label: 'Living + media wall', pos: [13.6, 5, 13.2], target: [24.5, 4, 8] },
  { label: 'Folding door to the sit-out', pos: [20, 5.2, 8.5], target: [21.5, 4, 26] },
  { label: 'Bedroom, bed facing west', pos: [9.5, 5.4, 13.6], target: [8.5, 3, 1] },
  { label: 'Wardrobe + dresser', pos: [7.5, 5.4, 7.6], target: [0, 4.2, 12] },
  { label: 'Bathroom', pos: [3.3, 5.2, 6.4], target: [1.6, 3.6, 0] },
  { label: 'Covered sit-out', pos: [12.5, 5.5, 26.5], target: [12.5, 5, 8] },
]

/** 2D rectangles that block first-person walking. */
export function blockers(includeFurniture: boolean) {
  const rects: [number, number, number, number][] = []
  for (const w of walls) {
    const doors = w.openings.filter(o => o.sill === 0).sort((a, b) => a.from - b.from)
    let cur = w.from
    const push = (a: number, b: number) => {
      if (b - a <= 0) return
      if (w.axis === 'x') rects.push([a, w.at, b, w.at + w.t])
      else rects.push([w.at, a, w.at + w.t, b])
    }
    for (const d of doors) {
      push(cur, d.from)
      cur = d.to
    }
    push(cur, w.to)
  }
  // Sit-out parapet and posts
  rects.push([-EXT - 0.5, ROOF.edgeY, W + EXT + 0.5, ROOF.edgeY + 0.5])
  rects.push([-EXT - 0.5, D + EXT, -EXT, ROOF.edgeY])
  rects.push([W + EXT, D + EXT, W + EXT + 0.5, ROOF.edgeY])
  if (includeFurniture) for (const f of furniture) if (f.solid) rects.push([f.x0, f.y0, f.x1, f.y1])
  return rects
}
