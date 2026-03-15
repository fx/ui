import { Check, X } from 'lucide-react'
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

export const AsLink: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge asChild>
        <a href="#default">Default link</a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="#secondary">Secondary link</a>
      </Badge>
      <Badge asChild variant="destructive">
        <a href="#destructive">Destructive link</a>
      </Badge>
      <Badge asChild variant="outline">
        <a href="#outline">Outline link</a>
      </Badge>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge>
        <Check />
      </Badge>
      <Badge variant="destructive">
        <X />
      </Badge>
      <Badge variant="secondary">
        <Check />
      </Badge>
      <Badge variant="outline">
        <X />
      </Badge>
    </div>
  ),
}
