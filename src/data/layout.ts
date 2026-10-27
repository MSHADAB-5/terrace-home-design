// All dimensions in feet. Plan x runs along the east wall (0 = north, 25 = south).
// Plan y runs from the east wall (0) to the west/sit-out side (15). 3D: X = x, Z = y, Y = up.

export const W = 25
export const D = 15
export const EXT = 0.75 // 9" outer brick wall
export const PART = 0.375 // 4.5" partition
export const CEILING = 10
export const BATH_CEILING = 8
export const SITOUT_DEPTH = 12
/** Inner face of the far (west) parapet: the terrace is 39 ft from the east wall. */
export const TERRACE_END = 39
export const PARAPET_H = 3.5

/** Stair from the floor below, outside the south wall: landing at the entry, flight descending west. */
export const STAIR = {
  x0: W + EXT,
  x1: 28.95,
  landingY0: 4.95,
  landingY1: 8.7,
  landingTop: -0.5,
  treads: 9,
  tread: 0.83,
  rise: 0.55,
}
export const stairEndY = STAIR.landingY1 + STAIR.treads * STAIR.tread

export const ROOF = {
  eastY: -EXT,
  eastHeight: 12.5,
  edgeY: D + EXT + SITOUT_DEPTH,
  edgeHeight: 9.75,
  thickness: 0.25,
  overhang: 1,
  skylight: { x0: 5.5, x1: 8.5, y0: 1.25, y1: 4.25 },
  posts: [0.2, 12.5, 24.8],
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
      { id: 'chimney-vent', from: 15.8, to: 16.5, sill: 7.2, head: 7.8, kind: 'vent' },
      { id: 'bath-exhaust', from: 20.1, to: 20.9, sill: 6.9, head: 7.6, kind: 'vent' },
      { id: 'bath-glassblock-e', from: 22.5, to: 24.5, sill: 4.5, head: 7, kind: 'glassblock' },
    ],
  },
  {
    id: 'north', axis: 'y', at: -EXT, t: EXT, from: -EXT, to: D + EXT,
    top: sideTop, exterior: true,
    openings: [{ id: 'study-window', from: 1.5, to: 5, sill: 3, head: 7, kind: 'window' }],
  },
  {
    id: 'south', axis: 'y', at: W, t: EXT, from: -EXT, to: D + EXT,
    top: sideTop, exterior: true,
    openings: [
      { id: 'bath-glassblock-s', from: 0.5, to: 2.5, sill: 4.5, head: 7, kind: 'glassblock' },
      { id: 'entry', from: 5.2, to: 8.45, sill: 0, head: 7, kind: 'door' },
    ],
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
    openings: [{ id: 'bedroom-door', from: 5.2, to: 7.9, sill: 0, head: 7, kind: 'hidden' }],
  },
  {
    id: 'bath-side', axis: 'y', at: 17.625, t: PART, from: 0, to: 4.75 + PART,
    top: [BATH_CEILING, BATH_CEILING], exterior: false, openings: [],
  },
  {
    id: 'bath-front', axis: 'x', at: 4.75, t: PART, from: 18, to: W,
    top: [BATH_CEILING, BATH_CEILING], exterior: false,
    openings: [{ id: 'bath-door', from: 18.3, to: 20.8, sill: 0, head: 7, kind: 'sliding' }],
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
    poly: [[0, 0], [12, 0], [12, D], [0, D]],
    size: "12' × 15'", area: 180, labelAt: [7, 10.2],
  },
  { id: 'bath', name: 'Bathroom', poly: [[18, 0], [W, 0], [W, 4.75], [18, 4.75]], size: "7' × 4'9\"", area: 33, labelAt: [21.5, 2.6] },
  {
    id: 'hall', name: 'Hall + kitchenette',
    poly: [[12 + PART, 0], [17.625, 0], [17.625, 4.75 + PART], [W, 4.75 + PART], [W, D], [12 + PART, D]],
    size: "12'7\" × 15' (L)", area: 152, labelAt: [18.8, 7],
  },
  {
    id: 'sitout', name: 'Sit-out + open terrace',
    poly: [[0, D + EXT], [W, D + EXT], [W, TERRACE_END], [0, TERRACE_END]],
    size: "25' × 23'3\" (12' covered)", area: 581, labelAt: [12.5, 24],
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
  { id: 'bed', label: 'Queen bed', x0: 4.5, y0: 0.25, x1: 9.5, y1: 6.75, solid: true },
  { id: 'nightstand-l', label: '', x0: 3.75, y0: 0.25, x1: 4.45, y1: 1.4 },
  { id: 'nightstand-r', label: '', x0: 9.55, y0: 0.25, x1: 10.25, y1: 1.4 },
  { id: 'desk', label: 'Study', x0: 0, y0: 1.6, x1: 1.75, y1: 5.1, solid: true },
  { id: 'wardrobe', label: "7' wardrobe", x0: 0, y0: 7.5, x1: 2, y1: 14.5, solid: true },
  { id: 'dresser', label: 'Dresser', x0: 10.75, y0: 9, x1: 12, y1: 12.5, solid: true },
  { id: 'bench', label: 'Window bench', x0: 4, y0: 13.75, x1: 8.5, y1: 15, solid: true },
  // Bath
  { id: 'wc', label: 'WC', x0: 19.85, y0: 0, x1: 21.1, y1: 1.75, solid: true },
  { id: 'basin', label: 'Basin', x0: 18, y0: 1.6, x1: 19.35, y1: 3.1, solid: true },
  { id: 'shower', label: 'Shower', x0: 22.25, y0: 0, x1: 25, y1: 4.75 },
  // Hall
  { id: 'fridge', label: 'Fridge', x0: 12.4, y0: 0, x1: 14.4, y1: 2.2, solid: true },
  { id: 'kitchen', label: 'Hob', x0: 14.45, y0: 0, x1: 17.625, y1: 2.1, solid: true },
  { id: 'sink', label: 'Sink', x0: 15.625, y0: 2.1, x1: 17.625, y1: 4.6, solid: true },
  { id: 'shoe', label: 'Shoe', x0: 23.75, y0: 8.75, x1: 25, y1: 10.75, solid: true },
  { id: 'tv', label: 'TV wall', x0: 12.375, y0: 8.5, x1: 13.75, y1: 13, solid: true },
  { id: 'plant', label: '', x0: 23.75, y0: 11.75, x1: 25, y1: 13.25, solid: true, shape: 'round' },
  { id: 'sofa', label: 'Sofa-cum-bed', x0: 17.6, y0: 8.5, x1: 20.4, y1: 13.5, solid: true },
  { id: 'coffee', label: '', x0: 14.7, y0: 9.6, x1: 16.7, y1: 11.6, solid: true, shape: 'round' },
  { id: 'bar', label: 'Window bar', x0: 13, y0: 14, x1: 17.5, y1: 15, solid: true },
]

export interface Shot {
  pos: [number, number, number]
  target: [number, number, number]
  label?: string
}

export const roomShots: Record<RoomId, Shot> = {
  bedroom: { pos: [6, 20, 24], target: [6.5, 1, 7] },
  bath: { pos: [21.5, 17, 13], target: [21.5, 1, 2.4] },
  hall: { pos: [19, 21, 25], target: [18.5, 1, 8.5] },
  sitout: { pos: [12.5, 16, 52], target: [12.5, 3, 26] },
}

export const overviewShot: Shot = { pos: [40, 52, 40], target: [12.5, 2, 18] }
export const planShot: Shot = { pos: [12.5, 70, 19.51], target: [12.5, 0, 19.5] }

export const tourStops: Shot[] = [
  { label: 'Entry from the stair landing', pos: [23.6, 5.4, 6.85], target: [14, 3.6, 10] },
  { label: 'L-shaped kitchenette', pos: [15, 5.4, 8], target: [15.5, 3.4, 0] },
  { label: 'Living + media wall', pos: [21.5, 5, 11], target: [12.4, 4, 10.75] },
  { label: 'Folding door to the sit-out', pos: [21.5, 5.2, 8], target: [21.5, 4, 26] },
  { label: 'Bedroom, bed facing west', pos: [7, 5.4, 13.6], target: [7, 3, 1] },
  { label: 'Study corner + wardrobe', pos: [7.5, 5.4, 7.6], target: [0, 4.2, 6] },
  { label: 'Bathroom', pos: [19.6, 5.2, 4.2], target: [24, 3.6, 1] },
  { label: 'Covered sit-out', pos: [12.5, 5.5, 26.5], target: [12.5, 5, 8] },
  { label: 'Open terrace', pos: [20, 5.5, 37], target: [8, 4, 22] },
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
  // Terrace parapets, stair landing rails, stair flight and roof posts
  rects.push([-EXT, D + EXT, 0, TERRACE_END + EXT])
  rects.push([W, D + EXT, W + EXT, TERRACE_END + EXT])
  rects.push([-EXT, TERRACE_END, W + EXT, TERRACE_END + EXT])
  rects.push([STAIR.x1, STAIR.landingY0, STAIR.x1 + 0.3, STAIR.landingY1])
  rects.push([STAIR.x0, STAIR.landingY0 - 0.3, STAIR.x1 + 0.3, STAIR.landingY0])
  rects.push([STAIR.x0, STAIR.landingY1, STAIR.x1 + 0.3, stairEndY])
  for (const x of ROOF.posts) rects.push([x - 0.17, ROOF.edgeY - 0.52, x + 0.17, ROOF.edgeY - 0.18])
  if (includeFurniture) for (const f of furniture) if (f.solid) rects.push([f.x0, f.y0, f.x1, f.y1])
  return rects
}
