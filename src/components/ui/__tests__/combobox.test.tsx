import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '../combobox'

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
})
