import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible'

describe('Collapsible', () => {
  it('renders with children', () => {
    render(
      <Collapsible>
        <div>Content</div>
      </Collapsible>,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(
      <Collapsible data-testid="collapsible">
        <div>Content</div>
      </Collapsible>,
    )
    expect(screen.getByTestId('collapsible')).toHaveAttribute('data-slot', 'collapsible')
  })
})

describe('CollapsibleTrigger', () => {
  describe('asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <a href="/toggle">Toggle Link</a>
          </CollapsibleTrigger>
        </Collapsible>,
      )
      const link = screen.getByRole('link', { name: 'Toggle Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/toggle')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <a href="/toggle">Toggle Link</a>
          </CollapsibleTrigger>
        </Collapsible>,
      )
      const link = screen.getByRole('link', { name: 'Toggle Link' })
      expect(link).toHaveAttribute('data-slot', 'collapsible-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Collapsible>
          <CollapsibleTrigger asChild ref={ref}>
            <a href="/toggle">Toggle Link</a>
          </CollapsibleTrigger>
        </Collapsible>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders a button', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      </Collapsible>,
    )
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      </Collapsible>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'collapsible-trigger')
  })
})

describe('CollapsibleContent', () => {
  it('renders content when open', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel content</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByText('Panel content')).toBeInTheDocument()
  })

  it('has data-slot attribute when open', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">Panel content</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'collapsible-content')
  })

  it('has animation classes', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">Panel content</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByTestId('content').className).toContain('overflow-hidden')
  })
})

describe('Collapsible interaction', () => {
  it('toggles content visibility on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel content</CollapsibleContent>
      </Collapsible>,
    )

    // Content should be hidden initially
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()

    // Click trigger to open
    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByText('Panel content')).toBeInTheDocument()

    // Click trigger to close
    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    // After closing, content should be removed
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()
  })

  it('supports controlled open state', () => {
    render(
      <Collapsible open>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel content</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByText('Panel content')).toBeInTheDocument()
  })

  it('supports disabled state', () => {
    render(
      <Collapsible disabled>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel content</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
