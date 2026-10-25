import type { RoomId } from './layout'

export interface Feature {
  id: string
  title: string
  room: RoomId
  text: string
  /** Hotspot position in 3D (X, Y, Z). */
  at: [number, number, number]
  cam: [number, number, number]
  look: [number, number, number]
}

export const features: Feature[] = [
  {
    id: 'bed', title: 'Floating bed with LED underglow', room: 'bedroom',
    text: 'A queen bed on a recessed plinth so it looks like it floats. A warm LED strip underneath doubles as a night light.',
    at: [8.7, 2.2, 4.5], cam: [9.5, 4.6, 12.5], look: [8.7, 1.6, 2.5],
  },
  {
    id: 'headboard', title: 'Full-height fluted headboard', room: 'bedroom',
    text: 'The east wall behind the bed gets a floor-to-ceiling fluted panel with a cove light washing down it.',
    at: [8.7, 6.5, 0.4], cam: [8.7, 5.2, 10], look: [8.7, 5, 0],
  },
  {
    id: 'skylight', title: 'Stargazing skylight', room: 'bedroom',
    text: 'One insulated polycarbonate skylight over the bed, with a light-well through the false ceiling and a motorized blind.',
    at: [8.7, 9.6, 2.75], cam: [8.7, 3.2, 8.5], look: [8.7, 10.5, 2.75],
  },
  {
    id: 'bench', title: 'Window bench reading nook', room: 'bedroom',
    text: 'An 8 ft west window with a cushioned bench, looking out at the sit-out and the sunset.',
    at: [6.25, 2.4, 14.3], cam: [9, 5, 9], look: [6, 2.5, 15],
  },
  {
    id: 'hidden-door', title: 'Hidden bedroom door', room: 'bedroom',
    text: 'A flush door finished like the wall, so the hall looks clean and the bedroom stays private.',
    at: [12.4, 4, 13.25], cam: [18.5, 5.2, 12.2], look: [12.2, 3.5, 13.25],
  },
  {
    id: 'wardrobe', title: "7 ft sliding wardrobe + loft", room: 'bedroom',
    text: 'Sliding shutters save swing space. A loft above the wardrobe and another over the bathroom add storage.',
    at: [1.2, 5, 11], cam: [8, 5.4, 11], look: [0, 4.5, 11],
  },
  {
    id: 'dresser', title: 'Floating dresser with arched mirror', room: 'bedroom',
    text: 'A wall-hung dressing ledge on the partition with an arched, backlit mirror.',
    at: [11.4, 4.6, 9.75], cam: [6.5, 5, 9.75], look: [12, 4.4, 9.75],
  },
  {
    id: 'bath', title: 'Minimal 5×7 bath', room: 'bath',
    text: 'Wall-hung WC and basin, a hand shower over a floor drain and microcement walls. No glass partition to clean.',
    at: [2.5, 4, 1.4], cam: [2.8, 5.3, 6.6], look: [2, 3.2, 0],
  },
  {
    id: 'glassblock', title: 'Glass-block corner window', room: 'bath',
    text: 'Glass blocks wrap the north-east corner: daylight and privacy without curtains.',
    at: [0.3, 5.8, 0.3], cam: [3.6, 4.6, 5.5], look: [0, 5.6, 0.5],
  },
  {
    id: 'mirror', title: 'Arched backlit mirror', room: 'bath',
    text: 'An arched mirror with a halo LED over a floating basin.',
    at: [4.9, 5.2, 3.95], cam: [1.2, 5.2, 4], look: [5, 5, 3.95],
  },
  {
    id: 'bath-door', title: 'Fluted glass sliding door', room: 'bath',
    text: 'The bath door slides along the bedroom wall and lets light through without showing anything.',
    at: [3.5, 4, 7.5], cam: [6.5, 5, 11], look: [3.5, 3.5, 7.3],
  },
  {
    id: 'kitchen', title: "8'7\" kitchenette", room: 'hall',
    text: 'Fridge, sink, prep counter and a 2-burner hob in one straight run. The chimney vents straight out through the east wall.',
    at: [17, 4, 1], cam: [17.5, 5.3, 8], look: [17, 3.5, 0],
  },
  {
    id: 'media', title: 'Floating fluted TV + shoe wall', room: 'hall',
    text: 'One floating unit on the south wall: shoe cabinet by the entry, then the TV console, all with LED underglow.',
    at: [24.4, 4.2, 8.75], cam: [15.5, 5, 8.75], look: [25, 4, 8.75],
  },
  {
    id: 'sofa', title: 'Sofa-cum-bed for guests', room: 'hall',
    text: 'A 3-seater on the partition wall that opens into a guest bed.',
    at: [13.8, 3.2, 8.5], cam: [21.5, 5, 8.5], look: [13.5, 2.5, 8.5],
  },
  {
    id: 'bar', title: 'Window bar for two', room: 'hall',
    text: 'A breakfast counter at the west window, facing the sit-out.',
    at: [15.25, 4.2, 14.5], cam: [15.5, 5.3, 9], look: [15.25, 3.5, 15],
  },
  {
    id: 'folding', title: 'Folding glass door to the sit-out', room: 'hall',
    text: 'A 4 ft slide-and-fold glass door opens the hall to the covered sit-out.',
    at: [21.5, 4.5, 15.4], cam: [20.5, 5.3, 8.5], look: [21.5, 4, 20],
  },
  {
    id: 'roof', title: 'Insulated sheet roof', room: 'sitout',
    text: 'Double-layer sheets with insulation in between, one slope down to the west, carried over the 12 ft sit-out on slim steel posts.',
    at: [12.5, 11.4, 21], cam: [36, 12, 40], look: [12.5, 9, 14],
  },
  {
    id: 'sitout', title: 'Covered sit-out', room: 'sitout',
    text: 'The roof shades the west glass, so evening sun stays soft and the hall opens onto a 25 × 12 ft covered terrace.',
    at: [12.5, 3, 22], cam: [12.5, 5.5, 33], look: [12.5, 4, 10],
  },
  {
    id: 'cove', title: 'Cove lights and smart scenes', room: 'hall',
    text: 'A flat false ceiling at 10 ft with cove LEDs everywhere. Scenes: Morning, Work, Movie, Romance and Night.',
    at: [18.5, 9.4, 7.5], cam: [14, 4.5, 13.5], look: [20, 8.5, 3],
  },
]
