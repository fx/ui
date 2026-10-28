import { Slider as BaseSlider } from '@base-ui-components/react/slider'
import { type Ref, useState } from 'react'
import { cn } from '@/lib/utils'

type SliderProps<Value extends number | readonly number[] = number> = Omit<
  BaseSlider.Root.Props<Value>,
  'children'
> &
  Pick<BaseSlider.Thumb.Props, 'getAriaLabel' | 'getAriaValueText'> & {
    ref?: Ref<HTMLDivElement>
  }

function Slider<Value extends number | readonly number[] = number>({
  className,
  getAriaLabel,
  getAriaValueText,
  onValueChange,
  onValueCommitted,
  ...props
}: SliderProps<Value>) {
  // Like defaultValue itself, an uncontrolled slider's thumb count is initial-only.
  const [defaultThumbCount] = useState(() =>
    Array.isArray(props.defaultValue) ? props.defaultValue.length : 1,
  )
  const [defaultIsArray] = useState(() => Array.isArray(props.defaultValue))
  const isArray = props.value === undefined ? defaultIsArray : Array.isArray(props.value)
  const thumbCount =
    props.value === undefined
      ? defaultThumbCount
      : Array.isArray(props.value)
        ? props.value.length
        : 1

  function normalizeValue(value: number | readonly number[]) {
    // Base UI's pointer path emits a scalar for one thumb, even for array values.
    // Use the public value shape, including the initial uncontrolled default.
    return (
      isArray ? (Array.isArray(value) ? value : [value]) : Array.isArray(value) ? value[0] : value
    ) as Value extends number ? number : Value
  }

  return (
    <BaseSlider.Root<Value>
      {...props}
      onValueChange={(value, details) => onValueChange?.(normalizeValue(value), details)}
      onValueCommitted={(value, details) => onValueCommitted?.(normalizeValue(value), details)}
      data-slot="slider"
      className={(state) =>
        cn(
          'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-48 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          typeof className === 'function' ? className(state) : className,
        )
      }
    >
      <BaseSlider.Control
        data-slot="slider-control"
        className="relative flex w-full items-center py-2 data-[disabled]:pointer-events-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:justify-center data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0"
      >
        <BaseSlider.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full overflow-hidden bg-muted data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <BaseSlider.Indicator
            data-slot="slider-range"
            className="bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </BaseSlider.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <BaseSlider.Thumb
            // Thumb identity follows its index, not its changing numeric value.
            // biome-ignore lint/suspicious/noArrayIndexKey: Base UI identifies thumbs by index.
            key={index}
            index={index}
            data-slot="slider-thumb"
            aria-label={props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            aria-describedby={props['aria-describedby']}
            getAriaLabel={getAriaLabel ?? null}
            getAriaValueText={getAriaValueText ?? null}
            className="size-4 shrink-0 rounded-full border border-primary bg-background shadow-xs outline-none has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 data-[disabled]:pointer-events-none"
          />
        ))}
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export { Slider }
export type { SliderProps }
