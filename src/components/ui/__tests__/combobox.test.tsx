import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSearch,
  ComboboxSeparator,
  ComboboxTrigger,
  useComboboxContext,
} from '../combobox'

/** Query helper: find an element by its data-slot attribute */
function getBySlot(slot: string): HTMLElement {
  const el = document.querySelector(`[data-slot="${slot}"]`)
  if (!el) throw new Error(`Could not find element with data-slot="${slot}"`)
  return el as HTMLElement
}

interface Fruit {
  label: string
  value: string
}

const fruits: Fruit[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('Combobox', () => {
  it('renders an input', () => {
    render(
      <Combobox items={fruits}>
        <ComboboxAnchor>
          <ComboboxInput placeholder="Search..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxList>
            {(item: Fruit) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('has data-slot on input', () => {
    render(
      <Combobox items={fruits}>
        <ComboboxAnchor>
          <ComboboxInput placeholder="Search..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxList>
            {(item: Fruit) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'combobox-input')
  })

  it('merges custom className on input', () => {
    render(
      <Combobox items={fruits}>
        <ComboboxAnchor>
          <ComboboxInput placeholder="Search..." className="custom-class" />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxList>
            {(item: Fruit) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(screen.getByRole('combobox').className).toContain('custom-class')
  })

  it('forwards ref on input', () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <Combobox items={fruits}>
        <ComboboxAnchor>
          <ComboboxInput ref={ref} placeholder="Search..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxList>
            {(item: Fruit) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  describe('ComboboxTrigger asChild', () => {
    it('renders child element instead of default trigger when asChild is true', () => {
      render(
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger asChild>
              <button type="button" data-testid="custom-btn">
                Custom
              </button>
            </ComboboxTrigger>
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const btn = screen.getByTestId('custom-btn')
      expect(btn).toBeInTheDocument()
      expect(btn.textContent).toBe('Custom')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger asChild>
              <button type="button" data-testid="custom-btn">
                Custom
              </button>
            </ComboboxTrigger>
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const btn = screen.getByTestId('custom-btn')
      expect(btn).toHaveAttribute('data-slot', 'combobox-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLButtonElement>()
      render(
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger asChild ref={ref}>
              <button type="button">Custom</button>
            </ComboboxTrigger>
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  it('renders separator with data-slot', () => {
    render(<ComboboxSeparator data-testid="sep" />)
    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'combobox-separator')
  })

  it('renders anchor with data-slot', () => {
    render(
      <Combobox items={fruits}>
        <ComboboxAnchor data-testid="anchor">
          <ComboboxInput placeholder="Search..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxList>
            {(item: Fruit) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(screen.getByTestId('anchor')).toHaveAttribute('data-slot', 'combobox-anchor')
  })

  it('renders empty with data-slot', () => {
    render(
      <Combobox items={fruits}>
        <ComboboxEmpty data-testid="empty">No results</ComboboxEmpty>
      </Combobox>,
    )
    expect(screen.getByTestId('empty')).toHaveAttribute('data-slot', 'combobox-empty')
  })

  it('renders group with data-slot', () => {
    render(<ComboboxGroup data-testid="group">content</ComboboxGroup>)
    expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'combobox-group')
  })

  it('renders label with data-slot', () => {
    render(
      <ComboboxGroup>
        <ComboboxLabel data-testid="label">Fruits</ComboboxLabel>
      </ComboboxGroup>,
    )
    expect(screen.getByTestId('label')).toHaveAttribute('data-slot', 'combobox-label')
  })

  // ---------------------------------------------------------------------------
  // xs size variant
  // ---------------------------------------------------------------------------

  describe('xs size', () => {
    it('renders an input with xs size classes', () => {
      render(
        <Combobox items={fruits} size="xs">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const input = screen.getByRole('combobox')
      expect(input).toBeInTheDocument()
      expect(input.className).toContain('h-6')
      expect(input.className).toContain('text-xs')
    })

    it('has data-slot on input with xs size', () => {
      render(
        <Combobox items={fruits} size="xs">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'combobox-input')
    })

    it('applies xs classes on items', () => {
      render(
        <Combobox items={fruits} size="xs" defaultOpen>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item} data-testid={`item-${item.value}`}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const item = screen.getByTestId('item-apple')
      expect(item.className).toContain('text-xs')
    })

    it('merges custom className with xs size', () => {
      render(
        <Combobox items={fruits} size="xs">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." className="custom-xs" />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const input = screen.getByRole('combobox')
      expect(input.className).toContain('custom-xs')
      expect(input.className).toContain('h-6')
    })
  })

  // ---------------------------------------------------------------------------
  // dropdown variant
  // ---------------------------------------------------------------------------

  describe('dropdown variant', () => {
    it('renders a trigger button instead of an input', () => {
      render(
        <Combobox items={fruits} variant="dropdown">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      // In dropdown variant, ComboboxInput renders a trigger (button), not an input
      const trigger = getBySlot('combobox-input')
      expect(trigger).toBeInTheDocument()
      expect(trigger.tagName).toBe('BUTTON')
    })

    it('shows placeholder text in trigger', () => {
      render(
        <Combobox items={fruits} variant="dropdown">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      expect(screen.getByText('Select fruit...')).toBeInTheDocument()
    })

    it('has data-slot on dropdown trigger', () => {
      render(
        <Combobox items={fruits} variant="dropdown">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      expect(getBySlot('combobox-input')).toHaveAttribute('data-slot', 'combobox-input')
    })

    it('applies transparent border on anchor by default', () => {
      render(
        <Combobox items={fruits} variant="dropdown">
          <ComboboxAnchor data-testid="anchor">
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const anchor = screen.getByTestId('anchor')
      expect(anchor.className).toContain('border-transparent')
    })

    it('hides ComboboxTrigger in dropdown variant', () => {
      render(
        <Combobox items={fruits} variant="dropdown">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger data-testid="trigger" />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      // ComboboxTrigger returns null in dropdown variant
      expect(screen.queryByTestId('trigger')).not.toBeInTheDocument()
    })

    it('matches defaultValue by structural equality (not referential)', () => {
      render(
        <Combobox
          items={fruits}
          variant="dropdown"
          defaultValue={{ label: 'Cherry', value: 'cherry' }}
        >
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      // A new object with matching shape should resolve to the selected value
      expect(screen.getByText('Cherry')).toBeInTheDocument()
    })

    it('renders ComboboxSearch with data-slot', () => {
      render(
        <Combobox items={fruits} variant="dropdown" defaultOpen>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." data-testid="search" />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      // ComboboxSearch wrapper has data-slot
      const searchWrapper = getBySlot('combobox-search')
      expect(searchWrapper).toBeInTheDocument()
    })
  })

  // ---------------------------------------------------------------------------
  // dropdown-xs (dropdown variant + xs size)
  // ---------------------------------------------------------------------------

  describe('dropdown-xs', () => {
    it('renders dropdown trigger with xs sizing', () => {
      render(
        <Combobox items={fruits} variant="dropdown" size="xs">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const trigger = getBySlot('combobox-input')
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.className).toContain('h-6')
      expect(trigger.className).toContain('text-xs')
    })

    it('applies transparent border on anchor', () => {
      render(
        <Combobox items={fruits} variant="dropdown" size="xs">
          <ComboboxAnchor data-testid="anchor">
            <ComboboxInput placeholder="Select fruit..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const anchor = screen.getByTestId('anchor')
      expect(anchor.className).toContain('border-transparent')
    })
  })

  // ---------------------------------------------------------------------------
  // Context
  // ---------------------------------------------------------------------------

  describe('useComboboxContext', () => {
    it('provides default values', () => {
      let ctxValue: ReturnType<typeof useComboboxContext> | undefined
      function Consumer() {
        ctxValue = useComboboxContext()
        return null
      }
      render(
        <Combobox items={fruits}>
          <Consumer />
        </Combobox>,
      )
      expect(ctxValue).toEqual({ size: 'default', variant: 'default' })
    })

    it('provides xs size', () => {
      let ctxValue: ReturnType<typeof useComboboxContext> | undefined
      function Consumer() {
        ctxValue = useComboboxContext()
        return null
      }
      render(
        <Combobox items={fruits} size="xs">
          <Consumer />
        </Combobox>,
      )
      expect(ctxValue).toEqual({ size: 'xs', variant: 'default' })
    })

    it('provides dropdown variant', () => {
      let ctxValue: ReturnType<typeof useComboboxContext> | undefined
      function Consumer() {
        ctxValue = useComboboxContext()
        return null
      }
      render(
        <Combobox items={fruits} variant="dropdown">
          <Consumer />
        </Combobox>,
      )
      expect(ctxValue).toEqual({ size: 'default', variant: 'dropdown' })
    })

    it('provides dropdown variant with xs size', () => {
      let ctxValue: ReturnType<typeof useComboboxContext> | undefined
      function Consumer() {
        ctxValue = useComboboxContext()
        return null
      }
      render(
        <Combobox items={fruits} variant="dropdown" size="xs">
          <Consumer />
        </Combobox>,
      )
      expect(ctxValue).toEqual({ size: 'xs', variant: 'dropdown' })
    })
  })

  // ---------------------------------------------------------------------------
  // Backward compatibility — default variant unchanged
  // ---------------------------------------------------------------------------

  describe('backward compatibility', () => {
    it('default variant renders input element', () => {
      render(
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const input = screen.getByRole('combobox')
      expect(input.tagName).toBe('INPUT')
    })

    it('default variant has standard border on anchor', () => {
      render(
        <Combobox items={fruits}>
          <ComboboxAnchor data-testid="anchor">
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const anchor = screen.getByTestId('anchor')
      expect(anchor.className).toContain('border-input')
      expect(anchor.className).not.toContain('border-transparent')
    })

    it('default variant renders ComboboxTrigger', () => {
      render(
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger data-testid="trigger" />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })
  })

  // ---------------------------------------------------------------------------
  // Multi-select
  // ---------------------------------------------------------------------------

  describe('multi-select', () => {
    it('renders chips for multiple selected values', () => {
      render(
        <Combobox
          items={fruits}
          multiple
          defaultValue={[
            { label: 'Apple', value: 'apple' },
            { label: 'Cherry', value: 'cherry' },
          ]}
        >
          <ComboboxAnchor>
            <ComboboxChips>
              {(value: unknown) => {
                const item = value as Fruit
                return (
                  <ComboboxChip key={item.value}>
                    {item.label}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )
              }}
            </ComboboxChips>
            <ComboboxInput placeholder="Search fruits..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxEmpty />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const chips = document.querySelectorAll('[data-slot="combobox-chip"]')
      expect(chips.length).toBe(2)
      expect(chips[0]?.textContent).toContain('Apple')
      expect(chips[1]?.textContent).toContain('Cherry')
    })

    it('renders comma-separated values in dropdown multi-select', () => {
      render(
        <Combobox
          items={fruits}
          variant="dropdown"
          multiple
          defaultValue={[
            { label: 'Apple', value: 'apple' },
            { label: 'Cherry', value: 'cherry' },
          ]}
          defaultOpen
        >
          <ComboboxAnchor>
            <ComboboxInput placeholder="Select fruits..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxSearch placeholder="Search..." />
            <ComboboxEmpty />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      expect(screen.getByText('Apple, Cherry')).toBeInTheDocument()
    })

    it('renders chip remove buttons', () => {
      render(
        <Combobox
          items={fruits}
          multiple
          defaultValue={[
            { label: 'Apple', value: 'apple' },
            { label: 'Cherry', value: 'cherry' },
          ]}
        >
          <ComboboxAnchor>
            <ComboboxChips>
              {(value: unknown) => {
                const item = value as Fruit
                return (
                  <ComboboxChip key={item.value}>
                    {item.label}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )
              }}
            </ComboboxChips>
            <ComboboxInput placeholder="Search fruits..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxEmpty />
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      )
      const removeButtons = document.querySelectorAll('[data-slot="combobox-chip-remove"]')
      expect(removeButtons.length).toBe(2)
      // Each remove button should contain an X icon (rendered as SVG)
      for (const btn of removeButtons) {
        expect(btn.querySelector('svg')).toBeInTheDocument()
      }
    })
  })
})
