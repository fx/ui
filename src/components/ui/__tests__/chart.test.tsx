import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '@tailwindcss/node'
import { render, screen } from '@testing-library/react'
import { Bar, BarChart } from 'recharts'
import { describe, expect, it, vi } from 'vitest'
import {
  type ChartConfig,
  ChartContainer,
  ChartContext,
  ChartLegendContent,
  ChartTooltipContent,
} from '../chart'

const testConfig: ChartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-1)',
  },
  count: {
    label: 'Count',
    color: 'var(--chart-2)',
  },
}

const testData = [
  { name: 'A', value: 100, count: 50 },
  { name: 'B', value: 200, count: 80 },
]

describe('ChartContainer', () => {
  it('generates valid selectors for chart stroke colors', async () => {
    render(
      <ChartContainer config={testConfig} data-testid="chart">
        <BarChart data={testData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>,
    )
    const base = join(dirname(fileURLToPath(import.meta.url)), '../../../..')
    const compiler = await compile('@import "./src/styles/globals.css";', {
      base,
      onDependency() {},
    })
    const css = compiler.build([...screen.getByTestId('chart').classList])
    expect(css.match(/stroke="#ccc"/g)).toHaveLength(3)
    expect(css.match(/stroke="#fff"/g)).toHaveLength(2)
    expect(css).not.toMatch(/stroke=#[a-f0-9]+\]/)
  })

  it('renders with data-slot', () => {
    render(
      <ChartContainer config={testConfig} data-testid="chart">
        <BarChart data={testData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>,
    )
    expect(screen.getByTestId('chart')).toHaveAttribute('data-slot', 'chart')
  })

  it('applies custom className', () => {
    render(
      <ChartContainer config={testConfig} data-testid="chart" className="custom-chart">
        <BarChart data={testData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>,
    )
    expect(screen.getByTestId('chart').className).toContain('custom-chart')
  })

  it('injects CSS color variables from config', () => {
    render(
      <ChartContainer config={testConfig} data-testid="chart">
        <BarChart data={testData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>,
    )
    const el = screen.getByTestId('chart')
    expect(el.style.getPropertyValue('--color-value')).toBe('var(--chart-1)')
    expect(el.style.getPropertyValue('--color-count')).toBe('var(--chart-2)')
  })

  it('sets data-chart attribute with unique id', () => {
    render(
      <ChartContainer config={testConfig} data-testid="chart">
        <BarChart data={testData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>,
    )
    expect(screen.getByTestId('chart')).toHaveAttribute('data-chart')
  })
})

describe('ChartTooltipContent', () => {
  it('renders nothing when not active', () => {
    const { container } = render(
      <ChartContext.Provider value={testConfig}>
        <ChartTooltipContent active={false} payload={[]} />
      </ChartContext.Provider>,
    )
    expect(container.querySelector('[data-slot="chart-tooltip-content"]')).toBeNull()
  })

  it('renders tooltip content when active with payload', () => {
    render(
      <ChartContext.Provider value={testConfig}>
        <ChartTooltipContent
          active={true}
          payload={[{ name: 'value', value: 100, dataKey: 'value', color: '#ff0000' }]}
          label="Test"
        />
      </ChartContext.Provider>,
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('formats numeric labels and zero values with the full payload', () => {
    const payload = [{ name: 'value', value: 0, dataKey: 'value', payload: { value: 0 } }]
    const formatter = vi.fn(() => <span>Formatted</span>)
    const labelFormatter = vi.fn(() => 'Formatted label')
    render(
      <ChartContext.Provider value={testConfig}>
        <ChartTooltipContent
          active
          label={0}
          payload={payload}
          formatter={formatter}
          labelFormatter={labelFormatter}
        />
      </ChartContext.Provider>,
    )
    expect(formatter).toHaveBeenCalledWith(0, 'value', payload[0], 0, payload[0]?.payload)
    expect(labelFormatter).toHaveBeenCalledWith(0, payload)
    expect(screen.getByText('Formatted')).toBeInTheDocument()
    expect(screen.getByText('Formatted label')).toBeInTheDocument()
  })

  it('renders zero without a formatter', () => {
    render(
      <ChartContext.Provider value={testConfig}>
        <ChartTooltipContent active payload={[{ name: 'value', value: 0 }]} />
      </ChartContext.Provider>,
    )
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('has data-slot on tooltip content', () => {
    const { container } = render(
      <ChartContext.Provider value={testConfig}>
        <ChartTooltipContent
          active={true}
          payload={[{ name: 'value', value: 50, dataKey: 'value', color: '#ff0000' }]}
          label="Label"
        />
      </ChartContext.Provider>,
    )
    expect(container.querySelector('[data-slot="chart-tooltip-content"]')).toBeTruthy()
  })

  it('hides label when hideLabel is true', () => {
    render(
      <ChartContext.Provider value={testConfig}>
        <ChartTooltipContent
          active={true}
          payload={[{ name: 'value', value: 50, dataKey: 'value', color: '#ff0000' }]}
          label="Hidden Label"
          hideLabel={true}
        />
      </ChartContext.Provider>,
    )
    expect(screen.queryByText('Hidden Label')).not.toBeInTheDocument()
  })
})

describe('ChartLegendContent', () => {
  it('renders nothing when payload is empty', () => {
    const { container } = render(
      <ChartContext.Provider value={testConfig}>
        <ChartLegendContent payload={[]} />
      </ChartContext.Provider>,
    )
    expect(container.querySelector('[data-slot="chart-legend-content"]')).toBeNull()
  })

  it('renders legend items from config labels', () => {
    render(
      <ChartContext.Provider value={testConfig}>
        <ChartLegendContent
          payload={[
            { value: 'value', color: '#ff0000' },
            { value: 'count', color: '#00ff00' },
          ]}
        />
      </ChartContext.Provider>,
    )
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('Count')).toBeInTheDocument()
  })

  it('has data-slot on legend content', () => {
    const { container } = render(
      <ChartContext.Provider value={testConfig}>
        <ChartLegendContent payload={[{ value: 'value', color: '#ff0000' }]} />
      </ChartContext.Provider>,
    )
    expect(container.querySelector('[data-slot="chart-legend-content"]')).toBeTruthy()
  })
})
