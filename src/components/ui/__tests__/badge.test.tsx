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

  it('applies working variant', () => {
    render(<Badge variant="working">Working</Badge>)
    expect(screen.getByText('Working').className).toContain('bg-status-working')
  })

  it('applies idle variant', () => {
    render(<Badge variant="idle">Idle</Badge>)
    expect(screen.getByText('Idle').className).toContain('bg-status-idle')
  })

  it('applies complete variant', () => {
    render(<Badge variant="complete">Complete</Badge>)
    expect(screen.getByText('Complete').className).toContain('bg-status-complete')
  })

  it('applies failure variant', () => {
    render(<Badge variant="failure">Failure</Badge>)
    expect(screen.getByText('Failure').className).toContain('bg-status-failure')
  })

  it('applies stale variant', () => {
    render(<Badge variant="stale">Stale</Badge>)
    expect(screen.getByText('Stale').className).toContain('bg-status-stale')
  })

  it('applies github variant', () => {
    render(<Badge variant="github">GitHub</Badge>)
    expect(screen.getByText('GitHub').className).toContain('text-link-github')
  })

  it('applies app variant', () => {
    render(<Badge variant="app">App</Badge>)
    expect(screen.getByText('App').className).toContain('text-link-app')
  })

  it('merges custom className', () => {
    render(<Badge className="custom-class">Test</Badge>)
    expect(screen.getByText('Test').className).toContain('custom-class')
  })
})
