import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Combobox Root
function Combobox<Value, Multiple extends boolean | undefined = false>({
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Root<Value, Multiple>>) {
  return <BaseCombobox.Root data-slot="combobox" {...props} />
}

// ComboboxAnchor — container for Input + Trigger, owns the border & focus ring
function ComboboxAnchor({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      data-slot="combobox-anchor"
      className={cn(
        'relative border border-input transition-colors',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'has-[[data-popup-open]]:border-b-transparent has-[[data-popup-open]]:ring-0',
        'has-[[data-popup-open]]:border-ring',
        className,
      )}
      {...props}
    />
  )
}

// ComboboxInput
interface ComboboxInputProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Input> {}

function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      className={cn(
        'placeholder:text-muted-foreground flex h-9 w-full min-w-0 bg-transparent px-3 py-1 pr-8 text-base outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

// ComboboxTrigger — dropdown arrow button
interface ComboboxTriggerProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Trigger> {
  asChild?: boolean
}

function ComboboxTrigger({ className, asChild, children, ...props }: ComboboxTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseCombobox.Trigger
        data-slot="combobox-trigger"
        className={cn(
          'absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer',
          className,
        )}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseCombobox.Trigger
      data-slot="combobox-trigger"
      className={cn('absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer', className)}
      {...props}
    >
      {children ?? (
        <BaseCombobox.Icon>
          <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
        </BaseCombobox.Icon>
      )}
    </BaseCombobox.Trigger>
  )
}

// ComboboxContent — Portal + Positioner + Popup
function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Popup>) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={-1}>
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={cn(
            'relative z-50 max-h-[min(var(--available-height),24rem)] -ml-px w-[calc(var(--anchor-width)+2px)] overflow-y-auto overflow-x-hidden border border-t-0 border-ring bg-popover p-1 text-popover-foreground shadow-md',
            className,
          )}
          {...props}
        >
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

// ComboboxList — render function container for items
function ComboboxList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.List>) {
  return <BaseCombobox.List data-slot="combobox-list" className={cn(className)} {...props} />
}

// ComboboxEmpty
function ComboboxEmpty({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty
      data-slot="combobox-empty"
      className={cn('empty:hidden py-6 text-center text-sm text-muted-foreground', className)}
      {...props}
    >
      {children ?? 'No results found.'}
    </BaseCombobox.Empty>
  )
}

// ComboboxItem
interface ComboboxItemProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Item> {}

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseCombobox.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <Check className="size-4" />
      </BaseCombobox.ItemIndicator>
      {children}
    </BaseCombobox.Item>
  )
}

// ComboboxGroup
function ComboboxGroup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Group>) {
  return (
    <BaseCombobox.Group data-slot="combobox-group" className={cn('py-1', className)} {...props} />
  )
}

// ComboboxLabel
function ComboboxLabel({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.GroupLabel>) {
  return (
    <BaseCombobox.GroupLabel
      data-slot="combobox-label"
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}

// ComboboxSeparator
function ComboboxSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="combobox-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
}
export type { ComboboxInputProps, ComboboxItemProps, ComboboxTriggerProps }
