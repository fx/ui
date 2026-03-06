import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Sheet Root
function Sheet(props: React.ComponentPropsWithRef<typeof BaseDialog.Root>) {
  return <BaseDialog.Root data-slot="sheet" {...props} />
}

// SheetTrigger
interface SheetTriggerProps extends React.ComponentPropsWithRef<typeof BaseDialog.Trigger> {
  asChild?: boolean
}

function SheetTrigger({ className, asChild, children, ...props }: SheetTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseDialog.Trigger
        data-slot="sheet-trigger"
        className={cn(className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseDialog.Trigger data-slot="sheet-trigger" className={cn(className)} {...props}>
      {children}
    </BaseDialog.Trigger>
  )
}

// SheetClose
function SheetClose({ className, ...props }: React.ComponentPropsWithRef<typeof BaseDialog.Close>) {
  return <BaseDialog.Close data-slot="sheet-close" className={cn(className)} {...props} />
}

const sheetContentVariants = cva(
  'fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition-transform ease-in-out duration-500 data-[ending-style]:duration-300',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full',
        bottom:
          'inset-x-0 bottom-0 border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

// SheetContent
interface SheetContentProps
  extends React.ComponentPropsWithRef<typeof BaseDialog.Popup>,
    VariantProps<typeof sheetContentVariants> {}

function SheetContent({ side = 'right', className, children, ...props }: SheetContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
      />
      <BaseDialog.Popup
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        <BaseDialog.Close
          data-slot="sheet-close"
          className="absolute top-4 right-4 rounded-none opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </BaseDialog.Close>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

// SheetHeader
function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

// SheetFooter
function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
      {...props}
    />
  )
}

// SheetTitle
function SheetTitle({ className, ...props }: React.ComponentPropsWithRef<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot="sheet-title"
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
}

// SheetDescription
function SheetDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
export type { SheetContentProps, SheetTriggerProps }
