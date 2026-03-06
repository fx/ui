import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import type { Meta, StoryObj } from 'storybook'
import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from './chart'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
]

const config: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(0 0% 30%)',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(0 0% 60%)',
  },
}

const meta: Meta<typeof ChartContainer> = {
  title: 'Complex/Chart',
  component: ChartContainer,
}

export default meta
type Story = StoryObj<typeof ChartContainer>

export const Default: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip />
        <ChartLegend />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}
