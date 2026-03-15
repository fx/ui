import { AlertTriangle, Check, Loader2, X } from 'lucide-react'
import type { Meta, StoryObj } from 'storybook'
import { Badge } from './badge'
import { StatusOverlay } from './status-overlay'

const meta = {
  title: 'Complex/StatusOverlay',
  component: StatusOverlay,
} satisfies Meta<typeof StatusOverlay>

export default meta
type Story = StoryObj<typeof StatusOverlay>

function ColorSquare({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative inline-flex size-10 items-center justify-center rounded-md bg-secondary">
      {children}
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ColorSquare>
      <StatusOverlay className="bg-green-600 text-white">
        <Check className="size-3" />
      </StatusOverlay>
    </ColorSquare>
  ),
}

export const AllPositions: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <ColorSquare>
        <StatusOverlay position="bottom-right" className="bg-green-600 text-white">
          <Check className="size-3" />
        </StatusOverlay>
      </ColorSquare>
      <ColorSquare>
        <StatusOverlay position="bottom-left" className="bg-red-600 text-white">
          <X className="size-3" />
        </StatusOverlay>
      </ColorSquare>
      <ColorSquare>
        <StatusOverlay position="top-right" className="bg-yellow-600 text-white">
          <AlertTriangle className="size-3" />
        </StatusOverlay>
      </ColorSquare>
      <ColorSquare>
        <StatusOverlay position="top-left" className="bg-blue-600 text-white">
          <Loader2 className="size-3" />
        </StatusOverlay>
      </ColorSquare>
    </div>
  ),
}

export const Animated: Story = {
  render: () => (
    <ColorSquare>
      <StatusOverlay animated className="bg-blue-600 text-white">
        <Loader2 className="size-3 animate-spin" />
      </StatusOverlay>
    </ColorSquare>
  ),
}

export const OnBadge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative inline-flex">
        <Badge variant="secondary">Running</Badge>
        <StatusOverlay className="bg-green-600 text-white">
          <Check className="size-2.5" />
        </StatusOverlay>
      </div>
      <div className="relative inline-flex">
        <Badge variant="destructive">Error</Badge>
        <StatusOverlay animated className="bg-yellow-600 text-white">
          <AlertTriangle className="size-2.5" />
        </StatusOverlay>
      </div>
    </div>
  ),
}
