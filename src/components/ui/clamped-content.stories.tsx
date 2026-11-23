import type { Meta, StoryObj } from 'storybook'
import { ClampedContent } from './clamped-content'

const meta: Meta<typeof ClampedContent> = {
  title: 'Container/ClampedContent',
  component: ClampedContent,
  args: { maxHeight: '10rem', threshold: 1.5 },
}

export default meta
type Story = StoryObj<typeof ClampedContent>

const paragraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

export const Long: Story = {
  render: (args) => (
    <div className="max-w-md border bg-card p-3 text-sm">
      <ClampedContent {...args}>
        {Array.from({ length: 8 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static sample content
          <p key={i} className="mb-2">
            {paragraph}
          </p>
        ))}
        <a href="#focus" className="underline">
          Focusable link near the end
        </a>
      </ClampedContent>
    </div>
  ),
}

export const WithinThreshold: Story = {
  render: (args) => (
    <div className="max-w-md border bg-card p-3 text-sm">
      <ClampedContent {...args}>
        {Array.from({ length: 3 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static sample content
          <p key={i} className="mb-2">
            {paragraph}
          </p>
        ))}
      </ClampedContent>
    </div>
  ),
}

export const OnBackground: Story = {
  args: { fadeFrom: 'var(--background)', moreLabel: 'Read more', lessLabel: 'Collapse' },
  render: (args) => (
    <div className="max-w-md text-sm">
      <ClampedContent {...args}>
        {Array.from({ length: 8 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static sample content
          <p key={i} className="mb-2">
            {paragraph}
          </p>
        ))}
      </ClampedContent>
    </div>
  ),
}
