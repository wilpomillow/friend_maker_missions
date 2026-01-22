function hashStringToU32(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}
function xorshift32(seed: number) {
  let x = seed >>> 0
  return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 0xffffffff }
}
export function seededShuffle<T>(items: T[], seedStr: string): T[] {
  const a = [...items]
  const rand = xorshift32(hashStringToU32(seedStr))
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
