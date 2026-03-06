import type { Meta, StoryObj } from 'storybook'
import { Switch } from './switch'

const meta = {
  title: 'Form/Switch',
  component: Switch,
  args: {
    'aria-label': 'Toggle setting',
    disabled: false,
  },
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {}

const sizes = ['default', 'sm'] as const

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground capitalize">{size}</span>
          <div className="flex items-center gap-4">
            <Switch size={size} aria-label={`${size} unchecked`} />
            <Switch size={size} defaultChecked aria-label={`${size} checked`} />
            <Switch size={size} disabled aria-label={`${size} disabled`} />
            <Switch size={size} disabled defaultChecked aria-label={`${size} disabled checked`} />
          </div>
        </div>
      ))}
    </div>
  ),
}
