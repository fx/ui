import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet'

describe('Sheet', () => {
  describe('SheetTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <Sheet>
          <SheetTrigger asChild>
            <a href="/open">Open Link</a>
          </SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/open')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Sheet>
          <SheetTrigger asChild>
            <a href="/open">Open Link</a>
          </SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link).toHaveAttribute('data-slot', 'sheet-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <Sheet>
          <SheetTrigger asChild className="custom-trigger">
            <a href="/open">Open Link</a>
          </SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Sheet>
          <SheetTrigger asChild ref={ref}>
            <a href="/open">Open Link</a>
          </SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders trigger button', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'data-slot',
      'sheet-trigger',
    )
  })

  it('opens on trigger click with composition', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader data-testid="header">
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetHeader>
          <SheetFooter data-testid="footer">
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'sheet-header')
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'sheet-footer')
  })

  it('renders content with data-slot', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent data-testid="content">Content</SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'sheet-content')
  })

  it('applies right side by default', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent data-testid="content">Content</SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByTestId('content')
    expect(content.className).toContain('right-0')
  })

  it('applies left side', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByTestId('content')
    expect(content.className).toContain('left-0')
  })

  it('applies top side', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="top" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByTestId('content')
    expect(content.className).toContain('top-0')
  })

  it('applies bottom side', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="bottom" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByTestId('content')
    expect(content.className).toContain('bottom-0')
  })

  it('shows close button', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('merges custom className on content', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent className="custom-class" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('content').className).toContain('custom-class')
  })
})
