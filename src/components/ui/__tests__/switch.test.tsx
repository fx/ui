import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from '../switch'

describe('Switch', () => {
  it('renders as a switch', () => {
    render(<Switch aria-label="test" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Switch aria-label="test" />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-slot', 'switch')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch aria-label="test" onCheckedChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('applies default size classes', () => {
    render(<Switch aria-label="test" />)
    const el = screen.getByRole('switch')
    expect(el.className).toContain('h-[1.25rem]')
    expect(el.className).toContain('w-9')
  })

  it('applies sm size classes', () => {
    render(<Switch aria-label="test" size="sm" />)
    const el = screen.getByRole('switch')
    expect(el.className).toContain('h-4')
    expect(el.className).toContain('w-7')
  })

  it('supports disabled state', () => {
    render(<Switch aria-label="test" disabled />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true')
  })

  it('merges custom className', () => {
    render(<Switch aria-label="test" className="custom-class" />)
    expect(screen.getByRole('switch').className).toContain('custom-class')
  })

  describe('Radix compat: data-state attribute', () => {
    it('has data-state="unchecked" by default', () => {
      render(<Switch aria-label="test" />)
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked')
    })

    it('has data-state="checked" when controlled checked', () => {
      render(<Switch aria-label="test" checked />)
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
    })

    it('has data-state="unchecked" when controlled unchecked', () => {
      render(<Switch aria-label="test" checked={false} />)
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked')
    })

    it('updates data-state on click (uncontrolled)', async () => {
      const user = userEvent.setup()
      render(<Switch aria-label="test" />)
      const switchEl = screen.getByRole('switch')
      expect(switchEl).toHaveAttribute('data-state', 'unchecked')
      await user.click(switchEl)
      expect(switchEl).toHaveAttribute('data-state', 'checked')
      await user.click(switchEl)
      expect(switchEl).toHaveAttribute('data-state', 'unchecked')
    })

    it('also has Base UI data-checked attribute when checked', () => {
      render(<Switch aria-label="test" checked />)
      const switchEl = screen.getByRole('switch')
      expect(switchEl).toHaveAttribute('data-state', 'checked')
      expect(switchEl).toHaveAttribute('data-checked', '')
    })

    it('also has Base UI data-unchecked attribute when unchecked', () => {
      render(<Switch aria-label="test" checked={false} />)
      const switchEl = screen.getByRole('switch')
      expect(switchEl).toHaveAttribute('data-state', 'unchecked')
      expect(switchEl).toHaveAttribute('data-unchecked', '')
    })
  })

  describe('Radix compat: onCheckedChange', () => {
    it('calls onCheckedChange with boolean value', async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()
      render(<Switch aria-label="test" onCheckedChange={onCheckedChange} />)
      await user.click(screen.getByRole('switch'))
      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    })

    it('calls onCheckedChange with false when toggling off', async () => {
      const user = userEvent.setup()
      const onCheckedChange = vi.fn()
      render(<Switch aria-label="test" defaultChecked onCheckedChange={onCheckedChange} />)
      await user.click(screen.getByRole('switch'))
      expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything())
    })
  })

  describe('Radix compat: controlled and uncontrolled modes', () => {
    it('works in uncontrolled mode with defaultChecked', async () => {
      const user = userEvent.setup()
      render(<Switch aria-label="test" defaultChecked />)
      const switchEl = screen.getByRole('switch')
      expect(switchEl).toHaveAttribute('data-checked', '')
      expect(switchEl).toHaveAttribute('data-state', 'checked')
      await user.click(switchEl)
      expect(switchEl).toHaveAttribute('data-unchecked', '')
      expect(switchEl).toHaveAttribute('data-state', 'unchecked')
    })

    it('works in controlled mode', () => {
      const { rerender } = render(<Switch aria-label="test" checked={false} />)
      const switchEl = screen.getByRole('switch')
      expect(switchEl).toHaveAttribute('data-state', 'unchecked')
      rerender(<Switch aria-label="test" checked />)
      expect(switchEl).toHaveAttribute('data-state', 'checked')
    })
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>()
    render(<Switch aria-label="test" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })
})
