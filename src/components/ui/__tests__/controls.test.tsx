import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useLayoutEffect } from 'react'
import { renderToString } from 'react-dom/server'
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
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'copy-button')
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

  it.each([
    'resolve',
    'reject',
  ] as const)('serializes writes after an earlier %s', async (outcome) => {
    let settle!: () => void
    const writeText = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve, reject) => {
            settle = outcome === 'resolve' ? resolve : () => reject(new Error())
          }),
      )
      .mockResolvedValueOnce(undefined)
    const fallback = vi.fn().mockReturnValue(true)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    Object.defineProperty(document, 'execCommand', { configurable: true, value: fallback })
    const { rerender } = render(<CopyButton text="old" />)
    fireEvent.click(screen.getByRole('button'))
    rerender(<CopyButton text="new" />)
    fireEvent.click(screen.getByRole('button'))
    expect(writeText).toHaveBeenCalledTimes(1)
    await act(async () => {
      settle()
    })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'))
    expect(writeText.mock.calls.map(([text]) => text)).toEqual(['old', 'new'])
    expect(fallback).not.toHaveBeenCalled()
  })

  it('orders requests across separate copy controls', async () => {
    let resolve!: () => void
    const writeText = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((done) => {
            resolve = done
          }),
      )
      .mockResolvedValueOnce(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(
      <>
        <CopyButton text="first" />
        <CopyButton text="second" />
      </>,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0] as HTMLElement)
    fireEvent.click(buttons[1] as HTMLElement)
    expect(writeText).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolve()
    })
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2))
    expect(writeText.mock.calls.map(([text]) => text)).toEqual(['first', 'second'])
  })

  it('does not fall back or start queued writes after unmount', async () => {
    let reject!: (reason: Error) => void
    const writeText = vi.fn().mockImplementationOnce(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail
        }),
    )
    const fallback = vi.fn().mockReturnValue(true)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    Object.defineProperty(document, 'execCommand', { configurable: true, value: fallback })
    const { unmount } = render(<CopyButton text="example" />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    unmount()
    await act(async () => {
      reject(new Error())
    })
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(fallback).not.toHaveBeenCalled()
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
  it.each([
    'system',
    'dark',
  ] as const)('waits for %s theme resolution before allowing a toggle', (stored) => {
    localStorage.setItem('theme', stored)
    let initialLabel: string | null = null
    let initiallyDisabled = false
    function EarlyObserver() {
      useLayoutEffect(() => {
        const button = document.querySelector<HTMLButtonElement>('[data-slot="theme-toggle"]')
        initialLabel = button?.getAttribute('aria-label') ?? null
        initiallyDisabled = button?.disabled ?? false
        button?.click()
      }, [])
      return <ThemeToggle />
    }
    render(
      <ThemeProvider>
        <EarlyObserver />
      </ThemeProvider>,
    )
    expect(initialLabel).toBe('Loading theme')
    expect(initiallyDisabled).toBe(true)
    expect(localStorage.getItem('theme')).toBe(stored)
    const button = screen.getByRole('button', { name: 'Switch to light theme' })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('renders a disabled, neutral toggle on the server', () => {
    const markup = renderToString(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    expect(markup).toContain('Loading theme')
    expect(markup).toContain('disabled')
  })

  it('honors a caller-disabled toggle after initialization', () => {
    render(
      <ThemeProvider>
        <ThemeToggle disabled />
      </ThemeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeDisabled()
  })

  it('switches from the resolved system theme and persists the choice', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'theme-toggle')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(localStorage.getItem('theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument()
  })
})
