import type { Meta, StoryObj } from 'storybook'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta = {
  title: 'Container/Alert',
  component: Alert,
  args: {
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is an alert message.</AlertDescription>
      </>
    ),
  },
}

const variants = ['default', 'destructive', 'success', 'warning', 'info'] as const

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      {variants.map((variant) => (
        <Alert key={variant} variant={variant}>
          <AlertTitle className="capitalize">{variant}</AlertTitle>
          <AlertDescription>This is a {variant} alert message.</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}
