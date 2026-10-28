import * as React from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog'
import { Button } from './button'

interface ConfirmDialogProps
  extends Omit<React.ComponentPropsWithRef<typeof AlertDialogContent>, 'title' | 'children'> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm: () => void
  pending?: boolean
  error?: React.ReactNode
  variant?: 'default' | 'destructive'
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  pending = false,
  error,
  variant = 'default',
  showCloseButton = false,
  ...props
}: ConfirmDialogProps) {
  const descriptionId = React.useId()
  const errorId = React.useId()
  const describedBy =
    [description != null && descriptionId, error != null && errorId, props['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next)
      }}
    >
      <AlertDialogContent
        {...props}
        showCloseButton={showCloseButton && !pending}
        data-slot="confirm-dialog"
        aria-describedby={describedBy}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description != null && (
            <AlertDialogDescription id={descriptionId}>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        {error != null && (
          <div id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <Button
            type="button"
            variant={variant}
            disabled={pending}
            onClick={() => {
              if (!pending) onConfirm()
            }}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
