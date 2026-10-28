import type { Meta, StoryObj } from 'storybook'
import { Progress } from './progress'

const meta: Meta<typeof Progress> = {
  title: 'Form/Progress',
  component: Progress,
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    value: 60,
    className: 'w-64',
  },
}

export const Customized: Story = {
  args: {
    value: 45,
    className: 'w-64',
    trackClassName: 'h-1 bg-muted',
    indicatorClassName: 'bg-foreground',
  },
}
