import { useState } from 'react'
import type { Meta, StoryObj } from 'storybook'
import { Slider } from './slider'

const meta = {
  title: 'Form/Slider',
  component: Slider,
  args: {
    'aria-label': 'Value',
    defaultValue: 40,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {}

function ControlledScalarExample() {
  const [value, setValue] = useState(40)
  return (
    <div className="flex w-72 flex-col gap-4">
      <Slider aria-label="Value" value={value} onValueChange={setValue} />
      <output>{value}</output>
    </div>
  )
}

export const ControlledScalar: Story = {
  render: () => <ControlledScalarExample />,
}

function ControlledArrayExample() {
  const [value, setValue] = useState([40])
  const [committed, setCommitted] = useState([40])
  return (
    <div className="flex w-72 flex-col gap-4">
      <Slider
        aria-label="Value"
        value={value}
        onValueChange={setValue}
        onValueCommitted={setCommitted}
      />
      <output>{value.join(', ')}</output>
      <output aria-label="Committed value">Committed: {committed.join(', ')}</output>
    </div>
  )
}

export const ControlledArray: Story = {
  render: () => <ControlledArrayExample />,
}

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    minStepsBetweenValues: 10,
    getAriaLabel: (index) => (index === 0 ? 'Minimum' : 'Maximum'),
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

export const Decimal: Story = {
  args: {
    min: 0,
    max: 1,
    step: 0.05,
    largeStep: 0.25,
    defaultValue: 0.5,
    format: { style: 'percent' },
    getAriaValueText: (formattedValue) => formattedValue,
  },
}

export const CustomWidth: Story = {
  args: { className: 'w-64' },
}
