import type { Meta, StoryObj } from 'storybook'
import { Textarea } from './textarea'

const meta = {
  title: 'Foundation/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Type your message...',
    disabled: false,
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {}
