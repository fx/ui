import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Textarea data-testid="textarea" />)
    expect(screen.getByTestId('textarea')).toHaveAttribute('data-slot', 'textarea')
  })

  it('renders as a textarea element', () => {
    render(<Textarea data-testid="textarea" />)
    expect(screen.getByTestId('textarea').tagName).toBe('TEXTAREA')
  })

  it('supports disabled state', () => {
    render(<Textarea disabled data-testid="textarea" />)
    expect(screen.getByTestId('textarea')).toBeDisabled()
  })

  it('merges custom className', () => {
    render(<Textarea className="custom-class" data-testid="textarea" />)
    expect(screen.getByTestId('textarea').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('applies field-sizing style', () => {
    render(<Textarea data-testid="textarea" />)
    expect(screen.getByTestId('textarea').className).toContain('[field-sizing:content]')
  })
})
