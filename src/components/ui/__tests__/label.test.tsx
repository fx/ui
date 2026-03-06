import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Label } from '../label'

describe('Label', () => {
  it('renders with children', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Label>Test</Label>)
    expect(screen.getByText('Test')).toHaveAttribute('data-slot', 'label')
  })

  it('renders as a label element', () => {
    render(<Label>Test</Label>)
    expect(screen.getByText('Test').tagName).toBe('LABEL')
  })

  it('supports htmlFor attribute', () => {
    render(<Label htmlFor="email-input">Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input')
  })

  it('merges custom className', () => {
    render(<Label className="custom-class">Test</Label>)
    expect(screen.getByText('Test').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Test</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('has peer-disabled support classes', () => {
    render(<Label>Test</Label>)
    expect(screen.getByText('Test').className).toContain('peer-disabled:opacity-50')
  })
})
