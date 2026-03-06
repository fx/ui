import type { Meta, StoryObj } from 'storybook'
import { Checkbox } from './checkbox'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    'aria-label': 'Example checkbox',
    disabled: false,
  },
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="flex items-center gap-2 text-sm">
        <Checkbox aria-label="Unchecked" />
        Unchecked
      </span>
      <span className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked aria-label="Checked" />
        Checked
      </span>
      <span className="flex items-center gap-2 text-sm">
        <Checkbox checked="mixed" aria-label="Indeterminate" />
        Indeterminate
      </span>
      <span className="flex items-center gap-2 text-sm">
        <Checkbox disabled aria-label="Disabled" />
        Disabled
      </span>
      <span className="flex items-center gap-2 text-sm">
        <Checkbox disabled defaultChecked aria-label="Disabled checked" />
        Disabled checked
      </span>
    </div>
  ),
}
