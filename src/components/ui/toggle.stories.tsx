import type { Meta, StoryObj } from 'storybook'
import { Toggle } from './toggle'

const meta = {
  title: 'Form/Toggle',
  component: Toggle,
  args: {
    children: 'Toggle',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {}

const variants = ['default', 'outline'] as const
const sizes = ['default', 'sm', 'lg'] as const

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground capitalize">{variant}</span>
          <div className="flex items-center gap-2">
            {sizes.map((size) => (
              <Toggle key={`${variant}-${size}`} variant={variant} size={size}>
                {size}
              </Toggle>
            ))}
            <Toggle variant={variant} defaultPressed>
              pressed
            </Toggle>
            <Toggle variant={variant} disabled>
              disabled
            </Toggle>
          </div>
        </div>
      ))}
    </div>
  ),
}
