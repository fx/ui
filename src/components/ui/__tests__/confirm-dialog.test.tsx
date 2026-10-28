import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from '../confirm-dialog'

describe('ConfirmDialog', () => {
  it('exposes title, description, error, custom content, class and ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Proceed?"
        description="Check first"
        error="Failed"
        onConfirm={() => {}}
        ref={ref}
        className="custom"
      >
        <p>Details</p>
      </ConfirmDialog>,
    )
    const dialog = screen.getByRole('alertdialog', {
      name: 'Proceed?',
      description: 'Check first Failed',
    })
    expect(dialog).toBe(ref.current)
    expect(dialog).toHaveClass('custom')
    expect(dialog).toHaveAttribute('data-slot', 'confirm-dialog')
    expect(screen.getByRole('alert')).toHaveTextContent('Failed')
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('keeps confirmation caller-controlled and blocks actions and escape while pending', () => {
    const confirm = vi.fn()
    const change = vi.fn()
    const { rerender } = render(
      <ConfirmDialog
        open
        onOpenChange={change}
        title="Proceed?"
        onConfirm={confirm}
        confirmLabel="Apply"
        pending
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(confirm).not.toHaveBeenCalled()
    expect(change).not.toHaveBeenCalled()
    rerender(
      <ConfirmDialog
        open
        onOpenChange={change}
        title="Proceed?"
        onConfirm={confirm}
        confirmLabel="Apply"
        error="Retry"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(confirm).toHaveBeenCalledOnce()
    expect(change).not.toHaveBeenCalled()
    rerender(
      <ConfirmDialog open={false} onOpenChange={change} title="Proceed?" onConfirm={confirm} />,
    )
    rerender(<ConfirmDialog open onOpenChange={change} title="Proceed?" onConfirm={confirm} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(change).toHaveBeenCalledWith(false)
  })
})
