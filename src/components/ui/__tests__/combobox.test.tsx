import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
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
import { Dialog, DialogContent, DialogTitle } from '../dialog'
import { Sheet, SheetContent, SheetTitle } from '../sheet'

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
  it('keeps non-portaled content within its container and supports keyboard selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <div data-testid="container">
        <Combobox items={fruits} onValueChange={onValueChange}>
          <ComboboxAnchor>
            <ComboboxInput aria-label="Fruit" />
          </ComboboxAnchor>
          <ComboboxContent portal={false}>
            <ComboboxList>
              {(item: Fruit) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>,
    )
    const input = screen.getByRole('combobox', { name: 'Fruit' })
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    const list = await screen.findByRole('listbox')
    expect(screen.getByTestId('container')).toContainElement(list)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('aria-activedescendant')
    await user.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Apple' }),
      expect.anything(),
    )
  })

  it('portals content to the body by default', async () => {
    const user = userEvent.setup()
    render(
      <div data-testid="container">
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput aria-label="Fruit" />
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
        </Combobox>
      </div>,
    )
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByTestId('container')).not.toContainElement(await screen.findByRole('listbox'))
  })

  it('keeps the associated label exposed while a local list in a sheet is open', async () => {
    const user = userEvent.setup()
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>Pick a fruit</SheetTitle>
          <label htmlFor="fruit-input">Fruit</label>
          <Combobox items={fruits}>
            <ComboboxAnchor>
              <ComboboxInput id="fruit-input" />
            </ComboboxAnchor>
            <ComboboxContent portal={false}>
              <ComboboxList>
                {(item: Fruit) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </SheetContent>
      </Sheet>,
    )
    const input = screen.getByRole('combobox', { name: 'Fruit' })
    const label = screen.getByText('Fruit')
    await user.click(input)
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
    expect(input).toHaveAccessibleName('Fruit')
    await user.keyboard('{ArrowDown}{Escape}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(input).toHaveFocus()
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('preserves aria-labelledby references while a portaled list is open', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <span id="fruit-label">Choose fruit</span>
        <Combobox items={fruits}>
          <ComboboxAnchor>
            <ComboboxInput aria-labelledby="fruit-label" />
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
        </Combobox>
      </div>,
    )
    const input = screen.getByRole('combobox', { name: 'Choose fruit' })
    const label = screen.getByText('Choose fruit')
    await user.click(input)
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
    expect(input).toHaveAccessibleName('Choose fruit')
  })

  it('closes the list before the enclosing dialog on Escape', async () => {
    const user = userEvent.setup()
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Choose fruit</DialogTitle>
          <Combobox items={fruits}>
            <ComboboxAnchor>
              <ComboboxInput aria-label="Fruit" />
            </ComboboxAnchor>
            <ComboboxContent portal={false}>
              <ComboboxList>
                {(item: Fruit) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

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
      expect(input.className).toContain('h-5')
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
      expect(input.className).toContain('h-5')
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
      expect(ctxValue).toMatchObject({ size: 'default', variant: 'default' })
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
      expect(ctxValue).toMatchObject({ size: 'xs', variant: 'default' })
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
      expect(ctxValue).toMatchObject({ size: 'default', variant: 'dropdown' })
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
      expect(ctxValue).toMatchObject({ size: 'xs', variant: 'dropdown' })
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

    it('has data-slot on ComboboxChips container', () => {
      render(
        <Combobox items={fruits} multiple defaultValue={[{ label: 'Apple', value: 'apple' }]}>
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
      expect(getBySlot('combobox-chips')).toBeInTheDocument()
    })

    it('removes a chip when clicking the remove button', async () => {
      const user = userEvent.setup()
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
      // Should start with 2 chips
      expect(document.querySelectorAll('[data-slot="combobox-chip"]').length).toBe(2)

      // Click the first remove button
      const removeButtons = document.querySelectorAll('[data-slot="combobox-chip-remove"]')
      await user.click(removeButtons[0]!)

      // Should have 1 chip remaining
      await waitFor(() => {
        expect(document.querySelectorAll('[data-slot="combobox-chip"]').length).toBe(1)
      })
    })
  })
})
