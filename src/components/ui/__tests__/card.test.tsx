import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card'

describe('Card', () => {
  it('renders with children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card')
  })

  it('merges custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>,
    )
    expect(screen.getByTestId('card').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has border class', () => {
    render(<Card data-testid="card">Content</Card>)
    const el = screen.getByTestId('card')
    expect(el.className).toContain('border')
  })
})

describe('CardHeader', () => {
  it('renders with children', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
  })

  it('has container query class', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header').className).toContain('@container/card-header')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<CardHeader ref={ref}>Header</CardHeader>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardTitle', () => {
  it('renders with children', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'card-title')
  })

  it('has font-semibold class', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title').className).toContain('font-semibold')
  })
})

describe('CardDescription', () => {
  it('renders with children', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description')
  })

  it('has muted foreground text', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc').className).toContain('text-muted-foreground')
  })
})

describe('CardAction', () => {
  it('renders with children', () => {
    render(<CardAction>Action</CardAction>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardAction data-testid="action">Action</CardAction>)
    expect(screen.getByTestId('action')).toHaveAttribute('data-slot', 'card-action')
  })

  it('is positioned in grid column 2', () => {
    render(<CardAction data-testid="action">Action</CardAction>)
    expect(screen.getByTestId('action').className).toContain('col-start-2')
  })
})

describe('CardContent', () => {
  it('renders with children', () => {
    render(<CardContent>Body</CardContent>)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardContent data-testid="content">Body</CardContent>)
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content')
  })

  it('has horizontal padding', () => {
    render(<CardContent data-testid="content">Body</CardContent>)
    expect(screen.getByTestId('content').className).toContain('px-6')
  })
})

describe('CardFooter', () => {
  it('renders with children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer')
  })

  it('has flex layout', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer').className).toContain('flex')
  })
})

describe('Card composition', () => {
  it('renders all subcomponents together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
