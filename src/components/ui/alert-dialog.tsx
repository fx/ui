import { AlertDialog as BaseAlertDialog } from '@base-ui-components/react/alert-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'

// AlertDialog Root
function AlertDialog(props: React.ComponentPropsWithRef<typeof BaseAlertDialog.Root>) {
  return <BaseAlertDialog.Root data-slot="alert-dialog" {...props} />
}

// AlertDialogTrigger
interface AlertDialogTriggerProps
  extends React.ComponentPropsWithRef<typeof BaseAlertDialog.Trigger> {
  asChild?: boolean
}

function AlertDialogTrigger({ className, asChild, children, ...props }: AlertDialogTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseAlertDialog.Trigger
        data-slot="alert-dialog-trigger"
        className={cn(className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseAlertDialog.Trigger data-slot="alert-dialog-trigger" className={cn(className)} {...props}>
      {children}
    </BaseAlertDialog.Trigger>
  )
}

const alertDialogContentVariants = cva(
  [
    'fixed top-[50%] left-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300',
    'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
    'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
  ].join(' '),
  {
    variants: {
      size: {
        default: 'w-full max-w-lg',
        sm: 'w-full max-w-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

// AlertDialogContent
interface AlertDialogContentProps
  extends React.ComponentPropsWithRef<typeof BaseAlertDialog.Popup>,
    VariantProps<typeof alertDialogContentVariants> {
  showCloseButton?: boolean
}

function AlertDialogContent({
  className,
  size,
  children,
  showCloseButton = false,
  ...props
}: AlertDialogContentProps) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop
        data-slot="alert-dialog-overlay"
        className="fixed inset-0 z-50 bg-black/50 transition-all duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
      />
      <BaseAlertDialog.Popup
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <BaseAlertDialog.Close
            data-slot="alert-dialog-close"
            className="absolute top-4 right-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </BaseAlertDialog.Close>
        )}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  )
}

// AlertDialogHeader
function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

// AlertDialogFooter
function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
      {...props}
    />
  )
}

// AlertDialogTitle
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

// AlertDialogDescription
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      data-slot="alert-dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

// AlertDialogAction (wraps Button styles)
function AlertDialogAction({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

// AlertDialogCancel
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
}
export type { AlertDialogContentProps, AlertDialogTriggerProps }
