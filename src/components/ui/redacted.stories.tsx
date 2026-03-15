import type { Meta, StoryObj } from 'storybook'
import { StreamerModeProvider, useStreamerMode } from '@/components/streamer-mode-provider'
import { Redacted } from './redacted'

function ToggleButton() {
  const { enabled, toggle } = useStreamerMode()
  return (
    <button type="button" onClick={toggle} style={{ marginBottom: '16px' }}>
      Streamer Mode: {enabled ? 'ON' : 'OFF'}
    </button>
  )
}

const meta = {
  title: 'Complex/Redacted',
  component: Redacted,
  decorators: [
    (Story) => (
      <StreamerModeProvider>
        <ToggleButton />
        <Story />
      </StreamerModeProvider>
    ),
  ],
} satisfies Meta<typeof Redacted>

export default meta
type Story = StoryObj<typeof Redacted>

export const Default: Story = {
  args: {
    children: 'Sensitive Information',
    label: 'user-name',
  },
}

export const MultipleItems: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>
        Name: <Redacted label="name">John Doe</Redacted>
      </div>
      <div>
        Email: <Redacted label="email">john@example.com</Redacted>
      </div>
      <div>
        API Key: <Redacted label="key">sk-1234567890abcdef</Redacted>
      </div>
    </div>
  ),
}

export const CustomColor: Story = {
  args: {
    children: 'Custom Color Block',
    color: 'hsl(200, 80%, 50%)',
  },
}
