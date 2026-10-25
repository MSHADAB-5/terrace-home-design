export type ThemeId = 'japandi' | 'luxe' | 'boho' | 'industrial' | 'scandi'
export type FloorType = 'wood' | 'terrazzo' | 'tile' | 'concrete'
export type AccentType = 'fluted' | 'cane' | 'brick'

export interface Theme {
  id: ThemeId
  name: string
  tagline: string
  floorType: FloorType
  accentType: AccentType
  colors: {
    floor: string
    wall: string
    ceiling: string
    accent: string
    wood: string
    metal: string
    fabric: string
    fabric2: string
    counter: string
    bathTile: string
    rug: string
    led: string
  }
  metalness: number
  plants: number
  arches: boolean
  ui: string
  mood: string[]
}

export const themes: Theme[] = [
  {
    id: 'japandi', name: 'Japandi', tagline: 'Warm oak, linen and quiet lines',
    floorType: 'wood', accentType: 'fluted',
    colors: {
      floor: '#c9a57f', wall: '#efe9e1', ceiling: '#f4efe8', accent: '#b8946f', wood: '#a47b55',
      metal: '#2b2b2b', fabric: '#d9cfbf', fabric2: '#8f8a70', counter: '#e8e2d8', bathTile: '#cfc6b8',
      rug: '#cbbfa8', led: '#ffd49a',
    },
    metalness: 0.2, plants: 2, arches: false, ui: '#a47b55',
    mood: ['#efe9e1', '#c9a57f', '#8f8a70', '#2b2b2b', '#d9cfbf'],
  },
  {
    id: 'luxe', name: 'Modern Luxe', tagline: 'Dark walnut, brass and velvet',
    floorType: 'terrazzo', accentType: 'fluted',
    colors: {
      floor: '#e6e2dc', wall: '#e4ded5', ceiling: '#f0ece6', accent: '#3a2c23', wood: '#5b4031',
      metal: '#c9a45c', fabric: '#2f4a46', fabric2: '#c9a45c', counter: '#f3f1ed', bathTile: '#3b3a38',
      rug: '#bfb4a6', led: '#ffdcaa',
    },
    metalness: 0.85, plants: 1, arches: false, ui: '#c9a45c',
    mood: ['#e4ded5', '#3a2c23', '#2f4a46', '#c9a45c', '#f3f1ed'],
  },
  {
    id: 'boho', name: 'Boho', tagline: 'Terracotta, cane, arches and plants',
    floorType: 'tile', accentType: 'cane',
    colors: {
      floor: '#c27c58', wall: '#f1e2cd', ceiling: '#f5ebdc', accent: '#d9b98e', wood: '#9a6a41',
      metal: '#a8763e', fabric: '#d9a26a', fabric2: '#8b5e3c', counter: '#efe3d0', bathTile: '#e3c19e',
      rug: '#c88f63', led: '#ffbf80',
    },
    metalness: 0.5, plants: 6, arches: true, ui: '#c27c58',
    mood: ['#f1e2cd', '#c27c58', '#d9a26a', '#6f7d4f', '#9a6a41'],
  },
  {
    id: 'industrial', name: 'Industrial', tagline: 'Concrete, brick and black steel',
    floorType: 'concrete', accentType: 'brick',
    colors: {
      floor: '#8f8b86', wall: '#c4bfb8', ceiling: '#6e6b67', accent: '#9a5a43', wood: '#6a4a33',
      metal: '#1e1e1e', fabric: '#6b4a34', fabric2: '#3c3c3c', counter: '#4b4b4b', bathTile: '#707070',
      rug: '#5d5650', led: '#ffb46a',
    },
    metalness: 0.6, plants: 2, arches: false, ui: '#9a5a43',
    mood: ['#c4bfb8', '#9a5a43', '#1e1e1e', '#6b4a34', '#8f8b86'],
  },
  {
    id: 'scandi', name: 'Scandinavian', tagline: 'Pale ash, white and soft blue',
    floorType: 'wood', accentType: 'fluted',
    colors: {
      floor: '#e3d4bd', wall: '#f7f6f3', ceiling: '#ffffff', accent: '#d5dfe5', wood: '#dcc39f',
      metal: '#d9d9d9', fabric: '#b8c5cf', fabric2: '#e8e1d6', counter: '#ffffff', bathTile: '#eef1f3',
      rug: '#d9dde0', led: '#fff0d4',
    },
    metalness: 0.3, plants: 3, arches: false, ui: '#6f8ca0',
    mood: ['#f7f6f3', '#e3d4bd', '#b8c5cf', '#dcc39f', '#d9d9d9'],
  },
]

export const themeById = Object.fromEntries(themes.map(t => [t.id, t])) as Record<ThemeId, Theme>
