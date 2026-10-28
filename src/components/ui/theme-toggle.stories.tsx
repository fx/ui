import type { Meta, StoryObj } from 'storybook'
import { ThemeProvider } from '../theme-provider'
import { ThemeToggle } from './theme-toggle'

const meta = {
  title: 'Foundation/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    docs: {
      description: {
        component:
          'While the provider resolves the stored or system theme, the toggle is disabled, shows a neutral icon, and is labelled “Loading theme”. It then offers the opposite of the resolved theme.',
      },
    },
  },
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

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: { story: 'A caller can keep the toggle disabled after initialization.' },
    },
  },
}
