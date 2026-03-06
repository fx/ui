import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders with children', () => {
    render(<Badge>Status</Badge>)
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Badge>Test</Badge>)
    expect(screen.getByText('Test')).toHaveAttribute('data-slot', 'badge')
  })

  it('renders as a span element', () => {
    render(<Badge>Test</Badge>)
    expect(screen.getByText('Test').tagName).toBe('SPAN')
  })

  it('applies default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('bg-primary')
  })

  it('applies secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary').className).toContain('bg-secondary')
  })

  it('applies destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>)
    expect(screen.getByText('Error').className).toContain('bg-destructive')
  })

  it('applies outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline').className).toContain('text-foreground')
  })

  it('applies ghost variant', () => {
    render(<Badge variant="ghost">Ghost</Badge>)
    expect(screen.getByText('Ghost').className).toContain('border-transparent')
  })

  it('merges custom className', () => {
    render(<Badge className="custom-class">Test</Badge>)
    expect(screen.getByText('Test').className).toContain('custom-class')
  })
})
