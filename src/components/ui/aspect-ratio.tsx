import { cn } from '@/lib/utils'

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
  ref?: React.Ref<HTMLDivElement>
}

function AspectRatio({ className, ratio = 1, style, ref, children, ...props }: AspectRatioProps) {
  return (
    <div
      ref={ref}
      data-slot="aspect-ratio"
      className={cn('relative w-full', className)}
      style={{ ...style, aspectRatio: String(ratio) }}
      {...props}
    >
      {children}
    </div>
  )
}

export { AspectRatio }
export type { AspectRatioProps }
