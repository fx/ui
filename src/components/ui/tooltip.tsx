import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip'
import * as React from 'react'
import { cn } from '@/lib/utils'

// TooltipProvider
interface TooltipProviderProps extends React.ComponentPropsWithRef<typeof BaseTooltip.Provider> {}

function TooltipProvider({ ...props }: TooltipProviderProps) {
  return <BaseTooltip.Provider data-slot="tooltip-provider" {...props} />
}

// Tooltip Root
interface TooltipProps extends Omit<React.ComponentPropsWithRef<typeof BaseTooltip.Root>, 'delay'> {
  delayDuration?: number
}

function Tooltip({ delayDuration = 0, ...props }: TooltipProps) {
  return <BaseTooltip.Root data-slot="tooltip" {...props} delay={delayDuration} />
}

// TooltipTrigger
interface TooltipTriggerProps extends React.ComponentPropsWithRef<typeof BaseTooltip.Trigger> {
  asChild?: boolean
}

function TooltipTrigger({ className, asChild, children, ...props }: TooltipTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseTooltip.Trigger
        data-slot="tooltip-trigger"
        className={cn(className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseTooltip.Trigger data-slot="tooltip-trigger" className={cn(className)} {...props}>
      {children}
    </BaseTooltip.Trigger>
  )
}

// TooltipContent
function TooltipContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseTooltip.Popup>) {
  return (
    <BaseTooltip.Portal className="fixed inset-0 z-[60] pointer-events-none [&>*]:pointer-events-auto">
      <BaseTooltip.Positioner>
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            'z-[60] overflow-hidden bg-primary px-3 py-1.5 text-xs text-primary-foreground text-balance transition-all duration-200',
            'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
            'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
            className,
          )}
          {...props}
        >
          {children}
          <BaseTooltip.Arrow data-slot="tooltip-arrow" className="[&>path]:fill-primary" />
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
export type { TooltipProviderProps, TooltipProps, TooltipTriggerProps }
