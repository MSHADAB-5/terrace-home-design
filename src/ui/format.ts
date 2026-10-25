export const fmtTime = (t: number) => {
  const h = Math.floor(t) % 24
  const m = Math.round((t - Math.floor(t)) * 60)
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m === 60 ? 0 : m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}
