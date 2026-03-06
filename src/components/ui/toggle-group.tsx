import type { VariantProps } from 'class-variance-authority'
import { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { Toggle, type toggleVariants } from './toggle'

interface ToggleGroupContextValue {
  type: 'single' | 'multiple'
  value: string[]
  onToggle: (value: string) => void
  variant?: VariantProps<typeof toggleVariants>['variant']
  size?: VariantProps<typeof toggleVariants>['size']
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

function useToggleGroup() {
  const context = useContext(ToggleGroupContext)
  if (!context) {
    throw new Error('ToggleGroupItem must be used within a ToggleGroup')
  }
  return context
}

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'single' | 'multiple'
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  variant?: VariantProps<typeof toggleVariants>['variant']
  size?: VariantProps<typeof toggleVariants>['size']
  ref?: React.Ref<HTMLDivElement>
}

function ToggleGroup({
  className,
  type,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant,
  size,
  ref,
  children,
  ...props
}: ToggleGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => {
    if (defaultValue === undefined) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const isControlled = controlledValue !== undefined
  const value = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : uncontrolledValue

  const onToggle = useCallback(
    (itemValue: string) => {
      let next: string[]
      if (type === 'single') {
        next = value.includes(itemValue) ? [] : [itemValue]
      } else {
        next = value.includes(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue]
      }
      if (!isControlled) {
        setUncontrolledValue(next)
      }
      onValueChange?.(type === 'single' ? (next[0] ?? '') : next)
    },
    [type, value, isControlled, onValueChange],
  )

  return (
    <ToggleGroupContext.Provider value={{ type, value, onToggle, variant, size }}>
      {/* biome-ignore lint/a11y/useSemanticElements: div with role="group" is standard for toggle groups */}
      <div
        ref={ref}
        data-slot="toggle-group"
        role="group"
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
}

interface ToggleGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  value: string
  ref?: React.Ref<HTMLButtonElement>
}

function ToggleGroupItem({
  className,
  value,
  variant: itemVariant,
  size: itemSize,
  ref,
  ...props
}: ToggleGroupItemProps) {
  const context = useToggleGroup()
  const pressed = context.value.includes(value)
  const variant = itemVariant ?? context.variant
  const size = itemSize ?? context.size

  const toggleProps = {
    'data-slot': 'toggle-group-item' as const,
    variant,
    size,
    pressed,
    onPressedChange: () => context.onToggle(value),
    className: cn('flex-shrink-0', className),
    ...props,
    ...(ref ? { ref } : {}),
  }

  return <Toggle {...toggleProps} />
}

export { ToggleGroup, ToggleGroupItem }
export type { ToggleGroupProps, ToggleGroupItemProps }
