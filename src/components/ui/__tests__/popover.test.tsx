import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../popover'

describe('Popover', () => {
  describe('PopoverTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <a href="/open">Open Link</a>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/open')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <a href="/open">Open Link</a>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link).toHaveAttribute('data-slot', 'popover-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <Popover>
          <PopoverTrigger asChild className="custom-trigger">
            <a href="/open">Open Link</a>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Popover>
          <PopoverTrigger asChild ref={ref}>
            <a href="/open">Open Link</a>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders trigger button', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'data-slot',
      'popover-trigger',
    )
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader data-testid="header">
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Description</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders header with data-slot', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader data-testid="header">
            <PopoverTitle>Title</PopoverTitle>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'popover-header')
  })

  it('renders anchor with data-slot', () => {
    render(
      <Popover>
        <PopoverAnchor data-testid="anchor">Anchor</PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    )
    expect(screen.getByTestId('anchor')).toHaveAttribute('data-slot', 'popover-anchor')
  })

  it('merges custom className on trigger', () => {
    render(
      <Popover>
        <PopoverTrigger className="custom-class">Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    )
    expect(screen.getByRole('button', { name: 'Open' }).className).toContain('custom-class')
  })
})
