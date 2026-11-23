import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Thread, ThreadExpander, ThreadItem, useCollapsedRange } from '../thread'

describe('Thread', () => {
  it('renders a labelled list of items', () => {
    render(
      <Thread aria-label="Comments">
        <ThreadItem>One</ThreadItem>
        <ThreadItem>Two</ThreadItem>
      </Thread>,
    )
    const list = screen.getByRole('list', { name: 'Comments' })
    expect(list.tagName).toBe('OL')
    expect(list).toHaveAttribute('data-slot', 'thread')
    expect(list.className).toContain('gap-3')
    expect(list.className).toContain('list-none')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveAttribute('data-slot', 'thread-item')
  })

  it('accepts aria-labelledby instead of aria-label', () => {
    render(
      <>
        <h2 id="thread-heading">Discussion</h2>
        <Thread aria-labelledby="thread-heading" />
      </>,
    )
    expect(screen.getByRole('list', { name: 'Discussion' })).toBeInTheDocument()
  })

  it('merges className and forwards refs', () => {
    const listRef = createRef<HTMLOListElement>()
    const itemRef = createRef<HTMLLIElement>()
    render(
      <Thread ref={listRef} aria-label="Comments" className="custom-list">
        <ThreadItem ref={itemRef} className="custom-item" />
      </Thread>,
    )
    expect(listRef.current).toBeInstanceOf(HTMLOListElement)
    expect(listRef.current?.className).toContain('custom-list')
    expect(itemRef.current).toBeInstanceOf(HTMLLIElement)
    expect(itemRef.current?.className).toContain('custom-item')
  })
})

describe('ThreadExpander', () => {
  it('labels the hidden count, singular and plural', () => {
    const { rerender } = render(<ThreadExpander count={11} onExpand={() => {}} />)
    expect(screen.getByRole('button', { name: 'Show 11 earlier comments' })).toBeInTheDocument()
    rerender(<ThreadExpander count={1} onExpand={() => {}} />)
    expect(screen.getByRole('button', { name: 'Show 1 earlier comment' })).toBeInTheDocument()
  })

  it('uses a custom label', () => {
    render(<ThreadExpander count={4} onExpand={() => {}} label={(n) => `${n} more replies`} />)
    expect(screen.getByRole('button', { name: '4 more replies' })).toBeInTheDocument()
  })

  it('calls onExpand when clicked', async () => {
    const onExpand = vi.fn()
    render(<ThreadExpander count={3} onExpand={onExpand} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onExpand).toHaveBeenCalledTimes(1)
  })

  it('is a full-width dashed non-submit button with data-slot', () => {
    render(<ThreadExpander count={3} onExpand={() => {}} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-slot', 'thread-expander')
    expect(button.className).toContain('w-full')
    expect(button.className).toContain('border-dashed')
    expect(button.className).toContain('text-muted-foreground')
  })

  it('merges className and forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<ThreadExpander ref={ref} count={3} onExpand={() => {}} className="custom-class" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.className).toContain('custom-class')
  })
})

describe('useCollapsedRange', () => {
  function range(options: Parameters<typeof useCollapsedRange>[0]) {
    return renderHook(() => useCollapsedRange(options)).result.current
  }

  it('collapses the middle of a long thread with the defaults', () => {
    const result = range({ total: 17 })
    expect(result.hiddenRange).toEqual([1, 12])
    expect(result.hiddenCount).toBe(11)
    expect(result.expanded).toBe(false)
  })

  it('collapses exactly at the minHidden boundary', () => {
    // keepFirst 1 + keepLast 5 + minHidden 3 → collapses from 9 items
    expect(range({ total: 9 }).hiddenRange).toEqual([1, 4])
    expect(range({ total: 9 }).hiddenCount).toBe(3)
  })

  it('does not collapse below the minHidden boundary', () => {
    expect(range({ total: 8 }).hiddenRange).toBeNull()
    expect(range({ total: 8 }).hiddenCount).toBe(0)
    expect(range({ total: 0 }).hiddenRange).toBeNull()
    expect(range({ total: 3 }).hiddenRange).toBeNull()
  })

  it('honours custom keepFirst, keepLast and minHidden', () => {
    expect(range({ total: 10, keepFirst: 2, keepLast: 2, minHidden: 6 }).hiddenRange).toEqual([
      2, 8,
    ])
    expect(range({ total: 9, keepFirst: 2, keepLast: 2, minHidden: 6 }).hiddenRange).toBeNull()
    expect(range({ total: 5, keepFirst: 0, keepLast: 0, minHidden: 1 }).hiddenRange).toEqual([0, 5])
  })

  it('treats negative keep counts as zero and minHidden below one as one', () => {
    expect(range({ total: 2, keepFirst: -1, keepLast: -1, minHidden: 0 }).hiddenRange).toEqual([
      0, 2,
    ])
    expect(range({ total: 0, keepFirst: 0, keepLast: 0, minHidden: 0 }).hiddenRange).toBeNull()
  })

  it('shows everything when a forced index falls in the hidden range', () => {
    expect(range({ total: 17, forceVisible: [1] }).hiddenRange).toBeNull()
    expect(range({ total: 17, forceVisible: [11] }).hiddenRange).toBeNull()
  })

  it('keeps collapsing when forced indices are outside the hidden range', () => {
    expect(range({ total: 17, forceVisible: [0, 12, 16] }).hiddenRange).toEqual([1, 12])
  })

  it('reveals everything in one call to expand', () => {
    const { result } = renderHook(() => useCollapsedRange({ total: 17 }))
    act(() => result.current.expand())
    expect(result.current.hiddenRange).toBeNull()
    expect(result.current.hiddenCount).toBe(0)
    expect(result.current.expanded).toBe(true)
  })

  it('stays expanded as the thread grows', () => {
    const { result, rerender } = renderHook(({ total }) => useCollapsedRange({ total }), {
      initialProps: { total: 17 },
    })
    act(() => result.current.expand())
    rerender({ total: 30 })
    expect(result.current.hiddenRange).toBeNull()
  })
})
