import type { Meta, StoryObj } from 'storybook'
import { Badge } from './badge'

const meta = {
  title: 'Foundation/Badge',
  component: Badge,
  args: {
    children: 'Badge',
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost'] as const

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}
