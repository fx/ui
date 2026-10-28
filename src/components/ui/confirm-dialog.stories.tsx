import * as React from 'react'
import type { Meta, StoryObj } from 'storybook'
import { Button } from './button'
import { ConfirmDialog } from './confirm-dialog'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Overlay/ConfirmDialog',
  component: ConfirmDialog,
}
export default meta
type Story = StoryObj<typeof ConfirmDialog>

export const Default: Story = {
  args: { open: false, onOpenChange: () => {}, title: 'Continue?', onConfirm: () => {} },
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open confirmation</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          description="Please confirm this action."
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}
export const Pending: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Saving',
    description: 'Please wait.',
    onConfirm: () => {},
    pending: true,
  },
}
export const WithError: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Continue?',
    onConfirm: () => {},
    variant: 'destructive',
    error: 'The action could not be completed.',
  },
}
