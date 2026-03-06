import type { Meta, StoryObj } from 'storybook'
import { Label } from './label'

const meta = {
  title: 'Foundation/Label',
  component: Label,
  args: {
    children: 'Email address',
  },
  argTypes: {
    htmlFor: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}
