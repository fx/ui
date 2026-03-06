import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from '../progress'

describe('Progress', () => {
  it('renders as a progressbar', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-slot', 'progress')
  })

  it('sets aria-valuenow to the value', () => {
    render(<Progress value={75} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('defaults value to 0', () => {
    render(<Progress />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('merges custom className', () => {
    render(<Progress value={50} className="custom-class" />)
    expect(screen.getByRole('progressbar').className).toContain('custom-class')
  })
})
