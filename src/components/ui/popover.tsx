import { Popover as BasePopover } from '@base-ui-components/react/popover'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Popover Root
function Popover(props: React.ComponentPropsWithRef<typeof BasePopover.Root>) {
  return <BasePopover.Root data-slot="popover" {...props} />
}

// PopoverTrigger
interface PopoverTriggerProps extends React.ComponentPropsWithRef<typeof BasePopover.Trigger> {
  asChild?: boolean
}

function PopoverTrigger({ className, asChild, children, ...props }: PopoverTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BasePopover.Trigger
        data-slot="popover-trigger"
        className={cn(className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BasePopover.Trigger data-slot="popover-trigger" className={cn(className)} {...props}>
      {children}
    </BasePopover.Trigger>
  )
}

// PopoverAnchor (plain div - Base UI Popover does not expose an Anchor primitive)
function PopoverAnchor({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="popover-anchor" className={cn(className)} {...props} />
}

// PopoverContent (Portal + Positioner + Popup + Arrow)
function PopoverContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BasePopover.Popup>) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner>
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            'z-50 w-72 border bg-popover p-4 text-popover-foreground shadow-md outline-none transition-all duration-200',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
            className,
          )}
          {...props}
        >
          {children}
          <BasePopover.Arrow
            data-slot="popover-arrow"
            className="[&>path]:fill-popover [&>path]:stroke-border"
          />
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

// PopoverHeader
function PopoverHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="popover-header" className={cn('flex flex-col gap-1.5', className)} {...props} />
  )
}

// PopoverTitle
function PopoverTitle({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BasePopover.Title>) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      className={cn('text-sm font-semibold leading-none', className)}
      {...props}
    />
  )
}

// PopoverDescription
function PopoverDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BasePopover.Description>) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
export type { PopoverTriggerProps }
