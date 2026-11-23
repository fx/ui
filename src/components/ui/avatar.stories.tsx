import { Bot } from 'lucide-react'
import type { Meta, StoryObj } from 'storybook'
import { Avatar } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Foundation/Avatar',
  component: Avatar,
  args: { label: 'Ada Lovelace' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'inverse', 1, 2, 3, 4, 5, 6, 7, 8] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar label="Ada Lovelace" />
      <Avatar label="Build Bot" tone="inverse" icon={<Bot />} />
      {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((tone) => (
        <Avatar key={tone} label={`Identity ${tone}`} initials={`${tone}`} tone={tone} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar label="Grace Hopper" tone={5} size="sm" />
      <Avatar label="Grace Hopper" tone={5} size="md" />
    </div>
  ),
}
