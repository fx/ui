import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Toggle } from '../toggle'

describe('Toggle', () => {
  it('renders as a button', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'toggle')
  })

  it('has aria-pressed attribute', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles state on click (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<Toggle>Bold</Toggle>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('data-state', 'off')
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-state', 'on')
  })

  it('supports controlled pressed state', () => {
    render(<Toggle pressed>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'on')
  })

  it('calls onPressedChange when toggled', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>)
    await user.click(screen.getByRole('button'))
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('applies default variant classes', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button').className).toContain('bg-transparent')
  })

  it('applies outline variant', () => {
    render(<Toggle variant="outline">Bold</Toggle>)
    expect(screen.getByRole('button').className).toContain('border')
  })

  it('applies size variants', () => {
    render(<Toggle size="sm">Bold</Toggle>)
    expect(screen.getByRole('button').className).toContain('h-8')
  })

  it('applies lg size', () => {
    render(<Toggle size="lg">Bold</Toggle>)
    expect(screen.getByRole('button').className).toContain('h-10')
  })

  it('supports disabled state', () => {
    render(<Toggle disabled>Bold</Toggle>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('merges custom className', () => {
    render(<Toggle className="custom-class">Bold</Toggle>)
    expect(screen.getByRole('button').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Toggle ref={ref}>Bold</Toggle>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  describe('Radix compat: data-state attribute', () => {
    it('has data-state="off" when not pressed', () => {
      render(<Toggle>Bold</Toggle>)
      expect(screen.getByRole('button')).toHaveAttribute('data-state', 'off')
    })

    it('has data-state="on" when pressed', () => {
      render(<Toggle pressed>Bold</Toggle>)
      expect(screen.getByRole('button')).toHaveAttribute('data-state', 'on')
    })

    it('toggles data-state between on/off on click', async () => {
      const user = userEvent.setup()
      render(<Toggle>Bold</Toggle>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')
      await user.click(button)
      expect(button).toHaveAttribute('data-state', 'on')
      await user.click(button)
      expect(button).toHaveAttribute('data-state', 'off')
    })
  })

  describe('Radix compat: pressed/defaultPressed/onPressedChange', () => {
    it('accepts pressed prop for controlled mode', () => {
      render(<Toggle pressed>Bold</Toggle>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    })

    it('accepts defaultPressed prop for uncontrolled mode', async () => {
      const user = userEvent.setup()
      render(<Toggle defaultPressed>Bold</Toggle>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(button).toHaveAttribute('data-state', 'on')
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveAttribute('data-state', 'off')
    })

    it('calls onPressedChange with false when unpressing', async () => {
      const user = userEvent.setup()
      const onPressedChange = vi.fn()
      render(
        <Toggle defaultPressed onPressedChange={onPressedChange}>
          Bold
        </Toggle>,
      )
      await user.click(screen.getByRole('button'))
      expect(onPressedChange).toHaveBeenCalledWith(false)
    })

    it('does not toggle in controlled mode without handler', async () => {
      const user = userEvent.setup()
      render(<Toggle pressed={false}>Bold</Toggle>)
      const button = screen.getByRole('button')
      await user.click(button)
      expect(button).toHaveAttribute('aria-pressed', 'false')
    })
  })
})
