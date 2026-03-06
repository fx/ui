import { Progress as BaseProgress } from '@base-ui-components/react/progress'
import { cn } from '@/lib/utils'

interface ProgressProps
  extends Omit<React.ComponentPropsWithRef<typeof BaseProgress.Root>, 'value'> {
  value?: number | undefined
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
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
        className="relative h-2 w-full overflow-hidden bg-primary/20"
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className="h-full bg-primary transition-[width] duration-300 ease-in-out"
          style={{ width: `${clampedValue}%` }}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export { Progress }
export type { ProgressProps }
