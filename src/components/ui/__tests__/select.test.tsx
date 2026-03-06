import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../select'

describe('Select', () => {
  it('renders a trigger button', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'select-trigger')
  })

  it('applies default size classes to trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox').className).toContain('h-9')
  })

  it('applies sm size classes to trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit" size="sm">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox').className).toContain('h-8')
  })

  it('merges custom className on trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit" className="custom-class">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox').className).toContain('custom-class')
  })

  describe('SelectTrigger asChild', () => {
    it('renders child element instead of default trigger when asChild is true', () => {
      render(
        <Select>
          <SelectTrigger asChild>
            <button type="button" data-testid="custom-trigger">
              Pick fruit
            </button>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>,
      )
      const btn = screen.getByTestId('custom-trigger')
      expect(btn).toBeInTheDocument()
      expect(btn.textContent).toBe('Pick fruit')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Select>
          <SelectTrigger asChild>
            <button type="button" data-testid="custom-trigger">
              Pick fruit
            </button>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>,
      )
      const btn = screen.getByTestId('custom-trigger')
      expect(btn).toHaveAttribute('data-slot', 'select-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <Select>
          <SelectTrigger asChild className="custom-class">
            <button type="button" data-testid="custom-trigger">
              Pick fruit
            </button>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>,
      )
      const btn = screen.getByTestId('custom-trigger')
      expect(btn.className).toContain('custom-class')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLButtonElement>()
      render(
        <Select>
          <SelectTrigger asChild ref={ref}>
            <button type="button">Pick fruit</button>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>,
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  it('renders separator with data-slot', () => {
    render(<SelectSeparator data-testid="sep" />)
    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'select-separator')
  })

  it('renders group label', () => {
    render(
      <Select defaultValue="apple">
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('accepts position prop on SelectContent', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('accepts item-aligned position prop on SelectContent', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('accepts side prop on SelectContent', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('accepts align prop on SelectContent', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('accepts SelectScrollUpButton and SelectScrollDownButton without error', () => {
    // Scroll arrows only render visibly when popup is scrollable;
    // this test verifies they integrate without runtime errors
    render(
      <Select defaultOpen>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton />
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectScrollDownButton />
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    // Verify items render in the open popup
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })
})
