import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@/lib/slot'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        ghost: 'border-transparent text-foreground',
        working:
          'border-transparent bg-status-working text-status-working-foreground [a&]:hover:bg-status-working/90',
        idle: 'border-transparent bg-status-idle text-status-idle-foreground [a&]:hover:bg-status-idle/90',
        complete:
          'border-transparent bg-status-complete text-status-complete-foreground [a&]:hover:bg-status-complete/90',
        failure:
          'border-transparent bg-status-failure text-status-failure-foreground [a&]:hover:bg-status-failure/90',
        stale:
          'border-transparent bg-status-stale text-status-stale-foreground [a&]:hover:bg-status-stale/90',
        github:
          'border-transparent bg-secondary text-link-github [a&]:hover:bg-muted-foreground/30',
        app: 'border-transparent bg-secondary text-link-app [a&]:hover:bg-muted-foreground/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
export type { BadgeProps }
