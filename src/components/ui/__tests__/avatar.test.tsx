import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Avatar, avatarVariants } from '../avatar'

describe('Avatar', () => {
  it('renders as a labelled image', () => {
    render(<Avatar label="Ada Lovelace" />)
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(avatar).toHaveAttribute('data-slot', 'avatar')
    expect(avatar).not.toHaveAttribute('aria-hidden')
  })

  it('derives up to two uppercase initials from the label', () => {
    const { rerender } = render(<Avatar label="ada lovelace" />)
    expect(screen.getByRole('img')).toHaveTextContent(/^AL$/)
    rerender(<Avatar label="Grace Brewster Murray Hopper" />)
    expect(screen.getByRole('img')).toHaveTextContent(/^GH$/)
    rerender(<Avatar label="  build  " />)
    expect(screen.getByRole('img')).toHaveTextContent(/^BU$/)
  })

  it('uses explicit initials, capped at two characters', () => {
    render(<Avatar label="Build Bot" initials="bot" />)
    expect(screen.getByRole('img')).toHaveTextContent(/^BO$/)
  })

  it('renders an icon instead of initials', () => {
    render(<Avatar label="Build Bot" icon={<svg data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByRole('img')).not.toHaveTextContent('BB')
  })

  it('is hidden from assistive technology when decorative', () => {
    render(<Avatar label="Ada Lovelace" decorative data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('aria-hidden', 'true')
    expect(avatar).not.toHaveAttribute('role')
    expect(avatar).not.toHaveAttribute('aria-label')
  })

  it('defaults to the neutral tone and md size', () => {
    render(<Avatar label="Ada Lovelace" />)
    const avatar = screen.getByRole('img')
    expect(avatar.className).toContain('bg-muted')
    expect(avatar.className).toContain('size-7')
  })

  it('applies the inverse tone', () => {
    render(<Avatar label="Ada Lovelace" tone="inverse" />)
    const avatar = screen.getByRole('img')
    expect(avatar.className).toContain('bg-foreground')
    expect(avatar.className).toContain('text-background')
  })

  it.each([1, 2, 3, 4, 5, 6, 7, 8] as const)('applies identity tone %i', (tone) => {
    render(<Avatar label="Ada Lovelace" tone={tone} size="sm" />)
    const avatar = screen.getByRole('img')
    expect(avatar.className).toContain(`bg-identity-${tone}`)
    expect(avatar.className).toContain(`text-identity-${tone}-foreground`)
    expect(avatar.className).toContain('size-5')
  })

  it('merges custom className', () => {
    render(<Avatar label="Ada Lovelace" className="custom-class" />)
    expect(screen.getByRole('img').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar label="Ada Lovelace" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('exposes its variants', () => {
    expect(avatarVariants({ tone: 4 })).toContain('bg-identity-4')
  })
})
