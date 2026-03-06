import * as React from 'react'
import { cn } from '@/lib/utils'

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement<Record<string, unknown>>
}

/**
 * Merges multiple refs into a single callback ref.
 */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    }
  }
}

/**
 * A utility component that merges its props onto its single child element.
 * Useful for composing components that need to forward styling and behavior
 * to a custom element. Similar to Radix UI's Slot.
 *
 * For Base UI components, prefer the `render` prop instead — it provides
 * the same polymorphism natively.
 */
function Slot({ children, ...slotProps }: SlotProps) {
  const child = React.Children.only(children)

  const {
    className: slotClassName,
    style: slotStyle,
    ref: slotRef,
    ...restSlotProps
  } = slotProps as Record<string, unknown>

  const childProps = child.props as Record<string, unknown>
  const {
    className: childClassName,
    style: childStyle,
    ref: childRef,
    ...restChildProps
  } = childProps

  // Merge event handlers: call both slot's and child's handlers
  const mergedProps: Record<string, unknown> = { ...restChildProps }
  for (const key of Object.keys(restSlotProps)) {
    const slotValue = restSlotProps[key]
    const childValue = restChildProps[key]

    if (
      typeof slotValue === 'function' &&
      typeof childValue === 'function' &&
      key.startsWith('on')
    ) {
      mergedProps[key] = (...args: unknown[]) => {
        childValue(...args)
        slotValue(...args)
      }
    } else {
      mergedProps[key] = slotValue
    }
  }

  return React.cloneElement(child, {
    ...mergedProps,
    className: cn(slotClassName as string, childClassName as string),
    style: { ...(slotStyle as object), ...(childStyle as object) },
    ref: mergeRefs(slotRef as React.Ref<unknown>, childRef as React.Ref<unknown>),
  } as Record<string, unknown>)
}

export { Slot, mergeRefs }
export type { SlotProps }
