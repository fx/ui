import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('data-slot', 'input')
  })

  it('renders with type attribute', () => {
    render(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
  })

  it('supports disabled state', () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it('merges custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    expect(screen.getByTestId('input').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('supports aria-invalid', () => {
    render(<Input aria-invalid="true" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
  })
})
