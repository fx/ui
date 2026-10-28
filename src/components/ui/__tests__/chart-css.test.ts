import { readFileSync } from 'node:fs'
import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import { transform } from 'lightningcss'
import { expect, it } from 'vitest'

it('generates valid chart selectors for the default Recharts strokes', async () => {
  const source = readFileSync('src/components/ui/chart.tsx', 'utf8')
  const scanner = new Scanner({ sources: [] })
  const candidates = scanner.scanFiles([{ content: source, extension: 'tsx' }])
  const compiler = await compile('@theme { --color-border: #000; } @tailwind utilities;', {
    base: process.cwd(),
  })
  const css = compiler.build(candidates)
  const result = transform({ filename: 'chart.css', code: Buffer.from(css), errorRecovery: true })
  expect(result.warnings).toEqual([])
  expect(result.code.toString()).toContain('[stroke="#ccc"]')
  expect(result.code.toString()).toContain('[stroke="#fff"]')
})
