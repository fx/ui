import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ClampedContent } from '../clamped-content'

const LIMIT = 320
let naturalHeight = 0
const observers: ResizeObserverMock[] = []

class ResizeObserverMock {
  constructor(private callback: ResizeObserverCallback) {
    observers.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  trigger() {
    this.callback([], this as unknown as ResizeObserver)
  }
}

function rect(height: number): DOMRect {
  return {
    width: 400,
    height,
    x: 0,
    y: 0,
    top: 0,
    right: 400,
    bottom: height,
    left: 0,
    toJSON() {},
  }
}

beforeEach(() => {
  naturalHeight = 0
  observers.length = 0
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.parentElement?.dataset.slot === 'clamped-content-viewport') return rect(naturalHeight)
    if (this.getAttribute('aria-hidden') && this.style.height) return rect(LIMIT)
    return rect(0)
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function renderClamped(height: number, props: Partial<Parameters<typeof ClampedContent>[0]> = {}) {
  naturalHeight = height
  return render(
    <ClampedContent data-testid="clamped" {...props}>
      <p>Lorem ipsum</p>
      <a href="#inside">Inside link</a>
    </ClampedContent>,
  )
}

describe('ClampedContent', () => {
  it('has data-slot attribute and renders children', () => {
    renderClamped(100)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-slot', 'clamped-content')
    expect(screen.getByText('Lorem ipsum')).toBeInTheDocument()
  })

  it('shows short content in full without a toggle', () => {
    renderClamped(100)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'fits')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('does not clamp content within the threshold', () => {
    renderClamped(LIMIT * 1.5)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'fits')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('clamps content beyond the threshold', () => {
    renderClamped(LIMIT * 1.5 + 1)
    const root = screen.getByTestId('clamped')
    expect(root).toHaveAttribute('data-state', 'clamped')
    const viewport = root.querySelector<HTMLElement>('[data-slot=clamped-content-viewport]')
    expect(viewport?.style.maxHeight).toBe('20rem')
    expect(viewport?.className).toContain('overflow-hidden')
    expect(viewport?.className).toContain('motion-reduce:transition-none')
    const fade = root.querySelector<HTMLElement>('[data-slot=clamped-content-fade]')
    expect(fade).toHaveAttribute('aria-hidden', 'true')
    expect(fade?.style.backgroundImage).toContain('var(--card)')
  })

  it('honours a custom threshold, max height and fade colour', () => {
    renderClamped(LIMIT + 10, { threshold: 1, maxHeight: '12rem', fadeFrom: 'red' })
    const root = screen.getByTestId('clamped')
    expect(root).toHaveAttribute('data-state', 'clamped')
    expect(
      root.querySelector<HTMLElement>('[data-slot=clamped-content-viewport]')?.style.maxHeight,
    ).toBe('12rem')
    expect(
      root.querySelector<HTMLElement>('[data-slot=clamped-content-fade]')?.style.backgroundImage,
    ).toContain('red')
  })

  it('wires the toggle to the content with aria attributes', async () => {
    renderClamped(1000)
    const toggle = screen.getByRole('button', { name: 'Show more' })
    const viewport = screen
      .getByTestId('clamped')
      .querySelector('[data-slot=clamped-content-viewport]')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', viewport?.id)

    await userEvent.click(toggle)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'expanded')
    const less = screen.getByRole('button', { name: 'Show less' })
    expect(less).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByTestId('clamped').querySelector<HTMLElement>('[data-slot=clamped-content-fade]'),
    ).toBeNull()

    await userEvent.click(less)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'clamped')
  })

  it('uses custom labels', () => {
    renderClamped(1000, { moreLabel: 'Read on', lessLabel: 'Fold' })
    expect(screen.getByRole('button', { name: 'Read on' })).toBeInTheDocument()
  })

  it('expands when focus moves into the clipped region', () => {
    const onExpandedChange = vi.fn()
    renderClamped(1000, { onExpandedChange })
    act(() => screen.getByRole('link', { name: 'Inside link' }).focus())
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'expanded')
    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })

  it('does not expand when the toggle itself is focused', () => {
    renderClamped(1000)
    act(() => screen.getByRole('button', { name: 'Show more' }).focus())
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'clamped')
  })

  it('supports controlled expansion', () => {
    const onExpandedChange = vi.fn()
    const { rerender } = renderClamped(1000, { expanded: false, onExpandedChange })
    fireEvent.click(screen.getByRole('button', { name: 'Show more' }))
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'clamped')
    rerender(
      <ClampedContent data-testid="clamped" expanded onExpandedChange={onExpandedChange}>
        <p>Lorem ipsum</p>
      </ClampedContent>,
    )
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'expanded')
  })

  it('starts expanded with defaultExpanded', () => {
    renderClamped(1000, { defaultExpanded: true })
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'expanded')
    expect(
      screen
        .getByTestId('clamped')
        .querySelector<HTMLElement>('[data-slot=clamped-content-viewport]')?.style.maxHeight,
    ).toBe('1000px')
  })

  it('re-measures when the content resizes', () => {
    renderClamped(100)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'fits')
    naturalHeight = 1000
    act(() => {
      for (const observer of observers) observer.trigger()
    })
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'clamped')
  })

  it('treats content as fitting when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    renderClamped(1000)
    expect(screen.getByTestId('clamped')).toHaveAttribute('data-state', 'fits')
  })

  it('merges custom className', () => {
    renderClamped(100, { className: 'custom-class' })
    expect(screen.getByTestId('clamped').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    renderClamped(100, { ref })
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
