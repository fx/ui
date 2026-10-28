import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../theme-provider'
import { CommandBlock } from '../command-block'
import { CopyButton } from '../copy-button'
import { ThemeToggle } from '../theme-toggle'

describe('copy controls', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('copies multiline commands without prompts and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(<CommandBlock commands={['first', 'second', 'first']} label="Commands" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy to clipboard' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'))
    expect(writeText).toHaveBeenCalledWith('first\nsecond\nfirst')
  })

  it('falls back on rejection, restores focus, and reports failure', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error()) },
    })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    })
    render(<CopyButton text="example" />)
    const button = screen.getByRole('button')
    button.focus()
    fireEvent.click(button)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copy failed'))
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(button).toHaveFocus()
  })

  it('copies with the fallback when the clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    })
    render(<CopyButton text="two\nlines" />)
    const button = screen.getByRole('button')
    button.focus()
    fireEvent.click(button)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'))
    expect(button).toHaveFocus()
  })

  it('resets feedback and does not schedule a timer after unmount', async () => {
    vi.useFakeTimers()
    let resolve!: () => void
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockImplementationOnce(
        () =>
          new Promise<void>((done) => {
            resolve = done
          }),
      )
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const { unmount } = render(<CopyButton text="example" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
    expect(screen.getByRole('status')).toHaveTextContent('Copied')
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    fireEvent.click(screen.getByRole('button'))
    unmount()
    await act(async () => {
      resolve()
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('uses the latest attempt and clears feedback after unmount', async () => {
    let resolveFirst!: () => void
    const writeText = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockResolvedValueOnce(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const { unmount } = render(<CopyButton text="example" />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'))
    await act(async () => {
      resolveFirst()
    })
    expect(screen.getByRole('status')).toHaveTextContent('Copied')
    unmount()
  })
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    })
  })
  it('switches from the resolved system theme and persists the choice', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(localStorage.getItem('theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument()
  })
})
