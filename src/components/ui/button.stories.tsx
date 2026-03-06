import { ChevronRight } from 'lucide-react'
import type { Meta, StoryObj } from 'storybook'
import { Button } from './button'

const meta = {
  title: 'Foundation/Button',
  component: Button,
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
const sizes = ['default', 'xs', 'sm', 'lg'] as const
const iconSizes = ['icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const

export const AsChildLink: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button asChild>
        <a href="#home">Default link</a>
      </Button>
      <Button asChild variant="destructive">
        <a href="#delete">Destructive link</a>
      </Button>
      <Button asChild variant="outline">
        <a href="#outline">Outline link</a>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <a href="#ghost">Ghost sm</a>
      </Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground capitalize">{variant}</span>
          <div className="flex items-center gap-2">
            {sizes.map((size) => (
              <Button key={`${variant}-${size}`} variant={variant} size={size}>
                {size === 'default' ? variant : size}
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
            </Button>
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Icon sizes</span>
        <div className="flex items-center gap-2">
          {iconSizes.map((size) => (
            <Button key={size} variant="outline" size={size} aria-label={size}>
              <ChevronRight />
            </Button>
          ))}
        </div>
      </div>
    </div>
  ),
}
