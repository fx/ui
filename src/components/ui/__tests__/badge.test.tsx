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

  describe('asChild', () => {
    it('renders child element instead of span when asChild is true', () => {
      render(
        <Badge asChild>
          <a href="/link">Link Badge</a>
        </Badge>,
      )
      const link = screen.getByRole('link', { name: 'Link Badge' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/link')
    })

    it('applies variant classes to child element', () => {
      render(
        <Badge asChild variant="destructive">
          <a href="/delete">Delete</a>
        </Badge>,
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('bg-destructive')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Badge asChild>
          <a href="/slot">Slot test</a>
        </Badge>,
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('data-slot', 'badge')
    })
  })

  describe('icon-only auto-sizing', () => {
    it('includes aspect-square class for icon-only badges', () => {
      render(
        <Badge data-testid="icon-badge">
          <svg data-testid="icon" />
        </Badge>,
      )
      const badge = screen.getByTestId('icon-badge')
      expect(badge.className).toContain('aspect-square')
    })
  })
})
