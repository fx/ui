import type { Meta, StoryObj } from 'storybook'
import { Separator } from './separator'

const meta = {
  title: 'Foundation/Separator',
  component: Separator,
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: (args) => (
    <div className={args.orientation === 'vertical' ? 'flex h-16 items-center' : 'w-full'}>
      <Separator {...args} />
    </div>
  ),
}
