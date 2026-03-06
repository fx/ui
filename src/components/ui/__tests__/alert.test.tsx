import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Alert, AlertDescription, AlertTitle } from '../alert'

describe('Alert', () => {
  it('renders with children', () => {
    render(<Alert>Alert content</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Alert>Alert</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert')
  })

  it('has role=alert', () => {
    render(<Alert>Alert</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Alert>Default</Alert>)
    expect(screen.getByRole('alert').className).toContain('bg-card')
  })

  it('applies destructive variant', () => {
    render(<Alert variant="destructive">Error</Alert>)
    expect(screen.getByRole('alert').className).toContain('text-destructive')
  })

  it('applies success variant', () => {
    render(<Alert variant="success">Success</Alert>)
    expect(screen.getByRole('alert').className).toContain('text-emerald-600')
  })

  it('applies warning variant', () => {
    render(<Alert variant="warning">Warning</Alert>)
    expect(screen.getByRole('alert').className).toContain('text-amber-600')
  })

  it('applies info variant', () => {
    render(<Alert variant="info">Info</Alert>)
    expect(screen.getByRole('alert').className).toContain('text-blue-600')
  })

  it('merges custom className', () => {
    render(<Alert className="custom-class">Alert</Alert>)
    expect(screen.getByRole('alert').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Alert ref={ref}>Alert</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('AlertTitle', () => {
  it('renders with children', () => {
    render(<AlertTitle>Title</AlertTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>)
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'alert-title')
  })

  it('has font-medium class', () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>)
    expect(screen.getByTestId('title').className).toContain('font-medium')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<AlertTitle ref={ref}>Title</AlertTitle>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('AlertDescription', () => {
  it('renders with children', () => {
    render(<AlertDescription>Description</AlertDescription>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<AlertDescription data-testid="desc">Description</AlertDescription>)
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'alert-description')
  })

  it('has muted foreground text', () => {
    render(<AlertDescription data-testid="desc">Description</AlertDescription>)
    expect(screen.getByTestId('desc').className).toContain('text-muted-foreground')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<AlertDescription ref={ref}>Description</AlertDescription>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('Alert composition', () => {
  it('renders with icon, title, and description', () => {
    render(
      <Alert variant="destructive">
        <svg data-testid="icon" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
  })
})
