import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleProps extends React.ComponentPropsWithRef<typeof BaseCollapsible.Root> {}

function Collapsible(props: CollapsibleProps) {
  return <BaseCollapsible.Root data-slot="collapsible" {...props} />
}

interface CollapsibleTriggerProps
  extends React.ComponentPropsWithRef<typeof BaseCollapsible.Trigger> {
  asChild?: boolean
}

function CollapsibleTrigger({ asChild, children, ...props }: CollapsibleTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return <BaseCollapsible.Trigger data-slot="collapsible-trigger" render={child} {...props} />
  }

  return (
    <BaseCollapsible.Trigger data-slot="collapsible-trigger" {...props}>
      {children}
    </BaseCollapsible.Trigger>
  )
}

interface CollapsibleContentProps
  extends React.ComponentPropsWithRef<typeof BaseCollapsible.Panel> {}

function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
  const mergedClassName = cn(
    'overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up',
    className,
  )
  return (
    <BaseCollapsible.Panel data-slot="collapsible-content" className={mergedClassName} {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps }
