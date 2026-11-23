import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Prose, proseVariants } from '../prose'

describe('Prose', () => {
  it('renders its content', () => {
    render(
      <Prose>
        <h2>Heading</h2>
        <p>Paragraph</p>
      </Prose>,
    )
    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
  })

  it('has data-slot attribute and typography classes', () => {
    render(<Prose data-testid="prose">Text</Prose>)
    const prose = screen.getByTestId('prose')
    expect(prose).toHaveAttribute('data-slot', 'prose')
    expect(prose.className).toContain('prose')
    expect(prose.className).toContain('max-w-none')
    expect(prose.className).toContain('[overflow-wrap:anywhere]')
    expect(prose.className).toContain('prose-code:before:content-none')
    expect(prose.className).toContain('prose-pre:whitespace-pre-wrap')
  })

  it('defaults to the base size without compact headings', () => {
    render(<Prose data-testid="prose">Text</Prose>)
    const prose = screen.getByTestId('prose')
    expect(prose.className).toContain('prose-base')
    expect(prose.className).not.toContain('prose-h1:text-sm')
  })

  it('applies the small size', () => {
    render(
      <Prose size="sm" data-testid="prose">
        Text
      </Prose>,
    )
    expect(screen.getByTestId('prose').className).toContain('prose-sm')
    expect(screen.getByTestId('prose').className).not.toContain('prose-base')
  })

  it('compacts headings to body size', () => {
    render(
      <Prose compactHeadings data-testid="prose">
        Text
      </Prose>,
    )
    const classes = screen.getByTestId('prose').className
    for (const level of [1, 2, 3]) {
      expect(classes).toContain(`prose-h${level}:text-sm`)
      expect(classes).toContain(`prose-h${level}:font-semibold`)
    }
    expect(classes).toContain('prose-h4:font-medium')
    expect(classes).toContain('[&_:is(h5,h6)]:font-medium')
  })

  it('merges custom className', () => {
    render(
      <Prose className="custom-class" data-testid="prose">
        Text
      </Prose>,
    )
    expect(screen.getByTestId('prose').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Prose ref={ref}>Text</Prose>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('exposes its variants', () => {
    expect(proseVariants({ size: 'sm' })).toContain('prose-sm')
  })
})
