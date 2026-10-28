import type { Meta, StoryObj } from 'storybook'
import { CopyButton } from './copy-button'

const meta = {
  title: 'Foundation/CopyButton',
  component: CopyButton,
  args: { text: 'Hello, world!' },
} satisfies Meta<typeof CopyButton>
export default meta
type Story = StoryObj<typeof CopyButton>
export const Default: Story = {}
