import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox'
import { cva } from 'class-variance-authority'
import { Check, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Context — propagates size & variant from Root to all sub-components
// ---------------------------------------------------------------------------

type ComboboxVariant = 'default' | 'dropdown'
type ComboboxSize = 'default' | 'xs'

interface ComboboxContextValue {
  size: ComboboxSize
  variant: ComboboxVariant
}

const ComboboxContext = React.createContext<ComboboxContextValue>({
  size: 'default',
  variant: 'default',
})

function useComboboxContext() {
  return React.useContext(ComboboxContext)
}

// ---------------------------------------------------------------------------
// CVA variant definitions
// ---------------------------------------------------------------------------

const comboboxInputVariants = cva(
  'placeholder:text-muted-foreground flex w-full min-w-0 bg-transparent outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-9 px-3 py-1 pr-8 text-base md:text-sm',
        xs: 'h-6 px-2 py-0.5 pr-6 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const comboboxTriggerVariants = cva('absolute inset-y-0 right-0 flex items-center cursor-pointer', {
  variants: {
    size: {
      default: 'pr-2',
      xs: 'pr-1.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const comboboxTriggerIconVariants = cva('opacity-50 shrink-0', {
  variants: {
    size: {
      default: 'size-4',
      xs: 'size-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const comboboxItemVariants = cva(
  'relative flex w-full cursor-default items-center gap-2 rounded-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      size: {
        default: 'py-1.5 pl-2 pr-8 text-sm',
        xs: 'py-1 pl-1.5 pr-6 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const comboboxItemIndicatorVariants = cva('absolute flex items-center justify-center', {
  variants: {
    size: {
      default: 'right-2',
      xs: 'right-1.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const comboboxGroupLabelVariants = cva('font-medium text-muted-foreground', {
  variants: {
    size: {
      default: 'px-2 py-1.5 text-xs',
      xs: 'px-1.5 py-1 text-[0.65rem]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const comboboxAnchorVariants = cva('relative transition-colors', {
  variants: {
    variant: {
      default: [
        'border border-input',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'has-[[data-popup-open]]:border-b-transparent has-[[data-popup-open]]:ring-0',
        'has-[[data-popup-open]]:border-ring',
      ],
      dropdown: [
        'inline-flex items-center border border-transparent rounded-md',
        'hover:bg-muted/50 hover:border-border',
        'has-[[data-popup-open]]:bg-muted/50 has-[[data-popup-open]]:border-border',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const comboboxDropdownTriggerVariants = cva(
  'flex items-center gap-1 cursor-pointer bg-transparent outline-none select-none text-foreground',
  {
    variants: {
      size: {
        default: 'h-9 px-3 py-1 text-base md:text-sm',
        xs: 'h-6 px-2 py-0.5 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

// ---------------------------------------------------------------------------
// Combobox Root
// ---------------------------------------------------------------------------

interface ComboboxProps<Value, Multiple extends boolean | undefined = false>
  extends React.ComponentPropsWithRef<typeof BaseCombobox.Root<Value, Multiple>> {
  size?: ComboboxSize
  variant?: ComboboxVariant
}

function Combobox<Value, Multiple extends boolean | undefined = false>({
  size = 'default',
  variant = 'default',
  ...props
}: ComboboxProps<Value, Multiple>) {
  const ctx = React.useMemo(() => ({ size, variant }), [size, variant])
  return (
    <ComboboxContext.Provider value={ctx}>
      <BaseCombobox.Root data-slot="combobox" {...props} />
    </ComboboxContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// ComboboxAnchor — container for Input + Trigger, owns the border & focus ring
// ---------------------------------------------------------------------------

function ComboboxAnchor({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  const { variant } = useComboboxContext()
  return (
    <div
      data-slot="combobox-anchor"
      className={cn(comboboxAnchorVariants({ variant }), className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// ComboboxInput
// ---------------------------------------------------------------------------

interface ComboboxInputProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Input> {
  /** Display text shown in the dropdown variant trigger when no placeholder is active */
  displayValue?: string
}

function ComboboxInput({ className, displayValue, placeholder, ...props }: ComboboxInputProps) {
  const { size, variant } = useComboboxContext()

  if (variant === 'dropdown') {
    return (
      <BaseCombobox.Trigger
        data-slot="combobox-input"
        className={cn(comboboxDropdownTriggerVariants({ size }), className)}
      >
        <BaseCombobox.Value>
          {(value: unknown) => {
            if (value != null) {
              const item = value as Record<string, unknown>
              return <span className="truncate">{String(item.label ?? item.value ?? value)}</span>
            }
            return (
              <span className="truncate text-muted-foreground">
                {displayValue ?? placeholder ?? 'Select...'}
              </span>
            )
          }}
        </BaseCombobox.Value>
        <ChevronDown
          className={cn(comboboxTriggerIconVariants({ size }), 'ml-1 opacity-50 shrink-0')}
        />
      </BaseCombobox.Trigger>
    )
  }

  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      className={cn(comboboxInputVariants({ size }), className)}
      placeholder={placeholder}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// ComboboxTrigger — dropdown arrow button (default variant only)
// ---------------------------------------------------------------------------

interface ComboboxTriggerProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Trigger> {
  asChild?: boolean
}

function ComboboxTrigger({ className, asChild, children, ...props }: ComboboxTriggerProps) {
  const { size, variant } = useComboboxContext()

  // In dropdown variant, the trigger is built into ComboboxInput
  if (variant === 'dropdown') {
    return null
  }

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
    return (
      <BaseCombobox.Trigger
        data-slot="combobox-trigger"
        className={cn(comboboxTriggerVariants({ size }), className)}
        render={child}
        {...props}
      />
    )
  }

  return (
    <BaseCombobox.Trigger
      data-slot="combobox-trigger"
      className={cn(comboboxTriggerVariants({ size }), className)}
      {...props}
    >
      {children ?? (
        <BaseCombobox.Icon>
          <ChevronsUpDown className={cn(comboboxTriggerIconVariants({ size }))} />
        </BaseCombobox.Icon>
      )}
    </BaseCombobox.Trigger>
  )
}

// ---------------------------------------------------------------------------
// ComboboxSearch — search input placed inside the popup for dropdown variant
// ---------------------------------------------------------------------------

interface ComboboxSearchProps
  extends Omit<React.ComponentPropsWithRef<typeof BaseCombobox.Input>, 'children'> {}

function ComboboxSearch({ className, ...props }: ComboboxSearchProps) {
  const { size } = useComboboxContext()
  return (
    <div
      data-slot="combobox-search"
      className={cn(
        'flex items-center gap-2 border-b border-border px-2',
        size === 'xs' ? 'py-1' : 'py-1.5',
      )}
    >
      <Search
        className={cn('shrink-0 text-muted-foreground', size === 'xs' ? 'size-3' : 'size-4')}
      />
      <BaseCombobox.Input
        className={cn(
          'w-full bg-transparent outline-none placeholder:text-muted-foreground',
          size === 'xs' ? 'text-xs h-5' : 'text-sm h-6',
          className,
        )}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        {...props}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// ComboboxContent — Portal + Positioner + Popup
// ---------------------------------------------------------------------------

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Popup>) {
  const { variant } = useComboboxContext()

  return (
    <BaseCombobox.Portal className="fixed inset-0 z-[60] pointer-events-none [&>*]:pointer-events-auto">
      <BaseCombobox.Positioner sideOffset={variant === 'dropdown' ? 4 : -1}>
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={cn(
            'relative z-[60] max-h-[min(var(--available-height),24rem)] overflow-y-auto overflow-x-hidden bg-popover p-1 text-popover-foreground shadow-md',
            variant === 'default' &&
              '-ml-px w-[calc(var(--anchor-width)+2px)] border border-t-0 border-ring',
            variant === 'dropdown' &&
              'w-[max(var(--anchor-width),12rem)] rounded-md border border-border',
            className,
          )}
          {...props}
        >
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

// ---------------------------------------------------------------------------
// ComboboxList — render function container for items
// ---------------------------------------------------------------------------

function ComboboxList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.List>) {
  return <BaseCombobox.List data-slot="combobox-list" className={cn(className)} {...props} />
}

// ---------------------------------------------------------------------------
// ComboboxEmpty
// ---------------------------------------------------------------------------

function ComboboxEmpty({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Empty>) {
  const { size } = useComboboxContext()
  return (
    <BaseCombobox.Empty
      data-slot="combobox-empty"
      className={cn(
        'empty:hidden text-center text-muted-foreground',
        size === 'xs' ? 'py-4 text-xs' : 'py-6 text-sm',
        className,
      )}
      {...props}
    >
      {children ?? 'No results found.'}
    </BaseCombobox.Empty>
  )
}

// ---------------------------------------------------------------------------
// ComboboxItem
// ---------------------------------------------------------------------------

interface ComboboxItemProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Item> {}

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  const { size } = useComboboxContext()
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      className={cn(comboboxItemVariants({ size }), className)}
      {...props}
    >
      <BaseCombobox.ItemIndicator className={cn(comboboxItemIndicatorVariants({ size }))}>
        <Check className={size === 'xs' ? 'size-3' : 'size-4'} />
      </BaseCombobox.ItemIndicator>
      {children}
    </BaseCombobox.Item>
  )
}

// ---------------------------------------------------------------------------
// ComboboxGroup
// ---------------------------------------------------------------------------

function ComboboxGroup({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Group>) {
  return (
    <BaseCombobox.Group data-slot="combobox-group" className={cn('py-1', className)} {...props} />
  )
}

// ---------------------------------------------------------------------------
// ComboboxLabel
// ---------------------------------------------------------------------------

function ComboboxLabel({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.GroupLabel>) {
  const { size } = useComboboxContext()
  return (
    <BaseCombobox.GroupLabel
      data-slot="combobox-label"
      className={cn(comboboxGroupLabelVariants({ size }), className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// ComboboxSeparator
// ---------------------------------------------------------------------------

function ComboboxSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="combobox-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Combobox,
  ComboboxAnchor,
  comboboxAnchorVariants,
  ComboboxContent,
  comboboxDropdownTriggerVariants,
  ComboboxEmpty,
  ComboboxGroup,
  comboboxGroupLabelVariants,
  ComboboxInput,
  comboboxInputVariants,
  ComboboxItem,
  comboboxItemVariants,
  ComboboxLabel,
  ComboboxList,
  ComboboxSearch,
  ComboboxSeparator,
  ComboboxTrigger,
  comboboxTriggerVariants,
  useComboboxContext,
}
export type {
  ComboboxContextValue,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxProps,
  ComboboxSearchProps,
  ComboboxSize,
  ComboboxTriggerProps,
  ComboboxVariant,
}
