import { cva, type VariantProps } from 'class-variance-authority'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors outline-none hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-2 min-w-9',
        sm: 'h-8 px-1.5 min-w-8',
        lg: 'h-10 px-2.5 min-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  ref?: React.Ref<HTMLButtonElement>
}

function Toggle({
  className,
  variant,
  size,
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  ref,
  ...props
}: ToggleProps) {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed)
  const isControlled = controlledPressed !== undefined
  const pressed = isControlled ? controlledPressed : uncontrolledPressed

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = !pressed
      if (!isControlled) {
        setUncontrolledPressed(next)
      }
      onPressedChange?.(next)
      props.onClick?.(e)
    },
    [pressed, isControlled, onPressedChange, props.onClick],
  )

  return (
    <button
      ref={ref}
      type="button"
      data-slot="toggle"
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
      onClick={handleClick}
    />
  )
}

export { Toggle, toggleVariants }
export type { ToggleProps }
