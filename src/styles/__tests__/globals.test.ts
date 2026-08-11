import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
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

describe('globals.css', () => {
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
