import { Separator as BaseSeparator } from '@base-ui-components/react/separator'
import { cn } from '@/lib/utils'

interface SeparatorProps extends React.ComponentPropsWithRef<typeof BaseSeparator> {
  orientation?: 'horizontal' | 'vertical'
}

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      orientation={orientation}
      data-slot="separator"
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }
