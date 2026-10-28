import type { Meta, StoryObj } from 'storybook'
import { ThemeProvider } from '../theme-provider'
import { ThemeToggle } from './theme-toggle'

const meta = {
  title: 'Foundation/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>
export default meta
type Story = StoryObj<typeof ThemeToggle>
export const Default: Story = {}
