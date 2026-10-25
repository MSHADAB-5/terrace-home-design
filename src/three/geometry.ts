import * as THREE from 'three'
import type { Opening, Wall } from '../data/layout'

const boxCache = new Map<string, THREE.BoxGeometry>()

/** Box with UVs in feet, so tiled textures keep a constant scale. */
export function boxGeo(w: number, h: number, d: number) {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}`
  const hit = boxCache.get(key)
  if (hit) return hit
  const g = new THREE.BoxGeometry(w, h, d)
  const uv = g.attributes.uv as THREE.BufferAttribute
  // Face order: +x, -x, +y, -y, +z, -z (4 verts each)
  const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]
  for (let f = 0; f < 6; f++)
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v
      uv.setXY(i, uv.getX(i) * dims[f][0], uv.getY(i) * dims[f][1])
    }
  uv.needsUpdate = true
  boxCache.set(key, g)
  return g
}

/** Extruded wall with door notches and window holes. Local u runs along the wall. */
export function wallGeometry(w: Wall) {
  const [t0, t1] = w.top
  const topAt = (u: number) => t0 + ((u - w.from) / (w.to - w.from)) * (t1 - t0)
  const doors = w.openings.filter(o => o.sill === 0).sort((a, b) => a.from - b.from)
  const holes = w.openings.filter(o => o.sill > 0)

  const s = new THREE.Shape()
  s.moveTo(w.from, 0)
  for (const d of doors) {
    s.lineTo(d.from, 0)
    s.lineTo(d.from, d.head)
    s.lineTo(d.to, d.head)
    s.lineTo(d.to, 0)
  }
  s.lineTo(w.to, 0)
  s.lineTo(w.to, topAt(w.to))
  s.lineTo(w.from, topAt(w.from))
  s.closePath()

  for (const o of holes) {
    const h = new THREE.Path()
    h.moveTo(o.from, o.sill)
    h.lineTo(o.from, o.head)
    h.lineTo(o.to, o.head)
    h.lineTo(o.to, o.sill)
    h.closePath()
    s.holes.push(h)
  }
  return new THREE.ExtrudeGeometry(s, { depth: w.t, bevelEnabled: false })
}

/** Transform that places wall-local (u, v, depthOffset) into the world. */
export function wallTransform(w: Wall): { position: [number, number, number]; rotation: [number, number, number] } {
  return w.axis === 'x'
    ? { position: [0, 0, w.at], rotation: [0, 0, 0] }
    : { position: [w.at + w.t, 0, 0], rotation: [0, -Math.PI / 2, 0] }
}

/** Centre of an opening in world space, plus its size. */
export function openingFrame(w: Wall, o: Opening) {
  const u = (o.from + o.to) / 2
  const v = (o.sill + o.head) / 2
  const mid = w.at + w.t / 2
  const pos: [number, number, number] = w.axis === 'x' ? [u, v, mid] : [mid, v, u]
  return { pos, width: o.to - o.from, height: o.head - o.sill, rotY: w.axis === 'x' ? 0 : Math.PI / 2 }
}

/** Arch-topped shape (used for mirrors and Boho arches). */
export function archShape(w: number, h: number) {
  const r = w / 2
  const s = new THREE.Shape()
  s.moveTo(-r, 0)
  s.lineTo(r, 0)
  s.lineTo(r, h - r)
  s.absarc(0, h - r, r, 0, Math.PI, false)
  s.lineTo(-r, 0)
  return s
}
