import { fireEvent, render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DateRangeFields } from '../date-range-fields'

describe('DateRangeFields', () => {
  it('emits raw edited pairs and preserves the other bound', () => {
    const onChange = vi.fn()
    render(
      <DateRangeFields
        legend="Period"
        value={{ from: '2026-01-01', to: '2026-02-01' }}
        onChange={onChange}
      />,
    )
    fireEvent.change(screen.getByLabelText('Period From'), { target: { value: '2026-03-01' } })
    expect(onChange).toHaveBeenLastCalledWith({ from: '2026-03-01', to: '2026-02-01' })
    fireEvent.change(screen.getByLabelText('Period To'), { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith({ from: '2026-01-01', to: '' })
  })
  it('associates unique labels and errors, honors disabled, class and ref', () => {
    const ref = createRef<HTMLFieldSetElement>()
    const onChange = vi.fn()
    render(
      <>
        <DateRangeFields
          legend="First"
          value={{ from: '', to: '' }}
          onChange={onChange}
          error="Invalid range"
          disabled
          ref={ref}
          className="custom"
        />
        <DateRangeFields
          legend="Second"
          value={{ from: '', to: '' }}
          onChange={onChange}
          fromLabel="Start"
          toLabel="End"
        />
      </>,
    )
    const group = screen.getByRole('group', { name: 'First' })
    const from = within(group).getByLabelText('First From')
    expect(group).toBe(ref.current)
    expect(group).toHaveClass('custom')
    expect(group).toHaveAttribute('data-slot', 'date-range-fields')
    expect(from).toBeDisabled()
    expect(from).toHaveAttribute('aria-invalid', 'true')
    expect(from).toHaveAccessibleDescription('Invalid range')
    expect(within(group).getByLabelText('First To')).toHaveAccessibleDescription('Invalid range')
    expect(screen.getByLabelText('Second Start').id).not.toBe(from.id)
    expect(screen.getByLabelText('Second End')).not.toHaveAttribute('aria-invalid')
  })
})
