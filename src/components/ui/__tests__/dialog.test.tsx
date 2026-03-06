import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'

describe('Dialog', () => {
  describe('DialogTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <a href="/open">Open Link</a>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/open')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <a href="/open">Open Link</a>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link).toHaveAttribute('data-slot', 'dialog-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <Dialog>
          <DialogTrigger asChild className="custom-trigger">
            <a href="/open">Open Link</a>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>,
      )
      const link = screen.getByRole('link', { name: 'Open Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Dialog>
          <DialogTrigger asChild ref={ref}>
            <a href="/open">Open Link</a>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders trigger button', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'data-slot',
      'dialog-trigger',
    )
  })

  it('opens dialog on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders header, footer, title and description with data-slot', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <DialogFooter data-testid="footer">
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'dialog-header')
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'dialog-footer')
  })

  it('shows close button by default', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('hides close button when showCloseButton=false', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>Content</DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('renders content with data-slot', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent data-testid="content">Content</DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'dialog-content')
  })

  it('merges custom className on content', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-class" data-testid="content">
          Content
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('content').className).toContain('custom-class')
  })

  it('DialogFooter does not render close button by default', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogFooter data-testid="footer">
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveAttribute('data-slot', 'dialog-footer')
    // Only the explicit DialogClose child, no auto close button
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('DialogFooter renders close button when showCloseButton=true', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogFooter showCloseButton data-testid="footer">
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
