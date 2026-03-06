import type { Meta, StoryObj } from 'storybook'
import { Input } from './input'

const meta = {
  title: 'Foundation/Input',
  component: Input,
  args: {
    placeholder: 'Enter text...',
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}
