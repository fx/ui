import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90',
        success:
          'text-emerald-600 bg-card border-emerald-600/20 [&>svg]:text-emerald-600 *:data-[slot=alert-description]:text-emerald-600/90',
        warning:
          'text-amber-600 bg-card border-amber-600/20 [&>svg]:text-amber-600 *:data-[slot=alert-description]:text-amber-600/90',
        info: 'text-blue-600 bg-card border-blue-600/20 [&>svg]:text-blue-600 *:data-[slot=alert-description]:text-blue-600/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  ref?: React.Ref<HTMLDivElement>
}

function Alert({ className, variant, ref, ...props }: AlertProps) {
  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function AlertTitle({ className, ref, ...props }: AlertTitleProps) {
  return (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  )
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function AlertDescription({ className, ref, ...props }: AlertDescriptionProps) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn('text-muted-foreground col-start-2 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
export type { AlertProps, AlertTitleProps, AlertDescriptionProps }
