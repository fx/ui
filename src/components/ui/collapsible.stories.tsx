import type { Meta, StoryObj } from 'storybook'
import { Button } from './button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'Container/Collapsible',
  component: Collapsible,
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80">
      <CollapsibleTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        Toggle content
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-md border p-4">
        <p className="text-sm">This is the collapsible content.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
}
