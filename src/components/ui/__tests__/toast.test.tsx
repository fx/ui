import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from '../toast'

// Mock toast object matching Base UI's expected shape
const mockToast = {
  id: 'test-toast-1',
  title: 'Test title',
  description: 'Test description',
}

function renderToast(ui?: React.ReactNode) {
  return render(
    <ToastProvider>
      {ui}
      <ToastViewport data-testid="viewport" />
    </ToastProvider>,
  )
}

describe('Toast', () => {
  it('renders ToastProvider without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <div>children</div>
      </ToastProvider>,
    )
    expect(container).toBeTruthy()
  })

  it('renders ToastViewport with data-slot', () => {
    renderToast()
    expect(screen.getByTestId('viewport')).toHaveAttribute('data-slot', 'toast-viewport')
  })

  it('applies custom className to ToastViewport', () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="viewport" className="custom-viewport" />
      </ToastProvider>,
    )
    expect(screen.getByTestId('viewport').className).toContain('custom-viewport')
  })

  it('renders ToastTitle with data-slot', () => {
    render(
      <ToastProvider>
        <ToastViewport>
          <ToastRoot toast={mockToast}>
            <ToastTitle data-testid="title">Title</ToastTitle>
          </ToastRoot>
        </ToastViewport>
      </ToastProvider>,
    )
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'toast-title')
  })

  it('renders ToastDescription with data-slot', () => {
    render(
      <ToastProvider>
        <ToastViewport>
          <ToastRoot toast={mockToast}>
            <ToastDescription data-testid="desc">Desc</ToastDescription>
          </ToastRoot>
        </ToastViewport>
      </ToastProvider>,
    )
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'toast-description')
  })

  it('renders ToastClose with data-slot', () => {
    render(
      <ToastProvider>
        <ToastViewport>
          <ToastRoot toast={mockToast}>
            <ToastClose data-testid="close" />
          </ToastRoot>
        </ToastViewport>
      </ToastProvider>,
    )
    expect(screen.getByTestId('close')).toHaveAttribute('data-slot', 'toast-close')
  })

  it('renders close button with X icon', () => {
    render(
      <ToastProvider>
        <ToastViewport>
          <ToastRoot toast={mockToast}>
            <ToastClose data-testid="close" />
          </ToastRoot>
        </ToastViewport>
      </ToastProvider>,
    )
    const closeBtn = screen.getByTestId('close')
    expect(closeBtn.querySelector('svg')).toBeTruthy()
  })

  it('merges custom className on ToastTitle', () => {
    render(
      <ToastProvider>
        <ToastViewport>
          <ToastRoot toast={mockToast}>
            <ToastTitle data-testid="title" className="custom-title">
              Title
            </ToastTitle>
          </ToastRoot>
        </ToastViewport>
      </ToastProvider>,
    )
    expect(screen.getByTestId('title').className).toContain('custom-title')
  })

  it('exports useToastManager hook', async () => {
    const mod = await import('../toast')
    expect(mod.useToastManager).toBeDefined()
    expect(typeof mod.useToastManager).toBe('function')
  })
})
