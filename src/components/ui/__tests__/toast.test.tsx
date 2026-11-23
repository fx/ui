import { act, render, screen } from '@testing-library/react'
import { StrictMode, useEffect, useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToastManager,
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

  it('lets pointer events pass through the viewport while keeping toast controls interactive', () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="viewport">
          <ToastRoot toast={mockToast} data-testid="toast">
            <ToastClose />
          </ToastRoot>
        </ToastViewport>
      </ToastProvider>,
    )
    expect(screen.getByTestId('viewport')).toHaveClass('pointer-events-none')
    expect(screen.getByTestId('toast')).toHaveClass('pointer-events-auto')
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

describe('auto-dismiss timers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function AddOnMount({ onClose }: { onClose: () => void }) {
    const toastManager = useToastManager()
    const addedRef = useRef(false)
    useEffect(() => {
      if (addedRef.current) return
      addedRef.current = true
      toastManager.add({ title: 'Saved', timeout: 1000, onClose })
    }, [toastManager, onClose])
    return null
  }

  function renderWithToast(ui: React.ReactNode) {
    return render(
      <ToastProvider>
        {ui}
        <ToastViewport />
      </ToastProvider>,
    )
  }

  it('closes a toast once its timeout elapses', () => {
    const onClose = vi.fn()
    renderWithToast(<AddOnMount onClose={onClose} />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clears pending timers when the provider unmounts', () => {
    const onClose = vi.fn()
    const { unmount } = renderWithToast(<AddOnMount onClose={onClose} />)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(1000)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('still closes a toast added on mount under StrictMode', () => {
    const onClose = vi.fn()
    render(
      <StrictMode>
        <ToastProvider>
          <AddOnMount onClose={onClose} />
          <ToastViewport />
        </ToastProvider>
      </StrictMode>,
    )
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
