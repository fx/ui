import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusOverlay } from '../status-overlay'

describe('StatusOverlay', () => {
  it('renders with children', () => {
    render(<StatusOverlay>✓</StatusOverlay>)
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('has data-slot="status-overlay"', () => {
    render(<StatusOverlay data-testid="overlay">content</StatusOverlay>)
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-slot', 'status-overlay')
  })

  it('applies default position (bottom-right)', () => {
    render(<StatusOverlay data-testid="overlay">content</StatusOverlay>)
    const el = screen.getByTestId('overlay')
    expect(el.className).toContain('-bottom-1')
    expect(el.className).toContain('-right-1')
  })

  it('applies bottom-left position', () => {
    render(
      <StatusOverlay data-testid="overlay" position="bottom-left">
        content
      </StatusOverlay>,
    )
    const el = screen.getByTestId('overlay')
    expect(el.className).toContain('-bottom-1')
    expect(el.className).toContain('-left-1')
  })

  it('applies top-right position', () => {
    render(
      <StatusOverlay data-testid="overlay" position="top-right">
        content
      </StatusOverlay>,
    )
    const el = screen.getByTestId('overlay')
    expect(el.className).toContain('-top-1')
    expect(el.className).toContain('-right-1')
  })

  it('applies top-left position', () => {
    render(
      <StatusOverlay data-testid="overlay" position="top-left">
        content
      </StatusOverlay>,
    )
    const el = screen.getByTestId('overlay')
    expect(el.className).toContain('-top-1')
    expect(el.className).toContain('-left-1')
  })

  it('shows spinning ring when animated=true', () => {
    render(
      <StatusOverlay data-testid="overlay" animated>
        content
      </StatusOverlay>,
    )
    const overlay = screen.getByTestId('overlay')
    const ring = overlay.querySelector('.animate-spin')
    expect(ring).toBeInTheDocument()
  })

  it('hides spinning ring when animated=false (default)', () => {
    render(<StatusOverlay data-testid="overlay">content</StatusOverlay>)
    const overlay = screen.getByTestId('overlay')
    const ring = overlay.querySelector('.animate-spin')
    expect(ring).not.toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(
      <StatusOverlay data-testid="overlay" className="custom-class">
        content
      </StatusOverlay>,
    )
    expect(screen.getByTestId('overlay').className).toContain('custom-class')
  })
})
