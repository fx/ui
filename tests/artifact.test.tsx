import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { render, screen, waitFor } from '@testing-library/react'
import { Bar, BarChart, XAxis } from 'recharts'
import { afterAll, describe, expect, it, vi } from 'vitest'
import * as esm from '../dist/index.js'

const cjs = createRequire(import.meta.url)('../dist/index.cjs') as typeof esm

class ResizeObserverMock {
  constructor(private callback: ResizeObserverCallback) {}
  observe(element: Element) {
    this.callback(
      [{ target: element, contentRect: { width: 500, height: 300 } }] as ResizeObserverEntry[],
      this as unknown as ResizeObserver,
    )
  }
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)
vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
  this: HTMLElement,
) {
  const height = this.classList.contains('recharts-responsive-container') ? 300 : 0
  return {
    width: 500,
    height,
    x: 0,
    y: 0,
    top: 0,
    right: 500,
    bottom: height,
    left: 0,
    toJSON() {},
  }
})
afterAll(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe.each([
  ['ESM', esm],
  ['CJS', cjs],
] as const)('%s built package', (_, ui) => {
  it('shares the real Recharts context with a consumer chart', async () => {
    const { container } = render(
      <ui.ChartContainer config={{ value: { label: 'Total', color: 'red' } }}>
        <BarChart data={[{ category: 'A', value: 0 }]}>
          <XAxis dataKey="category" />
          <ui.ChartTooltip
            active
            defaultIndex={0}
            isAnimationActive={false}
            content={
              <ui.ChartTooltipContent
                labelFormatter={(label) => `Category: ${label}`}
                formatter={(value) => `Value: ${value}`}
              />
            }
          />
          <ui.ChartLegend />
          <Bar dataKey="value" fill="var(--color-value)" isAnimationActive={false} />
        </BarChart>
      </ui.ChartContainer>,
    )
    await waitFor(() => expect(container.querySelector('.recharts-bar-rectangle')).toBeTruthy())
    expect(
      container
        .querySelector<HTMLElement>('[data-slot=chart]')
        ?.style.getPropertyValue('--color-value'),
    ).toBe('red')
    expect(await screen.findByText('Category: A')).toBeInTheDocument()
    expect(screen.getByText('Value: 0')).toBeInTheDocument()
    expect(container.querySelector('[data-slot=chart-legend-content]')).toHaveTextContent('Total')
  })
})

it('leaves Recharts external in both artifacts', () => {
  expect(readFileSync('dist/index.js', 'utf8')).toMatch(/from\s*["']recharts["']/)
  expect(readFileSync('dist/index.cjs', 'utf8')).toMatch(/require\(["']recharts["']\)/)
})
