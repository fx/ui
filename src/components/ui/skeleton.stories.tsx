import type { Meta, StoryObj } from 'storybook'
import { Skeleton } from './skeleton'

const meta = {
  title: 'Foundation/Skeleton',
  component: Skeleton,
  args: {
    className: 'h-12 w-48',
  },
  argTypes: {
    className: { control: 'text' },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {}
