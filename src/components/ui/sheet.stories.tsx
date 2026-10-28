import type { Meta, StoryObj } from 'storybook'
import { Button } from './button'
import type { SheetContentProps } from './sheet'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'

type SheetStoryArgs = { side: SheetContentProps['side'] }

const meta = {
  parameters: {
    docs: {
      description: { component: 'Popup transitions respect the reduced motion preference.' },
    },
  },
  title: 'Overlay/Sheet',
  component: Sheet,
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
} satisfies Meta<SheetStoryArgs>

export default meta
type Story = StoryObj<SheetStoryArgs>

export const Default: Story = {
  args: {
    side: 'right',
  },
  render: ({ side }) => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open Sheet</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>This is a sheet description.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const FlushBottom: Story = {
  args: { side: 'bottom' },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent side="bottom" flush showCloseButton={false}>
        <SheetHeader className="p-4">
          <SheetTitle>Details</SheetTitle>
          <SheetDescription>Scrollable content</SheetDescription>
        </SheetHeader>
        <div className="p-4">Content</div>
      </SheetContent>
    </Sheet>
  ),
}

export const TallContent: Story = {
  args: { side: 'top' },
  render: ({ side }) => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open tall sheet</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Tall content</SheetTitle>
          <SheetDescription>Scroll to the end of the sheet.</SheetDescription>
        </SheetHeader>
        {Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </SheetContent>
    </Sheet>
  ),
}
