import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from '../skeleton'

describe('Skeleton', () => {
  it('renders a div element', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton')
  })

  it('has animate-pulse class', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton').className).toContain('animate-pulse')
  })

  it('has bg-primary/10 class', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton').className).toContain('bg-primary/10')
  })

  it('merges custom className', () => {
    render(<Skeleton className="h-4 w-32" data-testid="skeleton" />)
    const el = screen.getByTestId('skeleton')
    expect(el.className).toContain('h-4')
    expect(el.className).toContain('w-32')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
