import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../dropdown-menu'

describe('DropdownMenu', () => {
  describe('DropdownMenuTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <a href="/menu">Menu Link</a>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )
      const link = screen.getByRole('link', { name: 'Menu Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/menu')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <a href="/menu">Menu Link</a>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )
      const link = screen.getByRole('link', { name: 'Menu Link' })
      expect(link).toHaveAttribute('data-slot', 'dropdown-menu-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="custom-trigger">
            <a href="/menu">Menu Link</a>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )
      const link = screen.getByRole('link', { name: 'Menu Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild ref={ref}>
            <a href="/menu">Menu Link</a>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('DropdownMenuSubTrigger asChild', () => {
    it('renders child element instead of default when asChild is true', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger asChild>
                <div data-testid="custom-sub">Sub Custom</div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )
      const el = screen.getByTestId('custom-sub')
      expect(el).toBeInTheDocument()
      expect(el.tagName).toBe('DIV')
      expect(el.textContent).toBe('Sub Custom')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger asChild>
                <div data-testid="custom-sub">Sub Custom</div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      )
      const el = screen.getByTestId('custom-sub')
      expect(el).toHaveAttribute('data-slot', 'dropdown-menu-sub-trigger')
    })
  })

  it('renders trigger button', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'data-slot',
      'dropdown-menu-trigger',
    )
  })

  it('renders menu items when open', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders separator with data-slot', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="sep" />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'dropdown-menu-separator')
  })

  it('renders shortcut with data-slot', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Save
            <DropdownMenuShortcut data-testid="shortcut">Ctrl+S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('shortcut')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut')
  })

  it('renders group and label with data-slots', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup data-testid="group">
            <DropdownMenuLabel data-testid="label">Group</DropdownMenuLabel>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'dropdown-menu-group')
    expect(screen.getByTestId('label')).toHaveAttribute('data-slot', 'dropdown-menu-label')
  })

  it('renders checkbox item with data-slot', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked data-testid="checkbox">
            Show Toolbar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('checkbox')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-checkbox-item',
    )
  })

  it('renders radio group and items with data-slots', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup data-testid="radio-group" value="a">
            <DropdownMenuRadioItem data-testid="radio-item" value="a">
              A
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('radio-group')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-radio-group',
    )
    expect(screen.getByTestId('radio-item')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-radio-item',
    )
  })

  it('applies destructive variant to item', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive" data-testid="item">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('item').className).toContain('text-destructive')
  })

  it('applies inset to item', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset data-testid="item">
            Inset Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expect(screen.getByTestId('item').className).toContain('pl-8')
  })

  it('merges custom className on trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-class">Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByRole('button', { name: 'Menu' }).className).toContain('custom-class')
  })
})
