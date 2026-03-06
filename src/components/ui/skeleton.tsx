import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function Skeleton({ className, ref, ...props }: SkeletonProps) {
  return (
    <div
      ref={ref}
      data-slot="skeleton"
      className={cn('animate-pulse bg-primary/10', className)}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
