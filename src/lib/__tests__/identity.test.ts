import { describe, expect, it } from 'vitest'
import { identityIndex } from '../identity'

describe('identityIndex', () => {
  it('matches the FNV-1a 32-bit reference hash', () => {
    // FNV-1a("a") = 0xe40c292c, FNV-1a("foobar") = 0xbf9cf968
    expect(identityIndex('a', 0xffffffff)).toBe((0xe40c292c % 0xffffffff) + 1)
    expect(identityIndex('foobar', 0xffffffff)).toBe((0xbf9cf968 % 0xffffffff) + 1)
    expect(identityIndex('', 0xffffffff)).toBe((0x811c9dc5 % 0xffffffff) + 1)
  })

  it('is stable for the same key', () => {
    expect(identityIndex('ada@example.com')).toBe(identityIndex('ada@example.com'))
    expect(identityIndex('Grace Hopper', 5)).toBe(identityIndex('Grace Hopper', 5))
  })

  it('hashes non-ASCII keys by their UTF-8 bytes', () => {
    // "é" is 0xc3 0xa9 in UTF-8
    let hash = 0x811c9dc5
    for (const byte of [0xc3, 0xa9]) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0
    expect(identityIndex('é', 0xffffffff)).toBe((hash % 0xffffffff) + 1)
  })

  it('stays within 1..count', () => {
    for (const count of [1, 2, 3, 8, 13]) {
      for (let i = 0; i < 200; i++) {
        const index = identityIndex(`user-${i}`, count)
        expect(Number.isInteger(index)).toBe(true)
        expect(index).toBeGreaterThanOrEqual(1)
        expect(index).toBeLessThanOrEqual(count)
      }
    }
  })

  it('defaults to eight tones', () => {
    const seen = new Set(Array.from({ length: 200 }, (_, i) => identityIndex(`key-${i}`)))
    expect([...seen].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('spreads keys roughly evenly across tones', () => {
    const counts = new Array(8).fill(0)
    const total = 8000
    for (let i = 0; i < total; i++) counts[identityIndex(`person-${i}@example.com`) - 1]++
    for (const count of counts) {
      expect(count).toBeGreaterThan((total / 8) * 0.8)
      expect(count).toBeLessThan((total / 8) * 1.2)
    }
  })

  it('rejects an invalid count', () => {
    expect(() => identityIndex('a', 0)).toThrow(RangeError)
    expect(() => identityIndex('a', 2.5)).toThrow(RangeError)
  })
})
