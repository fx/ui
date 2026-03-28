import { Select as BaseSelect } from '@base-ui-components/react/select'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&>span]:line-clamp-1 cursor-pointer aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      size: {
        default: 'h-9 py-2 text-sm',
        sm: 'h-9 py-1 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

// Select Root
function Select({ ...props }: React.ComponentPropsWithRef<typeof BaseSelect.Root>) {
  return <BaseSelect.Root data-slot="select" {...props} />
}

// SelectTrigger
interface SelectTriggerProps
  extends React.ComponentPropsWithRef<typeof BaseSelect.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  asChild?: boolean
}

function SelectTrigger({ className, size, asChild, children, ...props }: SelectTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseSelect.Trigger
        data-slot="select-trigger"
        className={cn(selectTriggerVariants({ size }), className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <BaseSelect.Icon data-slot="select-icon" className="ml-2 shrink-0">
        <ChevronDown className="size-4 opacity-50" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

// SelectValue
function SelectValue({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseSelect.Value>) {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      className={cn('text-muted-foreground data-[has-value]:text-foreground', className)}
      {...props}
    />
  )
}

// SelectContent (Portal + Positioner + Popup)
interface SelectContentProps extends React.ComponentPropsWithRef<typeof BaseSelect.Popup> {
  /**
   * The positioning mode for the select content.
   * - 'popper': Uses Floating UI positioning (default)
   * - 'item-aligned': Aligns the selected item with the trigger
   * @default 'popper'
   */
  position?: 'item-aligned' | 'popper'
  /**
   * Which side of the trigger to position against.
   * @default 'bottom'
   */
  side?: 'top' | 'bottom'
  /**
   * How to align the popup relative to the trigger.
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end'
}

function SelectContent({
  className,
  children,
  position = 'popper',
  side = 'bottom',
  align = 'center',
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal className="fixed inset-0 z-[60] pointer-events-none [&>*]:pointer-events-auto">
      <BaseSelect.Positioner
        side={side}
        align={align}
        alignItemWithTrigger={position === 'item-aligned'}
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            'relative z-[60] max-h-[min(var(--available-height),24rem)] w-[var(--anchor-width)] overflow-y-auto overflow-x-hidden border bg-popover p-1 text-popover-foreground shadow-md',
            className,
          )}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

// SelectItem
interface SelectItemProps extends React.ComponentPropsWithRef<typeof BaseSelect.Item> {}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <Check className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
}

// SelectGroup
function SelectGroup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseSelect.Group>) {
  return <BaseSelect.Group data-slot="select-group" className={cn('py-1', className)} {...props} />
}

// SelectLabel
function SelectLabel({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-label"
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}

// SelectSeparator
function SelectSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

// SelectScrollUpButton
function SelectScrollUpButton({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseSelect.ScrollUpArrow>) {
  return (
    <BaseSelect.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn('flex items-center justify-center py-1', className)}
      {...props}
    >
      {children ?? <ChevronUp className="size-4" />}
    </BaseSelect.ScrollUpArrow>
  )
}

// SelectScrollDownButton
function SelectScrollDownButton({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseSelect.ScrollDownArrow>) {
  return (
    <BaseSelect.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn('flex items-center justify-center py-1', className)}
      {...props}
    >
      {children ?? <ChevronDown className="size-4" />}
    </BaseSelect.ScrollDownArrow>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
export type { SelectTriggerProps, SelectContentProps, SelectItemProps }
