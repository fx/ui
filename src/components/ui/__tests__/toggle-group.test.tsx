import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ToggleGroup, ToggleGroupItem } from '../toggle-group'

describe('ToggleGroup', () => {
  it('renders a group with items', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('has data-slot attributes', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('group')).toHaveAttribute('data-slot', 'toggle-group')
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'toggle-group-item')
  })

  it('handles single selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'A' }))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('handles multiple selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'A' }))
    expect(onValueChange).toHaveBeenCalledWith(['a'])
    await user.click(screen.getByRole('button', { name: 'B' }))
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b'])
  })

  it('deselects in single mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'A' }))
    await user.click(screen.getByRole('button', { name: 'A' }))
    expect(onValueChange).toHaveBeenLastCalledWith('')
  })

  it('inherits variant from group context', () => {
    render(
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('button').className).toContain('border')
  })

  it('inherits size from group context', () => {
    render(
      <ToggleGroup type="single" size="sm">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('button').className).toContain('h-8')
  })

  it('supports controlled value', () => {
    render(
      <ToggleGroup type="single" value="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('forwards ref on group', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ToggleGroup type="single" ref={ref}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  describe('Radix compat: type prop', () => {
    it('accepts type="single"', () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('group')).toBeInTheDocument()
    })

    it('accepts type="multiple"', () => {
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('group')).toBeInTheDocument()
    })
  })

  describe('Radix compat: value/defaultValue/onValueChange', () => {
    it('accepts defaultValue as string for single mode', async () => {
      const user = userEvent.setup()
      render(
        <ToggleGroup type="single" defaultValue="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'false')
      await user.click(screen.getByRole('button', { name: 'B' }))
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'false')
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true')
    })

    it('accepts defaultValue as array for multiple mode', () => {
      render(
        <ToggleGroup type="multiple" defaultValue={['a', 'b']}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('calls onValueChange with string in single mode', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(
        <ToggleGroup type="single" onValueChange={onValueChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      )
      await user.click(screen.getByRole('button', { name: 'A' }))
      expect(onValueChange).toHaveBeenCalledWith('a')
    })

    it('calls onValueChange with array in multiple mode', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(
        <ToggleGroup type="multiple" onValueChange={onValueChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      await user.click(screen.getByRole('button', { name: 'A' }))
      expect(onValueChange).toHaveBeenCalledWith(['a'])
    })

    it('supports controlled value as string in single mode', () => {
      const { rerender } = render(
        <ToggleGroup type="single" value="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
      rerender(
        <ToggleGroup type="single" value="b">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'false')
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true')
    })

    it('supports controlled value as array in multiple mode', () => {
      render(
        <ToggleGroup type="multiple" value={['a', 'b']}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('Radix compat: data-state on items', () => {
    it('items have data-state="on" when selected', () => {
      render(
        <ToggleGroup type="single" value="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('data-state', 'on')
      expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('data-state', 'off')
    })

    it('items toggle data-state on click', async () => {
      const user = userEvent.setup()
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      const buttonA = screen.getByRole('button', { name: 'A' })
      const buttonB = screen.getByRole('button', { name: 'B' })
      expect(buttonA).toHaveAttribute('data-state', 'off')
      expect(buttonB).toHaveAttribute('data-state', 'off')
      await user.click(buttonA)
      expect(buttonA).toHaveAttribute('data-state', 'on')
      expect(buttonB).toHaveAttribute('data-state', 'off')
      await user.click(buttonB)
      expect(buttonA).toHaveAttribute('data-state', 'off')
      expect(buttonB).toHaveAttribute('data-state', 'on')
    })
  })

  describe('Radix compat: deselection in multiple mode', () => {
    it('removes item from selection when clicked again', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(
        <ToggleGroup type="multiple" defaultValue={['a', 'b']} onValueChange={onValueChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      )
      await user.click(screen.getByRole('button', { name: 'A' }))
      expect(onValueChange).toHaveBeenCalledWith(['b'])
    })
  })

  it('forwards ref on item', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" ref={ref}>
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('item overrides group variant', () => {
    render(
      <ToggleGroup type="single" variant="default">
        <ToggleGroupItem value="a" variant="outline">
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('button').className).toContain('border')
  })
})
