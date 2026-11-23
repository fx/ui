/** One of the eight `--identity-N` colour tokens defined in `globals.css`. */
type IdentityTone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193

/**
 * Maps a stable key (a user id, an email, a name) to an identity tone in `1..count`.
 *
 * Uses 32-bit FNV-1a over the key's UTF-8 bytes, so the same key always gets the
 * same tone in every environment.
 */
function identityIndex(key: string, count = 8): number {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError(`identityIndex count must be a positive integer, got ${count}`)
  }
  let hash = FNV_OFFSET_BASIS
  for (const byte of new TextEncoder().encode(key)) {
    hash ^= byte
    hash = Math.imul(hash, FNV_PRIME) >>> 0
  }
  return (hash % count) + 1
}

export { identityIndex }
export type { IdentityTone }
