import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'

interface DateRangeValue {
  from: string
  to: string
}

interface DateRangeFieldsProps
  extends Omit<React.ComponentPropsWithRef<'fieldset'>, 'onChange' | 'children'> {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  legend: React.ReactNode
  fromLabel?: React.ReactNode
  toLabel?: React.ReactNode
  error?: React.ReactNode
}

function DateRangeFields({
  value,
  onChange,
  legend,
  fromLabel = 'From',
  toLabel = 'To',
  error,
  className,
  disabled,
  ...props
}: DateRangeFieldsProps) {
  const legendId = React.useId()
  const fromLabelId = React.useId()
  const toLabelId = React.useId()
  const fromId = React.useId()
  const toId = React.useId()
  const errorId = React.useId()
  const describedBy =
    [error != null && errorId, props['aria-describedby']].filter(Boolean).join(' ') || undefined
  return (
    <fieldset
      {...props}
      data-slot="date-range-fields"
      className={cn('flex min-w-0 flex-col gap-1', className)}
      disabled={disabled}
    >
      <legend id={legendId} className="text-sm font-medium">
        {legend}
      </legend>
      <div className="flex min-w-0 flex-wrap items-end gap-2">
        <label htmlFor={fromId} className="flex min-w-0 flex-[1_1_10rem] flex-col text-xs">
          <span id={fromLabelId} className="text-muted-foreground">
            {fromLabel}
          </span>
          <Input
            id={fromId}
            aria-labelledby={`${legendId} ${fromLabelId}`}
            type="date"
            value={value.from}
            aria-invalid={error != null || undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange({ ...value, from: event.currentTarget.value })}
          />
        </label>
        <label htmlFor={toId} className="flex min-w-0 flex-[1_1_10rem] flex-col text-xs">
          <span id={toLabelId} className="text-muted-foreground">
            {toLabel}
          </span>
          <Input
            id={toId}
            aria-labelledby={`${legendId} ${toLabelId}`}
            type="date"
            value={value.to}
            aria-invalid={error != null || undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange({ ...value, to: event.currentTarget.value })}
          />
        </label>
      </div>
      {error != null && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export { DateRangeFields }
export type { DateRangeFieldsProps, DateRangeValue }
