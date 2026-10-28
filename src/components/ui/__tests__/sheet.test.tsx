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
  it('supports scrollable flush bottom content and hides the close button', () => {
    render(
      <Sheet open>
        <SheetContent side="bottom" flush showCloseButton={false} data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass(
      'overflow-y-auto',
      'max-h-[85dvh]',
      'p-0',
      'pb-[env(safe-area-inset-bottom)]',
    )
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('allows custom padding to override flush defaults', () => {
    render(
      <Sheet open>
        <SheetContent side="bottom" flush className="pb-4" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass('p-0', 'pb-4')
    expect(screen.getByTestId('content')).not.toHaveClass('pb-[env(safe-area-inset-bottom)]')
  })
  it('constrains top content and allows a sizing override', () => {
    const { rerender } = render(
      <Sheet open>
        <SheetContent side="top" data-testid="content">
          Tall content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass('overflow-y-auto', 'max-h-dvh')
    rerender(
      <Sheet open>
        <SheetContent side="top" className="max-h-[50dvh]" data-testid="content">
          Tall content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass('max-h-[50dvh]')
    expect(screen.getByTestId('content')).not.toHaveClass('max-h-dvh')
  })

  it.each(['left', 'right'] as const)('keeps %s content constrained to the viewport', (side) => {
    render(
      <Sheet open>
        <SheetContent side={side} data-testid="content">
          Tall content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass('overflow-y-auto', 'h-full', 'inset-y-0')
  })
  it('allows bottom and side height overrides', () => {
    const { rerender } = render(
      <Sheet open>
        <SheetContent side="bottom" className="max-h-[50dvh]" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass('max-h-[50dvh]')
    expect(screen.getByTestId('content')).not.toHaveClass('max-h-[85dvh]')
    rerender(
      <Sheet open>
        <SheetContent side="left" className="h-[50dvh]" data-testid="content">
          Content
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('content')).toHaveClass('h-[50dvh]')
    expect(screen.getByTestId('content')).not.toHaveClass('h-full')
  })
})
