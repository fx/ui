import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '@tailwindcss/node'
import { describe, expect, it } from 'vitest'
import packageJson from '../../../package.json'

/**
 * `globals.css` is published and re-parsed inside the consumer's Tailwind
 * build, so every bare specifier it names is resolved from the *consumer's*
 * `node_modules`. Anything it references therefore has to reach them as a
 * runtime dependency; a devDependency fails their build outright with
 * "Can't resolve ...".
 *
 * Tailwind itself is the exception: it is the compiler running the build, so
 * it is necessarily already installed and cannot be supplied from here.
 */
const CONSUMER_PROVIDED = new Set(['tailwindcss'])

const here = dirname(fileURLToPath(import.meta.url))
const globalsCss = readFileSync(join(here, '..', 'globals.css'), 'utf8')

function packageNameOf(specifier: string): string {
  const segments = specifier.split('/')
  return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : (segments[0] ?? specifier)
}

function referencedPackages(): string[] {
  const references = globalsCss.matchAll(/^\s*@(?:import|plugin)\s+["']([^"']+)["']/gm)
  const names = [...references]
    .map((match) => match[1] ?? '')
    .filter(
      (specifier) => specifier !== '' && !specifier.startsWith('.') && !specifier.startsWith('/'),
    )
    .map(packageNameOf)
    .filter((name) => !CONSUMER_PROVIDED.has(name))
  return [...new Set(names)]
}

function themeBlock(selector: string): string {
  const start = globalsCss.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`Missing ${selector} block`)
  return globalsCss.slice(start, globalsCss.indexOf('}', start))
}

function oklchVar(block: string, name: string): [number, number, number] {
  const match = block.match(new RegExp(`--${name}:\\s*oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\);`))
  if (!match) throw new Error(`Missing opaque oklch value for --${name}`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/** OKLCH → gamut-clipped linear sRGB (Björn Ottosson's OKLab matrices). */
function oklchToLinearSrgb([l, c, h]: [number, number, number]): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const clip = (v: number) => Math.min(1, Math.max(0, v))
  return [
    clip(4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp),
    clip(-1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp),
    clip(-0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp),
  ]
}

function contrast(x: [number, number, number], y: [number, number, number]): number {
  const luminance = (color: [number, number, number]) => {
    const [r, g, b] = oklchToLinearSrgb(color)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

const identityTones = [1, 2, 3, 4, 5, 6, 7, 8]

describe.each([
  ['light', ':root'],
  ['dark', '.dark'],
])('identity tokens (%s)', (_, selector) => {
  const block = themeBlock(selector)

  it('calibrates its contrast maths against known values', () => {
    expect(contrast([1, 0, 0], [0, 0, 0])).toBeCloseTo(21, 1)
  })

  it.each(identityTones)('keeps identity-%i foreground text at 4.5:1 or more', (tone) => {
    const fill = oklchVar(block, `identity-${tone}`)
    const text = oklchVar(block, `identity-${tone}-foreground`)
    expect(contrast(fill, text)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(identityTones)('keeps identity-%i at 3:1 or more against the card', (tone) => {
    expect(
      contrast(oklchVar(block, `identity-${tone}`), oklchVar(block, 'card')),
    ).toBeGreaterThanOrEqual(3)
  })
})

describe('globals.css', () => {
  it('registers imported theme tokens, typography, and animations in Tailwind', async () => {
    const compiler = await compile('@import "./src/styles/globals.css";', {
      base: join(here, '../../..'),
      onDependency() {},
    })
    const css = compiler.build([
      'bg-primary',
      'prose',
      'animate-collapsible-down',
      'motion-reduce:transition-none',
      'bg-identity-3',
      'text-identity-3-foreground',
    ])
    expect(css).toContain('background-color: var(--primary)')
    expect(css).toContain('.prose')
    expect(css).toContain('collapsible-down')
    expect(css).toContain('prefers-reduced-motion: reduce')
    expect(css).toContain('transition-property: none')
    expect(css).toContain('background-color: var(--identity-3)')
    expect(css).toContain('color: var(--identity-3-foreground)')
  })

  it('references at least one external package', () => {
    // Guards the guard: a regex that silently stops matching would otherwise
    // turn this suite into a no-op.
    expect(referencedPackages().length).toBeGreaterThan(0)
  })

  it.each(referencedPackages())('declares %s as a runtime dependency', (name) => {
    // Defaulted so a missing field fails on the assertion rather than throwing
    // a TypeError that hides which package is actually undeclared.
    expect(Object.keys(packageJson.dependencies ?? {})).toContain(name)
  })

  it.each(referencedPackages())('does not leave %s in devDependencies only', (name) => {
    expect(Object.keys(packageJson.devDependencies ?? {})).not.toContain(name)
  })
})
