import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StreamerModeProvider, useStreamerMode } from '../../streamer-mode-provider'
import { Redacted } from '../redacted'

function TestConsumer() {
  const { enabled, toggle } = useStreamerMode()
  return (
    <div>
      <span data-testid="status">{enabled ? 'on' : 'off'}</span>
      <button type="button" onClick={toggle}>
        toggle
      </button>
    </div>
  )
}

describe('StreamerModeProvider', () => {
  it('provides default state (enabled=false)', () => {
    render(
      <StreamerModeProvider>
        <TestConsumer />
      </StreamerModeProvider>,
    )
    expect(screen.getByTestId('status')).toHaveTextContent('off')
  })

  it('toggle changes enabled state', async () => {
    const user = userEvent.setup()
    render(
      <StreamerModeProvider>
        <TestConsumer />
      </StreamerModeProvider>,
    )
    expect(screen.getByTestId('status')).toHaveTextContent('off')
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('status')).toHaveTextContent('on')
  })

  it('useStreamerMode throws when used outside provider', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      'useStreamerMode must be used within a StreamerModeProvider',
    )
    spy.mockRestore()
  })
})

describe('Redacted', () => {
  it('renders children when disabled', () => {
    render(
      <StreamerModeProvider>
        <Redacted label="name">Visible Text</Redacted>
      </StreamerModeProvider>,
    )
    expect(screen.getByText('Visible Text')).toBeInTheDocument()
  })

  it('hides children when enabled (shows colored block)', async () => {
    const user = userEvent.setup()

    function TestRedacted() {
      const { toggle } = useStreamerMode()
      return (
        <>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <Redacted label="name">Secret Content</Redacted>
        </>
      )
    }

    render(
      <StreamerModeProvider>
        <TestRedacted />
      </StreamerModeProvider>,
    )

    expect(screen.getByText('Secret Content')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument()
  })

  it('redacted block has aria-hidden and inline-block display', async () => {
    const user = userEvent.setup()

    function TestRedacted() {
      const { toggle } = useStreamerMode()
      return (
        <>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <Redacted label="name">Hidden</Redacted>
        </>
      )
    }

    render(
      <StreamerModeProvider>
        <TestRedacted />
      </StreamerModeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'toggle' }))
    const redacted = document.querySelector('[data-slot="redacted"]')
    expect(redacted).toHaveAttribute('aria-hidden', 'true')
    expect(redacted).toHaveStyle({ display: 'inline-block' })
  })

  it('uses neutral color (var(--muted)) when no label provided', async () => {
    const user = userEvent.setup()

    function TestRedacted() {
      const { toggle } = useStreamerMode()
      return (
        <>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <Redacted>No Label</Redacted>
        </>
      )
    }

    render(
      <StreamerModeProvider>
        <TestRedacted />
      </StreamerModeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'toggle' }))
    const redacted = document.querySelector('[data-slot="redacted"]') as HTMLElement
    expect(redacted.style.backgroundColor).toBe('var(--color-muted)')
  })

  it('uses deterministic color when label provided', async () => {
    const user = userEvent.setup()

    function TestRedacted() {
      const { toggle } = useStreamerMode()
      return (
        <>
          <button type="button" onClick={toggle}>
            toggle
          </button>
          <Redacted label="email">test@example.com</Redacted>
        </>
      )
    }

    render(
      <StreamerModeProvider>
        <TestRedacted />
      </StreamerModeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'toggle' }))
    const redacted = document.querySelector('[data-slot="redacted"]') as HTMLElement
    // Should use one of the chart colors, not var(--muted)
    expect(redacted.style.backgroundColor).toMatch(/var\(--color-chart-\d\)/)
  })
})
