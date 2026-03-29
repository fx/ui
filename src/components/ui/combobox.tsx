import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox'
import { cva } from 'class-variance-authority'
import { Check, ChevronDown, ChevronsUpDown, Search, X } from 'lucide-react'
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
  anchorRef: React.RefObject<HTMLDivElement | null>
}

const ComboboxContext = React.createContext<ComboboxContextValue>({
  size: 'default',
  variant: 'default',
  anchorRef: { current: null },
})

function useComboboxContext() {
  return React.useContext(ComboboxContext)
}

// ---------------------------------------------------------------------------
// CVA variant definitions
// ---------------------------------------------------------------------------

const comboboxInputVariants = cva(
  'placeholder:text-muted-foreground flex flex-1 min-w-[4rem] bg-transparent outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-7 px-2 pr-7 text-base md:text-sm',
        xs: 'h-5 px-1 pr-5 text-xs',
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

const comboboxIconSizeVariants = cva('', {
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

const comboboxSearchWrapperVariants = cva('flex items-center gap-2 border-b border-border px-2', {
  variants: {
    size: {
      default: 'py-1.5',
      xs: 'py-1',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const comboboxSearchInputVariants = cva(
  'w-full bg-transparent outline-none placeholder:text-muted-foreground',
  {
    variants: {
      size: {
        default: 'text-sm h-6',
        xs: 'text-xs h-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const comboboxEmptyVariants = cva('empty:hidden text-center text-muted-foreground', {
  variants: {
    size: {
      default: 'py-6 text-sm',
      xs: 'py-4 text-xs',
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
        'flex flex-wrap items-center',
        'border border-input',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'has-[[data-popup-open]]:border-b-transparent has-[[data-popup-open]]:ring-0',
        'has-[[data-popup-open]]:border-ring',
      ],
      dropdown: [
        'inline-flex items-center border border-transparent rounded-md',
        'hover:bg-muted/50 hover:border-border',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'has-[[data-popup-open]]:bg-muted/50 has-[[data-popup-open]]:border-border has-[[data-popup-open]]:ring-0',
      ],
    },
    size: {
      default: '',
      xs: '',
    },
  },
  compoundVariants: [
    { variant: 'default', size: 'default', class: 'min-h-9 gap-1 p-1' },
    { variant: 'default', size: 'xs', class: 'min-h-6 gap-0.5 p-0.5' },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
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

/** Extract a display label from a value — handles both objects with `label` and primitives. */
function extractLabel(v: unknown): string {
  return typeof v === 'object' && v !== null && 'label' in v
    ? String((v as { label: unknown }).label)
    : String(v)
}

function defaultIsItemEqualToValue<Value>(a: Value, b: Value): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

function Combobox<Value, Multiple extends boolean | undefined = false>({
  size = 'default',
  variant = 'default',
  isItemEqualToValue = defaultIsItemEqualToValue,
  ...props
}: ComboboxProps<Value, Multiple>) {
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const ctx = React.useMemo(() => ({ size, variant, anchorRef }), [size, variant])
  return (
    <ComboboxContext.Provider value={ctx}>
      <BaseCombobox.Root data-slot="combobox" isItemEqualToValue={isItemEqualToValue} {...props} />
    </ComboboxContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// ComboboxAnchor — container for Input + Trigger, owns the border & focus ring
// ---------------------------------------------------------------------------

function ComboboxAnchor({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  const { variant, size, anchorRef } = useComboboxContext()
  return (
    <div
      ref={(node) => {
        // Set context ref for positioner anchor tracking
        ;(anchorRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        // Forward consumer ref
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      data-slot="combobox-anchor"
      className={cn(comboboxAnchorVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// ComboboxInput
// ---------------------------------------------------------------------------

interface ComboboxInputProps extends React.ComponentPropsWithRef<typeof BaseCombobox.Input> {}

function ComboboxInput({ className, placeholder, ...props }: ComboboxInputProps) {
  const { size, variant } = useComboboxContext()

  if (variant === 'dropdown') {
    // Forward all props (disabled, ref, event handlers, aria/data attrs) to the trigger.
    // Input-specific props like `value`/`onChange` are harmless on a button element.
    const { value: _value, onChange: _onChange, ...triggerProps } = props as Record<string, unknown>
    return (
      <BaseCombobox.Trigger
        data-slot="combobox-input"
        className={cn(comboboxDropdownTriggerVariants({ size }), className)}
        {...(triggerProps as React.ComponentPropsWithRef<typeof BaseCombobox.Trigger>)}
      >
        <BaseCombobox.Value>
          {(value: unknown) => {
            if (Array.isArray(value)) {
              if (value.length > 0) {
                return <span className="truncate">{value.map(extractLabel).join(', ')}</span>
              }
              return (
                <span className="truncate text-muted-foreground">{placeholder ?? 'Select...'}</span>
              )
            }
            if (value != null) {
              return <span className="truncate">{extractLabel(value)}</span>
            }
            return (
              <span className="truncate text-muted-foreground">{placeholder ?? 'Select...'}</span>
            )
          }}
        </BaseCombobox.Value>
        <ChevronDown className={cn(comboboxTriggerIconVariants({ size }), 'ml-1')} />
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
    <div data-slot="combobox-search" className={cn(comboboxSearchWrapperVariants({ size }))}>
      <Search
        className={cn('shrink-0 text-muted-foreground', comboboxIconSizeVariants({ size }))}
      />
      <BaseCombobox.Input
        autoFocus
        {...props}
        className={cn(comboboxSearchInputVariants({ size }), className)}
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
  const { variant, anchorRef } = useComboboxContext()

  return (
    <BaseCombobox.Portal className="fixed inset-0 z-[60] pointer-events-none [&>*]:pointer-events-auto">
      <BaseCombobox.Positioner
        sideOffset={variant === 'dropdown' ? 4 : -1}
        anchor={variant === 'default' ? anchorRef : undefined}
        align={variant === 'dropdown' ? 'start' : undefined}
      >
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={cn(
            'relative z-[60] max-h-[min(var(--available-height),24rem)] overflow-y-auto overflow-x-hidden bg-popover p-1 text-popover-foreground shadow-md',
            variant === 'default' && 'w-[var(--anchor-width)] border border-t-0 border-ring',
            variant === 'dropdown' && 'min-w-[12rem] max-w-[20rem] rounded-md border border-border',
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
      className={cn(comboboxEmptyVariants({ size }), className)}
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
        <Check className={comboboxIconSizeVariants({ size })} />
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
// ComboboxChips — container for multi-select chips (render function pattern)
// ---------------------------------------------------------------------------

const comboboxChipsVariants = cva('flex flex-wrap items-center gap-1')

interface ComboboxChipsProps
  extends Omit<React.ComponentPropsWithRef<typeof BaseCombobox.Chips>, 'children'> {
  children?: React.ReactNode | ((value: unknown, index: number) => React.ReactNode)
}

function ComboboxChips({ className, children, ...props }: ComboboxChipsProps) {
  if (typeof children === 'function') {
    const renderFn = children
    return (
      <BaseCombobox.Chips
        data-slot="combobox-chips"
        className={cn(comboboxChipsVariants(), className)}
        {...props}
      >
        <BaseCombobox.Value>
          {(value: unknown) => {
            if (Array.isArray(value)) {
              return value.map((v: unknown, i: number) => renderFn(v, i))
            }
            return null
          }}
        </BaseCombobox.Value>
      </BaseCombobox.Chips>
    )
  }

  return (
    <BaseCombobox.Chips
      data-slot="combobox-chips"
      className={cn(comboboxChipsVariants(), className)}
      {...props}
    >
      {children}
    </BaseCombobox.Chips>
  )
}

// ---------------------------------------------------------------------------
// ComboboxChip — individual chip for a selected value
// ---------------------------------------------------------------------------

const comboboxChipVariants = cva(
  'inline-flex items-center gap-1 rounded border border-border bg-muted text-foreground',
  {
    variants: {
      size: {
        default: 'text-xs h-6 px-2',
        xs: 'text-[0.65rem] h-5 px-1.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

function ComboboxChip({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.Chip>) {
  const { size } = useComboboxContext()
  return (
    <BaseCombobox.Chip
      data-slot="combobox-chip"
      className={cn(comboboxChipVariants({ size }), className)}
      {...props}
    >
      {children}
    </BaseCombobox.Chip>
  )
}

// ---------------------------------------------------------------------------
// ComboboxChipRemove — remove button inside a chip
// ---------------------------------------------------------------------------

const comboboxChipRemoveVariants = cva(
  'inline-flex items-center justify-center shrink-0 cursor-pointer rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
)

function ComboboxChipRemove({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof BaseCombobox.ChipRemove>) {
  const { size } = useComboboxContext()
  const hasChildren = children != null
  return (
    <BaseCombobox.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn(comboboxChipRemoveVariants(), className)}
      {...(!hasChildren && !('aria-label' in props) ? { 'aria-label': 'Remove' } : {})}
      {...props}
    >
      {children ?? <X className={comboboxIconSizeVariants({ size })} />}
    </BaseCombobox.ChipRemove>
  )
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Combobox,
  ComboboxAnchor,
  comboboxAnchorVariants,
  ComboboxChip,
  comboboxChipRemoveVariants,
  ComboboxChipRemove,
  comboboxChipVariants,
  ComboboxChips,
  comboboxChipsVariants,
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
  ComboboxChipsProps,
  ComboboxContextValue,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxProps,
  ComboboxSearchProps,
  ComboboxSize,
  ComboboxTriggerProps,
  ComboboxVariant,
}
