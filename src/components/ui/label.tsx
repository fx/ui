import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.Ref<HTMLLabelElement>
}

function Label({ className, ref, ...props }: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Label is a library component — htmlFor is passed via props by the consumer
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
export type { LabelProps }
