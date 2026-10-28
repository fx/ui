import * as React from 'react'
import type { Meta, StoryObj } from 'storybook'
import { DateRangeFields } from './date-range-fields'

const meta: Meta<typeof DateRangeFields> = {
  title: 'Form/DateRangeFields',
  component: DateRangeFields,
}
export default meta
type Story = StoryObj<typeof DateRangeFields>
export const Default: Story = {
  args: { legend: 'Dates', value: { from: '', to: '' }, onChange: () => {} },
  render: (args) => {
    const [value, setValue] = React.useState(args.value)
    return <DateRangeFields {...args} value={value} onChange={setValue} />
  },
}
export const Invalid: Story = {
  args: {
    legend: 'Dates',
    value: { from: '2026-05-02', to: '2026-05-01' },
    onChange: () => {},
    error: 'End must follow start.',
  },
}

export const ConstrainedWidth: Story = {
  args: { legend: 'Dates', value: { from: '', to: '' }, onChange: () => {} },
  render: (args) => {
    const [value, setValue] = React.useState(args.value)
    return (
      <div className="flex w-80 max-w-full border p-4">
        <DateRangeFields {...args} className="w-full" value={value} onChange={setValue} />
      </div>
    )
  },
}
