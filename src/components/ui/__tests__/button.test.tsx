import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  describe('asChild', () => {
    it('renders child element instead of button when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/home">Go Home</a>
        </Button>,
      )
      const link = screen.getByRole('link', { name: 'Go Home' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/home')
    })

    it('applies variant classes to child element', () => {
      render(
        <Button asChild variant="destructive">
          <a href="/delete">Delete</a>
        </Button>,
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('bg-destructive')
    })

    it('applies size classes to child element', () => {
      render(
        <Button asChild size="sm">
          <a href="/small">Small</a>
        </Button>,
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('h-9')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Button asChild ref={ref}>
          <a href="/ref">Ref test</a>
        </Button>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Button asChild>
          <a href="/slot">Slot test</a>
        </Button>,
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('data-slot', 'button')
    })

    it('merges custom className with asChild', () => {
      render(
        <Button asChild className="custom-class">
          <a href="/custom">Custom</a>
        </Button>,
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('custom-class')
    })
  })

  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button')
  })

  it('applies default variant classes', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-primary')
  })

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-destructive')
  })

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('border')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-secondary')
  })

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('hover:bg-accent')
  })

  it('applies link variant', () => {
    render(<Button variant="link">Link</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('underline-offset-4')
  })

  it('applies size variants', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-9')
  })

  it('applies icon size', () => {
    render(<Button size="icon">I</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('size-9')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('supports disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
