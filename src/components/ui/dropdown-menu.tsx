import { Menu as BaseMenu } from '@base-ui-components/react/menu'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, ChevronRight, Circle } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// DropdownMenu Root
function DropdownMenu(props: React.ComponentPropsWithRef<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="dropdown-menu" {...props} />
}

// DropdownMenuTrigger
interface DropdownMenuTriggerProps extends React.ComponentPropsWithRef<typeof BaseMenu.Trigger> {
  asChild?: boolean
}

function DropdownMenuTrigger({ className, asChild, children, ...props }: DropdownMenuTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseMenu.Trigger
        data-slot="dropdown-menu-trigger"
        className={cn(className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseMenu.Trigger data-slot="dropdown-menu-trigger" className={cn(className)} {...props}>
      {children}
    </BaseMenu.Trigger>
  )
}

// DropdownMenuContent (Portal + Positioner + Popup)
function DropdownMenuContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner>
        <BaseMenu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden border bg-popover p-1 text-popover-foreground transition-all duration-200',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
            className,
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

// DropdownMenuGroup
function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.Group>) {
  return <BaseMenu.Group data-slot="dropdown-menu-group" className={cn(className)} {...props} />
}

// DropdownMenuLabel
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
      {...props}
    />
  )
}

const dropdownMenuItemVariants = cva(
  'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  },
)

// DropdownMenuItem
interface DropdownMenuItemProps
  extends React.ComponentPropsWithRef<typeof BaseMenu.Item>,
    VariantProps<typeof dropdownMenuItemVariants> {}

function DropdownMenuItem({ className, variant, inset, ...props }: DropdownMenuItemProps) {
  return (
    <BaseMenu.Item
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuItemVariants({ variant, inset }), className)}
      {...props}
    />
  )
}

// DropdownMenuCheckboxItem
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <BaseMenu.CheckboxItemIndicator>
          <Check className="size-4" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  )
}

// DropdownMenuRadioGroup
function DropdownMenuRadioGroup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.RadioGroup>) {
  return (
    <BaseMenu.RadioGroup
      data-slot="dropdown-menu-radio-group"
      className={cn(className)}
      {...props}
    />
  )
}

// DropdownMenuRadioItem
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <BaseMenu.RadioItemIndicator>
          <Circle className="size-2 fill-current" />
        </BaseMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseMenu.RadioItem>
  )
}

// DropdownMenuSeparator
function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BaseMenu.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

// DropdownMenuShortcut
function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}

// DropdownMenuSub
function DropdownMenuSub(props: React.ComponentPropsWithRef<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

// DropdownMenuSubTrigger
interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithRef<typeof BaseMenu.SubmenuTrigger> {
  inset?: boolean
  asChild?: boolean
}

function DropdownMenuSubTrigger({
  className,
  inset,
  asChild,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseMenu.SubmenuTrigger
        data-slot="dropdown-menu-sub-trigger"
        className={cn(
          'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          inset && 'pl-8',
          className,
        )}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseMenu.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </BaseMenu.SubmenuTrigger>
  )
}

// DropdownMenuSubContent
function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner>
        <BaseMenu.Popup
          data-slot="dropdown-menu-sub-content"
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden border bg-popover p-1 text-popover-foreground shadow-lg transition-all duration-200',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
            className,
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
export type { DropdownMenuItemProps, DropdownMenuTriggerProps, DropdownMenuSubTriggerProps }
