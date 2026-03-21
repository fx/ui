import { Menu as BaseMenu } from '@base-ui-components/react/menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Menubar container (horizontal bar)
function Menubar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="menubar"
      className={cn('flex h-9 items-center gap-1 border bg-background p-1 shadow-sm', className)}
      {...props}
    />
  )
}

// MenubarMenu (wraps each Base UI Menu.Root)
function MenubarMenu(props: React.ComponentPropsWithRef<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="menubar-menu" {...props} />
}

// MenubarTrigger
interface MenubarTriggerProps extends React.ComponentPropsWithRef<typeof BaseMenu.Trigger> {
  asChild?: boolean
}

function MenubarTrigger({ className, asChild, children, ...props }: MenubarTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseMenu.Trigger
        data-slot="menubar-trigger"
        className={cn(
          'flex cursor-default items-center rounded-sm px-3 py-1 text-sm font-medium outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground',
          className,
        )}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseMenu.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-default items-center rounded-sm px-3 py-1 text-sm font-medium outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </BaseMenu.Trigger>
  )
}

// MenubarContent (Portal + Positioner + Popup)
function MenubarContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal className="fixed inset-0 z-[60] pointer-events-none [&>*]:pointer-events-auto">
      <BaseMenu.Positioner>
        <BaseMenu.Popup
          data-slot="menubar-content"
          className={cn(
            'z-[60] min-w-[12rem] overflow-hidden border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200',
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

// MenubarItem
function MenubarItem({
  className,
  inset,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.Item> & {
  inset?: boolean
}) {
  return (
    <BaseMenu.Item
      data-slot="menubar-item"
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  )
}

// MenubarCheckboxItem
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="menubar-checkbox-item"
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

// MenubarRadioGroup
function MenubarRadioGroup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.RadioGroup>) {
  return (
    <BaseMenu.RadioGroup data-slot="menubar-radio-group" className={cn(className)} {...props} />
  )
}

// MenubarRadioItem
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem
      data-slot="menubar-radio-item"
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

// MenubarLabel
function MenubarLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean
}) {
  return (
    <div
      data-slot="menubar-label"
      className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
      {...props}
    />
  )
}

// MenubarSeparator
function MenubarSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BaseMenu.Separator
      data-slot="menubar-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

// MenubarShortcut
function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}

// MenubarSub
function MenubarSub(props: React.ComponentPropsWithRef<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot data-slot="menubar-sub" {...props} />
}

// MenubarSubTrigger
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.SubmenuTrigger> & {
  inset?: boolean
}) {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="menubar-sub-trigger"
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

// MenubarSubContent
function MenubarSubContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal className="fixed inset-0 z-[60] pointer-events-none [&>*]:pointer-events-auto">
      <BaseMenu.Positioner>
        <BaseMenu.Popup
          data-slot="menubar-sub-content"
          className={cn(
            'z-[60] min-w-[8rem] overflow-hidden border bg-popover p-1 text-popover-foreground shadow-lg transition-all duration-200',
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
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
export type { MenubarTriggerProps }
