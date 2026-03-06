import { Toast as BaseToast } from '@base-ui-components/react/toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Re-export useToastManager from Base UI
const useToastManager = BaseToast.useToastManager

// ToastProvider
function ToastProvider({
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseToast.Provider>) {
  return (
    <BaseToast.Provider data-slot="toast-provider" {...props}>
      {children}
    </BaseToast.Provider>
  )
}

// ToastViewport
function ToastViewport({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseToast.Viewport>) {
  return (
    <BaseToast.Viewport
      data-slot="toast-viewport"
      className={cn(
        'fixed z-[100] flex max-h-screen flex-col-reverse p-4',
        'top-0 right-0 left-0 sm:top-auto sm:right-0 sm:bottom-0 sm:left-auto sm:flex-col',
        'sm:max-w-[420px]',
        className,
      )}
      {...props}
    />
  )
}

// ToastRoot
interface ToastRootProps extends React.ComponentPropsWithRef<typeof BaseToast.Root> {}

function ToastRoot({ className, toast, ...props }: ToastRootProps) {
  return (
    <BaseToast.Root
      data-slot="toast"
      toast={toast}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden border p-4 shadow-lg',
        'bg-background text-foreground',
        'transition-all duration-300',
        'data-[swipe=move]:translate-x-[var(--toast-swipe-move-x)] data-[swipe=move]:translate-y-[var(--toast-swipe-move-y)]',
        'data-[starting-style]:sm:translate-x-full data-[starting-style]:max-sm:-translate-y-full',
        'data-[ending-style]:sm:translate-x-full data-[ending-style]:opacity-0',
        'data-[ending-style]:max-sm:-translate-y-full data-[ending-style]:max-sm:opacity-0',
        className,
      )}
      {...props}
    />
  )
}

// ToastTitle
function ToastTitle({ className, ...props }: React.ComponentPropsWithRef<typeof BaseToast.Title>) {
  return (
    <BaseToast.Title
      data-slot="toast-title"
      className={cn('text-sm font-semibold', className)}
      {...props}
    />
  )
}

// ToastDescription
function ToastDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseToast.Description>) {
  return (
    <BaseToast.Description
      data-slot="toast-description"
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  )
}

// ToastClose
function ToastClose({ className, ...props }: React.ComponentPropsWithRef<typeof BaseToast.Close>) {
  return (
    <BaseToast.Close
      data-slot="toast-close"
      className={cn(
        'absolute top-2 right-2 p-1 text-foreground/50 opacity-0 transition-opacity',
        'hover:text-foreground focus:opacity-100 focus:ring-2 focus:outline-none group-hover:opacity-100',
        className,
      )}
      {...props}
    >
      <X className="size-4" />
      <span className="sr-only">Close</span>
    </BaseToast.Close>
  )
}

export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  useToastManager,
}
export type { ToastRootProps }
