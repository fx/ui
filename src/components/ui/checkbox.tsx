import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox'
import { Check, Minus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.ComponentPropsWithRef<typeof BaseCheckbox.Root> {}

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked

  const dataState = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'

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
    <BaseCheckbox.Root
      data-slot="checkbox"
      data-state={dataState}
      checked={controlledChecked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      onCheckedChange={handleCheckedChange}
      className={cn(
        'peer flex size-4 shrink-0 items-center justify-center border border-input transition-colors outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-primary-foreground',
        'data-[indeterminate]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:text-primary-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator
        className="group flex items-center justify-center text-current"
        keepMounted
      >
        <Check className="hidden size-3.5 group-data-[checked]:block" />
        <Minus className="hidden size-3.5 group-data-[indeterminate]:block" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

export { Checkbox }
export type { CheckboxProps }
