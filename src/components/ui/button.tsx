import { Button as BaseButton } from '@base-ui-components/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: 'h-6 rounded-md px-2 text-xs has-[>svg]:px-1.5',
        sm: 'h-9 rounded-md px-3 text-xs has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': 'size-6',
        'icon-sm': 'size-9',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ComponentPropsWithRef<typeof BaseButton>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the Button renders its single child element instead of a `<button>`,
   * merging variant classes and props onto that child via Base UI's `render` prop.
   * Provided for Radix UI API compatibility. For new code, prefer passing the
   * `render` prop directly (inherited from Base UI).
   * @default false
   */
  asChild?: boolean
}

/**
 * A button component built on Base UI's Button primitive.
 *
 * Supports polymorphic rendering via Base UI's `render` prop (preferred)
 * or the Radix-compatible `asChild` prop.
 */
function Button({ className, variant, size, asChild, children, ...props }: ButtonProps) {
  const variantClasses = cn(buttonVariants({ variant, size }), className)

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return <BaseButton data-slot="button" className={variantClasses} render={child} {...props} />
  }

  return (
    <BaseButton data-slot="button" className={variantClasses} {...props}>
      {children}
    </BaseButton>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
