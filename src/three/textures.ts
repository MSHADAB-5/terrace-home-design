import * as THREE from 'three'

// Procedural textures. Maps are near-white so the material colour sets the hue.
// UVs are in feet (see geometry.ts), so `repeat` = 1 / tile size in feet.

const cache = new Map<string, THREE.Texture>()

function make(key: string, size: number, draw: (g: CanvasRenderingContext2D, s: number) => void, tileFt: number, color = true) {
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  draw(g, size)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1 / tileFt, 1 / tileFt)
  tex.anisotropy = 8
  if (color) tex.colorSpace = THREE.SRGBColorSpace
  cache.set(key, tex)
  return tex
}

let seed = 7
const rnd = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const shade = (v: number) => `rgb(${v},${v},${v})`

export function woodTex() {
  return make('wood', 1024, (g, s) => {
    const planks = 6
    const pw = s / planks
    for (let i = 0; i < planks; i++) {
      const base = 210 + rnd() * 40
      g.fillStyle = shade(Math.round(base))
      g.fillRect(i * pw, 0, pw, s)
      for (let k = 0; k < 70; k++) {
        const x = i * pw + rnd() * pw
        g.strokeStyle = `rgba(80,60,40,${0.04 + rnd() * 0.08})`
        g.lineWidth = 1 + rnd() * 2
        g.beginPath()
        g.moveTo(x, 0)
        g.bezierCurveTo(x + rnd() * 8 - 4, s * 0.3, x + rnd() * 8 - 4, s * 0.7, x, s)
        g.stroke()
      }
      const off = rnd() * s
      g.fillStyle = 'rgba(40,30,20,0.35)'
      g.fillRect(i * pw, off, pw, 2)
      g.fillRect(i * pw, 0, 2, s)
    }
  }, 6)
}

export function terrazzoTex() {
  return make('terrazzo', 1024, (g, s) => {
    g.fillStyle = shade(242)
    g.fillRect(0, 0, s, s)
    const chips = ['#b9a99a', '#8d8f93', '#d9c6b0', '#a46f55', '#ffffff', '#6f6a64']
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = chips[Math.floor(rnd() * chips.length)]
      const r = 1 + rnd() * 6
      g.beginPath()
      const x = rnd() * s, y = rnd() * s
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2
        const rr = r * (0.6 + rnd() * 0.6)
        g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
      }
      g.fill()
    }
    g.strokeStyle = 'rgba(0,0,0,0.12)'
    g.strokeRect(0, 0, s, s)
  }, 4)
}

export function tileTex() {
  return make('tile', 512, (g, s) => {
    const n = 4
    const t = s / n
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        g.fillStyle = shade(Math.round(215 + rnd() * 35))
        g.fillRect(i * t, j * t, t, t)
      }
    g.strokeStyle = 'rgba(255,255,255,0.9)'
    g.lineWidth = 6
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(i * t, 0); g.lineTo(i * t, s); g.stroke()
      g.beginPath(); g.moveTo(0, i * t); g.lineTo(s, i * t); g.stroke()
    }
  }, 4)
}

export function concreteTex() {
  return make('concrete', 512, (g, s) => {
    g.fillStyle = shade(225)
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 9000; i++) {
      const v = Math.round(180 + rnd() * 75)
      g.fillStyle = `rgba(${v},${v},${v},0.35)`
      g.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 3, 1 + rnd() * 3)
    }
    for (let i = 0; i < 18; i++) {
      g.fillStyle = `rgba(120,120,120,${rnd() * 0.08})`
      g.beginPath(); g.arc(rnd() * s, rnd() * s, 20 + rnd() * 80, 0, Math.PI * 2); g.fill()
    }
  }, 8)
}

export function brickTex() {
  return make('brick', 512, (g, s) => {
    g.fillStyle = shade(235)
    g.fillRect(0, 0, s, s)
    const rows = 8, bw = s / 4, bh = s / rows
    for (let r = 0; r < rows; r++)
      for (let c = -1; c < 5; c++) {
        const x = c * bw + (r % 2 ? bw / 2 : 0)
        g.fillStyle = shade(Math.round(175 + rnd() * 60))
        g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6)
      }
  }, 2.6)
}

export function caneTex() {
  return make('cane', 512, (g, s) => {
    g.fillStyle = shade(160)
    g.fillRect(0, 0, s, s)
    const cell = s / 8
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++) {
        g.fillStyle = shade(250)
        g.beginPath(); g.arc(i * cell + cell / 2, j * cell + cell / 2, cell * 0.32, 0, Math.PI * 2); g.fill()
      }
    g.strokeStyle = shade(225)
    g.lineWidth = 5
    for (let i = 0; i <= 16; i++) {
      g.beginPath(); g.moveTo(i * cell / 2, 0); g.lineTo(i * cell / 2 - s, s); g.stroke()
      g.beginPath(); g.moveTo(i * cell / 2, 0); g.lineTo(i * cell / 2 + s, s); g.stroke()
    }
  }, 1.2)
}

/** Vertical flutes as a normal map. */
export function flutedNormal() {
  return make('fluted-n', 256, (g, s) => {
    const flutes = 8
    const img = g.createImageData(s, s)
    for (let x = 0; x < s; x++) {
      const p = ((x / s) * flutes) % 1
      const nx = Math.cos(p * Math.PI) // -1..1 across each flute
      const r = Math.round((nx * 0.5 + 0.5) * 255)
      for (let y = 0; y < s; y++) {
        const i = (y * s + x) * 4
        img.data[i] = r
        img.data[i + 1] = 128
        img.data[i + 2] = Math.round(Math.sqrt(1 - nx * nx) * 127 + 128)
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, 1.2, false)
}

export function flutedColor() {
  return make('fluted-c', 256, (g, s) => {
    const flutes = 8
    for (let x = 0; x < s; x++) {
      const p = ((x / s) * flutes) % 1
      g.fillStyle = shade(Math.round(200 + Math.sin(p * Math.PI) * 55))
      g.fillRect(x, 0, 1, s)
    }
  }, 1.2)
}

export function microcementTex() {
  return make('micro', 512, (g, s) => {
    g.fillStyle = shade(235)
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 60; i++) {
      const v = Math.round(200 + rnd() * 55)
      g.fillStyle = `rgba(${v},${v},${v},0.18)`
      g.beginPath()
      g.ellipse(rnd() * s, rnd() * s, 30 + rnd() * 90, 10 + rnd() * 40, rnd() * Math.PI, 0, Math.PI * 2)
      g.fill()
    }
  }, 5)
}

export function glassBlockTex() {
  return make('gblock', 256, (g, s) => {
    const n = 2, t = s / n
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const grd = g.createRadialGradient(i * t + t / 2, j * t + t / 2, 4, i * t + t / 2, j * t + t / 2, t * 0.7)
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#b9d3dc')
        g.fillStyle = grd
        g.fillRect(i * t, j * t, t, t)
      }
    g.strokeStyle = '#e7e7e7'
    g.lineWidth = 8
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(i * t, 0); g.lineTo(i * t, s); g.stroke()
      g.beginPath(); g.moveTo(0, i * t); g.lineTo(s, i * t); g.stroke()
    }
  }, 1.3)
}

export function roofRibTex() {
  return make('rib', 256, (g, s) => {
    for (let x = 0; x < s; x++) {
      const p = (x / s) % 1
      const v = p < 0.18 ? 200 : 240
      g.fillStyle = shade(v)
      g.fillRect(x, 0, 1, s)
    }
  }, 1)
}
