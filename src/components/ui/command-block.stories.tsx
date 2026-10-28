import type { Meta, StoryObj } from 'storybook'
import { CommandBlock } from './command-block'

const meta = {
  title: 'Complex/CommandBlock',
  component: CommandBlock,
  args: { commands: ['npm install', 'npm run build'], label: 'Quick start' },
} satisfies Meta<typeof CommandBlock>
export default meta
type Story = StoryObj<typeof CommandBlock>
export const Default: Story = {}
