import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { mergeRefs, Slot } from '../slot'

describe('Slot', () => {
  it('renders the child element', () => {
    render(
      <Slot>
        <button type="button">Click me</button>
      </Slot>,
    )
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('merges className from slot and child', () => {
    render(
      <Slot className="slot-class">
        <div className="child-class" data-testid="target">
          content
        </div>
      </Slot>,
    )
    const el = screen.getByTestId('target')
    expect(el.className).toContain('slot-class')
    expect(el.className).toContain('child-class')
  })

  it('merges styles from slot and child', () => {
    render(
      <Slot style={{ color: 'red' }}>
        <div style={{ fontSize: '16px' }} data-testid="target">
          content
        </div>
      </Slot>,
    )
    const el = screen.getByTestId('target')
    expect(el.style.color).toBe('red')
    expect(el.style.fontSize).toBe('16px')
  })

  it('child styles override slot styles for same property', () => {
    render(
      <Slot style={{ color: 'red' }}>
        <div style={{ color: 'blue' }} data-testid="target">
          content
        </div>
      </Slot>,
    )
    const el = screen.getByTestId('target')
    expect(el.style.color).toBe('blue')
  })

  it('merges event handlers — calls both slot and child handlers', async () => {
    const slotHandler = vi.fn()
    const childHandler = vi.fn()
    const user = userEvent.setup()

    render(
      <Slot onClick={slotHandler}>
        <button type="button" onClick={childHandler}>
          Click
        </button>
      </Slot>,
    )
    await user.click(screen.getByRole('button'))
    expect(slotHandler).toHaveBeenCalledOnce()
    expect(childHandler).toHaveBeenCalledOnce()
  })

  it('merges refs from slot and child', () => {
    const slotRef = createRef<HTMLButtonElement>()
    const childRef = createRef<HTMLButtonElement>()

    render(
      <Slot ref={slotRef}>
        <button type="button" ref={childRef}>
          Ref test
        </button>
      </Slot>,
    )
    expect(slotRef.current).toBeInstanceOf(HTMLButtonElement)
    expect(childRef.current).toBeInstanceOf(HTMLButtonElement)
    expect(slotRef.current).toBe(childRef.current)
  })

  it('spreads additional props onto the child', () => {
    render(
      <Slot data-testid="target" aria-label="slot-label">
        <div>content</div>
      </Slot>,
    )
    const el = screen.getByTestId('target')
    expect(el).toHaveAttribute('aria-label', 'slot-label')
  })

  it('slot props override child props for non-handler, non-class, non-style props', () => {
    render(
      <Slot data-testid="target" aria-label="slot-label">
        <button type="button" aria-label="child-label" data-testid="target">
          content
        </button>
      </Slot>,
    )
    const el = screen.getByTestId('target')
    expect(el).toHaveAttribute('aria-label', 'slot-label')
  })

  it('throws when given multiple children', () => {
    expect(() =>
      render(
        <Slot>
          <div>one</div>
          <div>two</div>
        </Slot>,
      ),
    ).toThrow()
  })
})

describe('mergeRefs', () => {
  it('handles callback refs', () => {
    let captured: HTMLElement | null = null
    const callbackRef = (node: HTMLElement | null) => {
      captured = node
    }
    const objectRef = createRef<HTMLElement>()
    const merged = mergeRefs(callbackRef, objectRef)

    const div = document.createElement('div')
    merged(div)

    expect(captured).toBe(div)
    expect(objectRef.current).toBe(div)
  })

  it('handles undefined refs gracefully', () => {
    const objectRef = createRef<HTMLElement>()
    const merged = mergeRefs(undefined, objectRef, undefined)

    const div = document.createElement('div')
    merged(div)

    expect(objectRef.current).toBe(div)
  })

  it('handles null cleanup', () => {
    const objectRef = createRef<HTMLElement>()
    const merged = mergeRefs(objectRef)

    merged(null)
    expect(objectRef.current).toBeNull()
  })
})
