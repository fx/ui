import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Separator } from '../separator'

describe('Separator', () => {
  it('renders a separator element', () => {
    render(<Separator data-testid="separator" />)
    expect(screen.getByTestId('separator')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Separator data-testid="separator" />)
    expect(screen.getByTestId('separator')).toHaveAttribute('data-slot', 'separator')
  })

  it('applies horizontal classes by default', () => {
    render(<Separator data-testid="separator" />)
    const el = screen.getByTestId('separator')
    expect(el.className).toContain('h-px')
    expect(el.className).toContain('w-full')
  })

  it('applies vertical classes', () => {
    render(<Separator orientation="vertical" data-testid="separator" />)
    const el = screen.getByTestId('separator')
    expect(el.className).toContain('h-full')
    expect(el.className).toContain('w-px')
  })

  it('has separator role', () => {
    render(<Separator data-testid="separator" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('forwards orientation to Base UI primitive', () => {
    render(<Separator orientation="vertical" data-testid="separator" />)
    expect(screen.getByTestId('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('merges custom className', () => {
    render(<Separator className="my-4" data-testid="separator" />)
    expect(screen.getByTestId('separator').className).toContain('my-4')
  })
})
