import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cn, formatFullTime, formatRelativeTime } from '../utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges tailwind classes with last-wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles undefined and null inputs', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Never" for null', () => {
    expect(formatRelativeTime(null)).toBe('Never')
  })

  it('returns "Never" for undefined', () => {
    expect(formatRelativeTime(undefined)).toBe('Never')
  })

  it('returns "now" for timestamps less than 5 seconds ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 2000)).toBe('now')
  })

  it('returns seconds ago for timestamps less than 60 seconds ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 30000)).toBe('30s ago')
  })

  it('returns minutes ago for timestamps less than 60 minutes ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 5 * 60 * 1000)).toBe('5m ago')
  })

  it('returns hours ago for timestamps less than 24 hours ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 3 * 60 * 60 * 1000)).toBe('3h ago')
  })

  it('returns days ago for timestamps 24+ hours ago', () => {
    const now = Date.now()
    expect(formatRelativeTime(now - 2 * 24 * 60 * 60 * 1000)).toBe('2d ago')
  })

  it('returns "Never" for 0', () => {
    expect(formatRelativeTime(0)).toBe('Never')
  })
})

describe('formatFullTime', () => {
  it('returns "Never" for null', () => {
    expect(formatFullTime(null)).toBe('Never')
  })

  it('returns "Never" for undefined', () => {
    expect(formatFullTime(undefined)).toBe('Never')
  })

  it('returns "Never" for 0', () => {
    expect(formatFullTime(0)).toBe('Never')
  })

  it('formats a timestamp in en-US format', () => {
    const result = formatFullTime(1705312800000)
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/2024/)
  })
})
