import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '../menubar'

describe('Menubar', () => {
  it('renders the menubar container', () => {
    render(
      <Menubar data-testid="menubar">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    expect(screen.getByTestId('menubar')).toBeInTheDocument()
  })

  it('has data-slot on menubar container', () => {
    render(
      <Menubar data-testid="menubar">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    expect(screen.getByTestId('menubar')).toHaveAttribute('data-slot', 'menubar')
  })

  it('renders trigger button', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    expect(screen.getByRole('button', { name: 'File' })).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    expect(screen.getByRole('button', { name: 'File' })).toHaveAttribute(
      'data-slot',
      'menubar-trigger',
    )
  })

  it('renders menu items when open', () => {
    render(
      <Menubar>
        <MenubarMenu open>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Open File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )

    expect(screen.getByText('New File')).toBeInTheDocument()
    expect(screen.getByText('Open File')).toBeInTheDocument()
  })

  describe('MenubarTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild>
              <a href="/file">File Link</a>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )
      const link = screen.getByRole('link', { name: 'File Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/file')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild>
              <a href="/file">File Link</a>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )
      const link = screen.getByRole('link', { name: 'File Link' })
      expect(link).toHaveAttribute('data-slot', 'menubar-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild className="custom-trigger">
              <a href="/file">File Link</a>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )
      const link = screen.getByRole('link', { name: 'File Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild ref={ref}>
              <a href="/file">File Link</a>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders multiple menu triggers', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Copy</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    expect(screen.getByRole('button', { name: 'File' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('renders separator with data-slot', () => {
    render(
      <Menubar>
        <MenubarMenu open>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Item 1</MenubarItem>
            <MenubarSeparator data-testid="sep" />
            <MenubarItem>Item 2</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )

    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'menubar-separator')
  })

  it('renders shortcut with data-slot', () => {
    render(
      <Menubar>
        <MenubarMenu open>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Save
              <MenubarShortcut data-testid="shortcut">Ctrl+S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )

    expect(screen.getByTestId('shortcut')).toHaveAttribute('data-slot', 'menubar-shortcut')
  })

  it('renders label with data-slot', () => {
    render(
      <Menubar>
        <MenubarMenu open>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel data-testid="label">Label</MenubarLabel>
            <MenubarItem>Item</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )

    expect(screen.getByTestId('label')).toHaveAttribute('data-slot', 'menubar-label')
  })

  it('renders checkbox item with data-slot', () => {
    render(
      <Menubar>
        <MenubarMenu open>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked data-testid="checkbox">
              Show Toolbar
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )

    expect(screen.getByTestId('checkbox')).toHaveAttribute('data-slot', 'menubar-checkbox-item')
  })

  it('renders radio group and items with data-slots', () => {
    render(
      <Menubar>
        <MenubarMenu open>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup data-testid="radio-group" value="a">
              <MenubarRadioItem data-testid="radio-item" value="a">
                A
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )

    expect(screen.getByTestId('radio-group')).toHaveAttribute('data-slot', 'menubar-radio-group')
    expect(screen.getByTestId('radio-item')).toHaveAttribute('data-slot', 'menubar-radio-item')
  })

  it('merges custom className on menubar container', () => {
    render(
      <Menubar className="custom-class" data-testid="menubar">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Item</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    )
    expect(screen.getByTestId('menubar').className).toContain('custom-class')
  })
})
