import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface ClampedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS length the content is clipped to while collapsed. */
  maxHeight?: string
  /**
   * Clamp only when the natural height exceeds `maxHeight × threshold`, so a toggle never
   * hides just a few lines.
   */
  threshold?: number
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  moreLabel?: React.ReactNode
  lessLabel?: React.ReactNode
  /** CSS colour the bottom fade blends into; match the surface behind the content. */
  fadeFrom?: string
  ref?: React.Ref<HTMLDivElement>
}

type ClampedState = 'fits' | 'clamped' | 'expanded'

/**
 * Clips tall content to a maximum height with a fade and a Show more / Show less toggle.
 * Content that only slightly exceeds the limit is shown in full.
 */
function ClampedContent({
  maxHeight = '20rem',
  threshold = 1.5,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  moreLabel = 'Show more',
  lessLabel = 'Show less',
  fadeFrom = 'var(--card)',
  className,
  children,
  ref,
  ...props
}: ClampedContentProps) {
  const contentId = React.useId()
  const limitRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded)
  const [naturalHeight, setNaturalHeight] = React.useState<number | null>(null)
  const [overflows, setOverflows] = React.useState(false)

  const isControlled = expandedProp !== undefined
  const expanded = isControlled ? expandedProp : uncontrolledExpanded
  const state: ClampedState = !overflows ? 'fits' : expanded ? 'expanded' : 'clamped'

  React.useEffect(() => {
    const inner = innerRef.current
    const limit = limitRef.current
    if (!inner || !limit || typeof ResizeObserver === 'undefined') return
    function measure() {
      if (!inner || !limit) return
      const natural = inner.getBoundingClientRect().height
      const max = limit.getBoundingClientRect().height
      setNaturalHeight(natural)
      setOverflows(max > 0 && natural > max * threshold)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    observer.observe(limit)
    return () => observer.disconnect()
  }, [threshold])

  function setExpanded(next: boolean) {
    if (!isControlled) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  // Keyboard users tabbing into clipped content get it revealed rather than hidden behind the fade.
  const setExpandedRef = React.useRef(setExpanded)
  setExpandedRef.current = setExpanded
  React.useEffect(() => {
    const viewport = viewportRef.current
    if (state !== 'clamped' || !viewport) return
    const expandOnFocus = () => setExpandedRef.current(true)
    viewport.addEventListener('focusin', expandOnFocus)
    return () => viewport.removeEventListener('focusin', expandOnFocus)
  }, [state])

  const viewportMaxHeight =
    state === 'clamped'
      ? maxHeight
      : state === 'expanded' && naturalHeight !== null
        ? `${naturalHeight}px`
        : undefined

  return (
    <div
      ref={ref}
      data-slot="clamped-content"
      data-state={state}
      className={cn('relative', className)}
      {...props}
    >
      <div
        ref={limitRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 w-0"
        style={{ height: maxHeight }}
      />
      <div
        ref={viewportRef}
        id={contentId}
        data-slot="clamped-content-viewport"
        className={cn(
          'relative',
          state !== 'fits' &&
            'overflow-hidden transition-[max-height] duration-200 ease-out motion-reduce:transition-none',
        )}
        style={viewportMaxHeight === undefined ? undefined : { maxHeight: viewportMaxHeight }}
      >
        <div ref={innerRef}>{children}</div>
        {state === 'clamped' && (
          <div
            aria-hidden
            data-slot="clamped-content-fade"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${fadeFrom})` }}
          />
        )}
      </div>
      {state !== 'fits' && (
        <div className="mt-1 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={contentId}
            data-slot="clamped-content-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? lessLabel : moreLabel}
            <ChevronDown
              aria-hidden
              className={cn(
                'transition-transform motion-reduce:transition-none',
                expanded && 'rotate-180',
              )}
            />
          </Button>
        </div>
      )}
    </div>
  )
}

export { ClampedContent }
export type { ClampedContentProps }
