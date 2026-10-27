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
    at: [7, 2.2, 4.5], cam: [7, 4.6, 12.5], look: [7, 1.6, 2.5],
  },
  {
    id: 'headboard', title: 'Full-height fluted headboard', room: 'bedroom',
    text: 'The east wall behind the bed gets a floor-to-ceiling fluted panel with a cove light washing down it.',
    at: [7, 6.5, 0.4], cam: [7, 5.2, 10], look: [7, 5, 0],
  },
  {
    id: 'skylight', title: 'Stargazing skylight', room: 'bedroom',
    text: 'One insulated polycarbonate skylight over the bed, with a light-well through the false ceiling and a motorized blind.',
    at: [7, 9.6, 2.75], cam: [7, 3.2, 8.5], look: [7, 10.5, 2.75],
  },
  {
    id: 'bench', title: 'Window bench reading nook', room: 'bedroom',
    text: 'An 8 ft west window with a cushioned bench, looking out at the sit-out and the sunset.',
    at: [6.25, 2.4, 14.3], cam: [9, 5, 9], look: [6, 2.5, 15],
  },
  {
    id: 'hidden-door', title: 'Hidden bedroom door', room: 'bedroom',
    text: 'A flush door finished like the wall, just off the entry passage, so the hall looks clean and the bedroom stays private.',
    at: [12.4, 4, 6.55], cam: [18.5, 5.2, 7.5], look: [12.2, 3.5, 6.55],
  },
  {
    id: 'wardrobe', title: "7 ft sliding wardrobe + study desk", room: 'bedroom',
    text: 'Sliding shutters save swing space, with a loft above. The old bath corner becomes a floating study desk under a new north window.',
    at: [1.2, 5, 9], cam: [8, 5.4, 9], look: [0, 4.5, 7],
  },
  {
    id: 'dresser', title: 'Floating dresser with arched mirror', room: 'bedroom',
    text: 'A wall-hung dressing ledge on the partition with an arched, backlit mirror.',
    at: [11.4, 4.6, 10.75], cam: [6.5, 5, 10.75], look: [12, 4.4, 10.75],
  },
  {
    id: 'entry', title: 'Entry from the stair landing', room: 'hall',
    text: 'The 3\'3" door sits 5\'2" from the south-east corner, right where the stairs arrive. It opens flat against the bath wall into a short passage to the bath, kitchenette, bedroom and hall.',
    at: [25.2, 4, 6.8], cam: [17.5, 5.3, 7.5], look: [25, 3.5, 6.8],
  },
  {
    id: 'bath', title: 'Compact 7 × 4\'9" bath', room: 'bath',
    text: 'A common bath off the entry passage, in the corner your sketch marks. Wall-hung WC, floating basin, a hand shower over a floor drain and microcement walls. No glass partition to clean.',
    at: [21.5, 4, 2.4], cam: [19.3, 5.3, 4.3], look: [23.5, 3.2, 1.5],
  },
  {
    id: 'glassblock', title: 'Glass-block corner window', room: 'bath',
    text: 'Glass blocks wrap the south-east corner over the shower: daylight and privacy without curtains.',
    at: [24.7, 5.8, 0.3], cam: [19.5, 4.6, 4.3], look: [25, 5.6, 0.5],
  },
  {
    id: 'mirror', title: 'Arched backlit mirror', room: 'bath',
    text: 'An arched mirror with a halo LED over a floating basin, on the wet wall shared with the kitchen sink.',
    at: [18.1, 5.2, 2.35], cam: [23.5, 5.2, 2.6], look: [18, 5, 2.35],
  },
  {
    id: 'bath-door', title: 'Fluted glass sliding door', room: 'bath',
    text: 'The bath door slides inside the bath, so it never clashes with the open entry door, and lets light through without showing anything.',
    at: [19.55, 4, 4.9], cam: [21.5, 5, 11], look: [19.55, 3.5, 5],
  },
  {
    id: 'kitchen', title: 'L-shaped kitchenette', room: 'hall',
    text: 'Fridge in the corner and a 2-burner hob on the east wall, with the chimney venting straight out. The sink sits on the bath\'s wet wall to keep plumbing short.',
    at: [16, 4, 1.5], cam: [15, 5.3, 8.5], look: [15.5, 3.5, 1],
  },
  {
    id: 'media', title: 'Floating fluted TV wall', room: 'hall',
    text: 'The TV hangs on a fluted panel on the bedroom partition over a floating console with LED underglow. A shoe cabinet and round mirror sit by the entry.',
    at: [13.2, 4.2, 10.75], cam: [21, 5, 10.75], look: [12.4, 4, 10.75],
  },
  {
    id: 'sofa', title: 'Floating sofa-cum-bed', room: 'hall',
    text: 'A 3-seater facing the TV with its back to the entry path. It opens into a guest bed.',
    at: [19, 3.2, 11], cam: [14.5, 5, 11], look: [19.5, 2.5, 11],
  },
  {
    id: 'bar', title: 'Window bar for two', room: 'hall',
    text: 'A breakfast counter at the west window, facing the sit-out.',
    at: [15.25, 4.2, 14.5], cam: [15.5, 5.3, 9], look: [15.25, 3.5, 15],
  },
  {
    id: 'folding', title: 'Folding glass door to the sit-out', room: 'hall',
    text: 'A 4 ft slide-and-fold glass door opens the hall to the covered sit-out.',
    at: [21.5, 4.5, 15.4], cam: [22, 5.3, 8], look: [21.5, 4, 20],
  },
  {
    id: 'roof', title: 'Insulated sheet roof', room: 'sitout',
    text: 'Double-layer sheets with insulation in between, one slope down to the west, carried over the first 12 ft of the sit-out on slim steel posts. The rest of the terrace stays open to the sky.',
    at: [12.5, 11.4, 21], cam: [40, 14, 46], look: [12.5, 9, 16],
  },
  {
    id: 'sitout', title: 'Sit-out + open terrace', room: 'sitout',
    text: 'The roof shades the west glass, so evening sun stays soft. The hall opens onto 12 ft of covered sit-out, then 11\'3" of open terrace out to the far parapet, 39 ft from the east wall.',
    at: [12.5, 3, 24], cam: [12.5, 6, 44], look: [12.5, 4, 14],
  },
  {
    id: 'cove', title: 'Cove lights and smart scenes', room: 'hall',
    text: 'A flat false ceiling at 10 ft with cove LEDs everywhere. Scenes: Morning, Work, Movie, Romance and Night.',
    at: [18.5, 9.4, 9], cam: [14, 4.5, 13.5], look: [20, 8.5, 6],
  },
]
