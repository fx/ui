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
