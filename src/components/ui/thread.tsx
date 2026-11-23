import * as React from 'react'
import { cn } from '@/lib/utils'

type ThreadProps = Omit<React.OlHTMLAttributes<HTMLOListElement>, 'aria-label'> & {
  ref?: React.Ref<HTMLOListElement>
} & (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-label'?: string; 'aria-labelledby': string }
  )

/** An ordered list of comments. Children are `ThreadItem`s. Requires an accessible name. */
function Thread({ className, ref, ...props }: ThreadProps) {
  return (
    <ol
      ref={ref}
      data-slot="thread"
      className={cn('m-0 grid list-none gap-3 p-0', className)}
      {...props}
    />
  )
}

interface ThreadItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  ref?: React.Ref<HTMLLIElement>
}

function ThreadItem({ className, ref, ...props }: ThreadItemProps) {
  return <li ref={ref} data-slot="thread-item" className={cn('min-w-0', className)} {...props} />
}

interface ThreadExpanderProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  /** Number of hidden items. */
  count: number
  onExpand: () => void
  label?: (count: number) => React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

function defaultExpanderLabel(count: number) {
  return `Show ${count} earlier ${count === 1 ? 'comment' : 'comments'}`
}

/** Full-width button standing in for collapsed items; render it inside a `ThreadItem`. */
function ThreadExpander({
  count,
  onExpand,
  label = defaultExpanderLabel,
  className,
  type = 'button',
  ref,
  ...props
}: ThreadExpanderProps) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="thread-expander"
      className={cn(
        'w-full cursor-pointer border border-dashed px-3 py-2 text-xs text-muted-foreground outline-none transition-colors ring-ring/50 hover:bg-muted/50 hover:text-foreground focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none',
        className,
      )}
      onClick={onExpand}
      {...props}
    >
      {label(count)}
    </button>
  )
}

interface UseCollapsedRangeOptions {
  /** Number of items in the thread. */
  total: number
  /** Items always shown at the start. */
  keepFirst?: number
  /** Items always shown at the end. */
  keepLast?: number
  /** Collapse only when at least this many items would be hidden. */
  minHidden?: number
  /** Item indices that must stay visible, e.g. a linked comment; any in the range cancels it. */
  forceVisible?: readonly number[]
}

interface CollapsedRange {
  /** `[start, end)` indices to replace with a `ThreadExpander`, or `null` to show everything. */
  hiddenRange: readonly [start: number, end: number] | null
  hiddenCount: number
  /** Whether `expand()` has been called. */
  expanded: boolean
  expand: () => void
}

/**
 * Works out which middle stretch of a long thread to collapse behind a single expander.
 */
function useCollapsedRange({
  total,
  keepFirst = 1,
  keepLast = 5,
  minHidden = 3,
  forceVisible,
}: UseCollapsedRangeOptions): CollapsedRange {
  const [expanded, setExpanded] = React.useState(false)
  const expand = React.useCallback(() => setExpanded(true), [])

  const start = Math.max(0, keepFirst)
  const end = Math.max(start, total - Math.max(0, keepLast))
  const count = end - start
  const collapsed =
    !expanded &&
    count >= Math.max(1, minHidden) &&
    !forceVisible?.some((index) => index >= start && index < end)

  return collapsed
    ? { hiddenRange: [start, end], hiddenCount: count, expanded, expand }
    : { hiddenRange: null, hiddenCount: 0, expanded, expand }
}

export { Thread, ThreadExpander, ThreadItem, useCollapsedRange }
export type {
  CollapsedRange,
  ThreadExpanderProps,
  ThreadItemProps,
  ThreadProps,
  UseCollapsedRangeOptions,
}
