import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'

describe('Tooltip', () => {
  describe('TooltipTrigger asChild', () => {
    it('renders child element instead of default button when asChild is true', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/info">Info Link</a>
            </TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )
      const link = screen.getByRole('link', { name: 'Info Link' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/info')
    })

    it('preserves data-slot attribute with asChild', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/info">Info Link</a>
            </TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )
      const link = screen.getByRole('link', { name: 'Info Link' })
      expect(link).toHaveAttribute('data-slot', 'tooltip-trigger')
    })

    it('merges custom className with asChild', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="custom-trigger">
              <a href="/info">Info Link</a>
            </TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )
      const link = screen.getByRole('link', { name: 'Info Link' })
      expect(link.className).toContain('custom-trigger')
    })

    it('forwards ref when asChild is true', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild ref={ref}>
              <a href="/info">Info Link</a>
            </TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  it('renders trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('has data-slot on trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'tooltip-trigger')
  })

  it('shows tooltip content on hover', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    await user.hover(screen.getByText('Hover me'))
    expect(await screen.findByText('Tooltip text')).toBeInTheDocument()
  })

  it('merges custom className on trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="custom-class" data-testid="trigger">
            Hover
          </TooltipTrigger>
          <TooltipContent>Tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByTestId('trigger').className).toContain('custom-class')
  })
})
