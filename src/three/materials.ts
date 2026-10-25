import * as THREE from 'three'
import type { Theme } from '../data/themes'
import {
  brickTex, caneTex, concreteTex, flutedColor, flutedNormal, glassBlockTex, microcementTex,
  roofRibTex, terrazzoTex, tileTex, woodTex,
} from './textures'

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)

/** Shared materials. Theme colours are lerped onto these every frame (see ThemeAnimator). */
export const mats = {
  floor: std({ roughness: 0.55 }),
  wall: std({ roughness: 0.9 }),
  ceiling: std({ roughness: 0.95 }),
  accent: std({ roughness: 0.6 }),
  wood: std({ roughness: 0.55 }),
  metal: std({ roughness: 0.35, metalness: 0.6 }),
  fabric: std({ roughness: 1 }),
  fabric2: std({ roughness: 1 }),
  counter: std({ roughness: 0.25 }),
  bathTile: std({ roughness: 0.5 }),
  rug: std({ roughness: 1 }),
  led: std({ color: '#000000', emissive: '#ffd49a', emissiveIntensity: 2, toneMapped: false }),
  ledCool: std({ color: '#000000', emissive: '#cfe6ff', emissiveIntensity: 1.5, toneMapped: false }),
  white: std({ color: '#f6f6f4', roughness: 0.15 }),
  black: std({ color: '#151515', roughness: 0.4 }),
  tv: std({ color: '#050505', roughness: 0.1, emissive: '#3a6fd8', emissiveIntensity: 0 }),
  mirror: std({ color: '#dfe7ea', roughness: 0.02, metalness: 1 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: '#cfe4ea', roughness: 0.05, transmission: 0.9, thickness: 0.05, transparent: true, opacity: 0.35,
  }),
  frosted: new THREE.MeshPhysicalMaterial({
    color: '#eef3f3', roughness: 0.5, transmission: 0.6, transparent: true, opacity: 0.75,
  }),
  glassBlock: std({ map: glassBlockTex(), roughness: 0.15, transparent: true, opacity: 0.9, emissive: '#ffffff', emissiveIntensity: 0.15 }),
  skylight: std({ color: '#e8f4ff', roughness: 0.3, transparent: true, opacity: 0.55, emissive: '#bcd8ff', emissiveIntensity: 0.4 }),
  roof: std({ color: '#7d8a8f', map: roofRibTex(), roughness: 0.45, metalness: 0.6, side: THREE.DoubleSide }),
  roofUnder: std({ color: '#e8e6e1', roughness: 0.8 }),
  steel: std({ color: '#2d3033', roughness: 0.4, metalness: 0.8 }),
  parapet: std({ color: '#e6e0d6', roughness: 0.95, map: concreteTex() }),
  terrace: std({ color: '#b9b2a8', roughness: 0.95, map: concreteTex() }),
  sitoutFloor: std({ color: '#a59a8c', roughness: 0.8, map: tileTex() }),
  leaf: std({ color: '#4d7a45', roughness: 0.8 }),
  pot: std({ color: '#b86b4b', roughness: 0.9 }),
  frame: std({ color: '#2a2a2a', roughness: 0.4, metalness: 0.7 }),
  blind: std({ color: '#efe8dc', roughness: 1, side: THREE.DoubleSide }),
}

export type MatKey = keyof typeof mats

const floorMaps = { wood: woodTex, terrazzo: terrazzoTex, tile: tileTex, concrete: concreteTex }

export function applyThemeMaps(t: Theme) {
  mats.floor.map = floorMaps[t.floorType]()
  mats.floor.roughness = t.floorType === 'terrazzo' ? 0.2 : t.floorType === 'concrete' ? 0.7 : 0.5
  if (t.accentType === 'fluted') {
    mats.accent.map = flutedColor()
    mats.accent.normalMap = flutedNormal()
  } else {
    mats.accent.map = t.accentType === 'brick' ? brickTex() : caneTex()
    mats.accent.normalMap = null
  }
  mats.wood.map = woodTex()
  mats.counter.map = t.id === 'luxe' ? terrazzoTex() : t.id === 'industrial' ? concreteTex() : null
  mats.bathTile.map = t.id === 'boho' ? tileTex() : microcementTex()
  mats.wall.map = t.id === 'industrial' ? concreteTex() : null
  mats.metal.metalness = t.metalness
  for (const m of Object.values(mats)) m.needsUpdate = true
}

/** Theme colour keys that animate. */
export const themedKeys = [
  'floor', 'wall', 'ceiling', 'accent', 'wood', 'metal', 'fabric', 'fabric2', 'counter', 'bathTile', 'rug',
] as const
