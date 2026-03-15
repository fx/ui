import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { Slot } from '@/lib/slot'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0 [&:has(>svg:only-child)]:p-[3px] [&:has(>svg:only-child)]:aspect-square [&:has(>svg:only-child)>svg:not([class*='size-'])]:size-4 w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none overflow-hidden",
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        ghost: 'border-transparent text-foreground',
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
  /**
   * When true, the Badge renders its single child element instead of a `<span>`,
   * merging variant classes and props onto that child via Slot.
   * @default false
   */
  asChild?: boolean
}

function Badge({ className, variant, asChild, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
