import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// Dialog Root
function Dialog(props: React.ComponentPropsWithRef<typeof BaseDialog.Root>) {
  return <BaseDialog.Root data-slot="dialog" {...props} />
}

// DialogTrigger
interface DialogTriggerProps extends React.ComponentPropsWithRef<typeof BaseDialog.Trigger> {
  asChild?: boolean
}

function DialogTrigger({ className, asChild, children, ...props }: DialogTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseDialog.Trigger
        data-slot="dialog-trigger"
        className={cn(className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseDialog.Trigger data-slot="dialog-trigger" className={cn(className)} {...props}>
      {children}
    </BaseDialog.Trigger>
  )
}

// DialogClose
function DialogClose({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseDialog.Close>) {
  return <BaseDialog.Close data-slot="dialog-close" className={cn(className)} {...props} />
}

// DialogContent (Portal + Backdrop + Popup)
interface DialogContentProps extends React.ComponentPropsWithRef<typeof BaseDialog.Popup> {
  showCloseButton?: boolean
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-black/50 transition-all duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
      />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300',
          'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
          'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <BaseDialog.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

// DialogHeader
function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

// DialogFooter
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean
}

function DialogFooter({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <BaseDialog.Close
          data-slot="dialog-close"
          className="absolute top-4 right-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </BaseDialog.Close>
      )}
    </div>
  )
}

// DialogTitle
function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

// DialogDescription
function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
export type { DialogContentProps, DialogFooterProps, DialogTriggerProps }
