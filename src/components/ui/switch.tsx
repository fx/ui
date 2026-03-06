import { Switch as BaseSwitch } from '@base-ui-components/react/switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-input',
  {
    variants: {
      size: {
        default: 'h-[1.25rem] w-9',
        sm: 'h-4 w-7',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[unchecked]:translate-x-0',
  {
    variants: {
      size: {
        default: 'size-4 data-[checked]:translate-x-4',
        sm: 'size-3 data-[checked]:translate-x-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

interface SwitchProps
  extends React.ComponentPropsWithRef<typeof BaseSwitch.Root>,
    VariantProps<typeof switchVariants> {}

function Switch({
  className,
  size,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked

  const dataState = checked ? 'checked' : 'unchecked'

  const handleCheckedChange: typeof onCheckedChange = useCallback(
    (nextChecked, eventDetails) => {
      if (!isControlled) {
        setUncontrolledChecked(nextChecked)
      }
      onCheckedChange?.(nextChecked, eventDetails)
    },
    [isControlled, onCheckedChange],
  )

  return (
    <BaseSwitch.Root
      data-slot="switch"
      data-state={dataState}
      checked={controlledChecked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <BaseSwitch.Thumb data-slot="switch-thumb" className={cn(thumbVariants({ size }))} />
    </BaseSwitch.Root>
  )
}

export { Switch, switchVariants }
export type { SwitchProps }
