import { Progress as BaseProgress } from '@base-ui-components/react/progress'
import { cn } from '@/lib/utils'

interface ProgressProps
  extends Omit<React.ComponentPropsWithRef<typeof BaseProgress.Root>, 'value'> {
  value?: number | undefined
  trackClassName?: string
  indicatorClassName?: string
}

function Progress({
  className,
  trackClassName,
  indicatorClassName,
  value = 0,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  return (
    <BaseProgress.Root
      data-slot="progress"
      value={clampedValue}
      className={cn('relative w-full', className)}
      {...props}
    >
      <BaseProgress.Track
        data-slot="progress-track"
        className={cn('relative h-2 w-full overflow-hidden bg-primary/20', trackClassName)}
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className={cn(
            'h-full bg-primary transition-[width] duration-300 ease-in-out',
            indicatorClassName,
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export { Progress }
export type { ProgressProps }
