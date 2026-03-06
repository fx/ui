import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../alert-dialog'

describe('AlertDialog', () => {
  describe('AlertDialogTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <a href="/delete">Delete Link</a>
          </AlertDialogTrigger>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>,
      )
      const link = screen.getByRole('link', { name: 'Delete Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/delete')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <a href="/delete">Delete Link</a>
          </AlertDialogTrigger>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>,
      )
      const link = screen.getByRole('link', { name: 'Delete Link' })
      expect(link).toHaveAttribute('data-slot', 'alert-dialog-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger asChild className="custom-trigger">
            <a href="/delete">Delete Link</a>
          </AlertDialogTrigger>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>,
      )
      const link = screen.getByRole('link', { name: 'Delete Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <AlertDialog>
          <AlertDialogTrigger asChild ref={ref}>
            <a href="/delete">Delete Link</a>
          </AlertDialogTrigger>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders trigger button', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>Content</AlertDialogContent>
      </AlertDialog>,
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>Content</AlertDialogContent>
      </AlertDialog>,
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute(
      'data-slot',
      'alert-dialog-trigger',
    )
  })

  it('opens on trigger click with full composition', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader data-testid="header">
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter data-testid="footer">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'alert-dialog-header')
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'alert-dialog-footer')
  })

  it('renders content with data-slot', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'alert-dialog-content')
  })

  it('applies default size (max-w-lg)', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByTestId('content').className).toContain('max-w-lg')
  })

  it('applies sm size (max-w-sm)', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent size="sm" data-testid="content">
          <AlertDialogTitle>Title</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByTestId('content').className).toContain('max-w-sm')
  })

  it('action has data-slot and button styles', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogAction data-testid="action">Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    const action = screen.getByTestId('action')
    expect(action).toHaveAttribute('data-slot', 'alert-dialog-action')
    expect(action.className).toContain('bg-primary')
  })

  it('cancel has outline variant and data-slot', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogCancel data-testid="cancel">Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    const cancel = screen.getByTestId('cancel')
    expect(cancel).toHaveAttribute('data-slot', 'alert-dialog-cancel')
    expect(cancel.className).toContain('border')
  })

  it('does not render close button by default', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('renders close button when showCloseButton=true', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent showCloseButton>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
