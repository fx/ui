import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { AspectRatio } from '../aspect-ratio'

describe('AspectRatio', () => {
  it('renders with children', () => {
    render(
      <AspectRatio data-testid="aspect">
        <img src="/test.jpg" alt="Test" />
      </AspectRatio>,
    )
    expect(screen.getByTestId('aspect')).toBeInTheDocument()
    expect(screen.getByAltText('Test')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<AspectRatio data-testid="aspect" />)
    expect(screen.getByTestId('aspect')).toHaveAttribute('data-slot', 'aspect-ratio')
  })

  it('applies default aspect ratio of 1', () => {
    render(<AspectRatio data-testid="aspect" />)
    expect(screen.getByTestId('aspect')).toHaveStyle({ aspectRatio: '1' })
  })

  it('applies custom aspect ratio', () => {
    render(<AspectRatio ratio={16 / 9} data-testid="aspect" />)
    expect(screen.getByTestId('aspect')).toHaveStyle({
      aspectRatio: String(16 / 9),
    })
  })

  it('has relative positioning', () => {
    render(<AspectRatio data-testid="aspect" />)
    expect(screen.getByTestId('aspect').className).toContain('relative')
  })

  it('merges custom className', () => {
    render(<AspectRatio className="overflow-hidden rounded-lg" data-testid="aspect" />)
    const el = screen.getByTestId('aspect')
    expect(el.className).toContain('overflow-hidden')
    expect(el.className).toContain('rounded-lg')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<AspectRatio ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom style with aspect ratio', () => {
    render(<AspectRatio ratio={4 / 3} style={{ maxWidth: '500px' }} data-testid="aspect" />)
    const el = screen.getByTestId('aspect')
    expect(el).toHaveStyle({ aspectRatio: String(4 / 3), maxWidth: '500px' })
  })
})
