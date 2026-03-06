import type { Meta, StoryObj } from 'storybook'
import { AspectRatio } from './aspect-ratio'

const meta = {
  title: 'Foundation/AspectRatio',
  component: AspectRatio,
  args: {
    ratio: 16 / 9,
  },
  argTypes: {
    ratio: { control: 'number' },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          {args.ratio ? `${args.ratio.toFixed(2)}:1` : '16:9'}
        </div>
      </AspectRatio>
    </div>
  ),
}
