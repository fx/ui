import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '../checkbox'

describe('Checkbox', () => {
  it('renders as a checkbox', () => {
    render(<Checkbox aria-label="test" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Checkbox aria-label="test" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'checkbox')
  })

  it('toggles checked state on click', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="test" onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('supports controlled checked state', () => {
    render(<Checkbox aria-label="test" checked />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-checked', '')
  })

  it('supports disabled state', () => {
    render(<Checkbox aria-label="test" disabled />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true')
  })

  it('merges custom className', () => {
    render(<Checkbox aria-label="test" className="custom-class" />)
    expect(screen.getByRole('checkbox').className).toContain('custom-class')
  })

  describe('Radix compat: data-state attribute', () => {
    it('has data-state="unchecked" by default', () => {
      render(<Checkbox aria-label="test" />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
    })

    it('has data-state="checked" when controlled checked', () => {
      render(<Checkbox aria-label="test" checked />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
    })

    it('has data-state="unchecked" when controlled unchecked', () => {
      render(<Checkbox aria-label="test" checked={false} />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
    })

    it('has data-state="indeterminate" when indeterminate', () => {
      render(<Checkbox aria-label="test" indeterminate />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate')
    })

    it('prefers indeterminate over checked for data-state', () => {
      render(<Checkbox aria-label="test" checked indeterminate />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate')
    })

    it('updates data-state on click (uncontrolled)', async () => {
      const user = userEvent.setup()
      render(<Checkbox aria-label="test" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
      await user.click(checkbox)
      expect(checkbox).toHaveAttribute('data-state', 'checked')
      await user.click(checkbox)
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })

    it('also has Base UI data-checked attribute when checked', () => {
      render(<Checkbox aria-label="test" checked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'checked')
      expect(checkbox).toHaveAttribute('data-checked', '')
    })

    it('also has Base UI data-unchecked attribute when unchecked', () => {
      render(<Checkbox aria-label="test" checked={false} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
      expect(checkbox).toHaveAttribute('data-unchecked', '')
    })
  })

  describe('Radix compat: onCheckedChange', () => {
    it('calls onCheckedChange with boolean value', async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()
      render(<Checkbox aria-label="test" onCheckedChange={onCheckedChange} />)
      await user.click(screen.getByRole('checkbox'))
      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    })

    it('calls onCheckedChange with false when unchecking', async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()
      render(<Checkbox aria-label="test" defaultChecked onCheckedChange={onCheckedChange} />)
      await user.click(screen.getByRole('checkbox'))
      expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything())
    })
  })

  describe('Radix compat: indeterminate prop', () => {
    it('accepts indeterminate prop', () => {
      render(<Checkbox aria-label="test" indeterminate />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
    })

    it('has data-indeterminate attribute from Base UI', () => {
      render(<Checkbox aria-label="test" indeterminate />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-indeterminate', '')
    })
  })

  describe('Radix compat: controlled and uncontrolled modes', () => {
    it('works in uncontrolled mode with defaultChecked', async () => {
      const user = userEvent.setup()
      render(<Checkbox aria-label="test" defaultChecked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-checked', '')
      expect(checkbox).toHaveAttribute('data-state', 'checked')
      await user.click(checkbox)
      expect(checkbox).toHaveAttribute('data-unchecked', '')
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })

    it('works in controlled mode', () => {
      const { rerender } = render(<Checkbox aria-label="test" checked={false} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
      rerender(<Checkbox aria-label="test" checked />)
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>()
    render(<Checkbox aria-label="test" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })
})
