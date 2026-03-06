import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'

describe('Table', () => {
  it('renders a table element', () => {
    render(<Table data-testid="table" />)
    expect(screen.getByTestId('table').tagName).toBe('TABLE')
  })

  it('has data-slot attribute', () => {
    render(<Table data-testid="table" />)
    expect(screen.getByTestId('table')).toHaveAttribute('data-slot', 'table')
  })

  it('wrapper has border class', () => {
    render(<Table data-testid="table" />)
    const wrapper = screen.getByTestId('table').parentElement
    expect(wrapper?.className).toContain('border')
  })

  it('is wrapped in a scroll container', () => {
    render(<Table data-testid="table" />)
    const wrapper = screen.getByTestId('table').parentElement
    expect(wrapper).toHaveAttribute('data-slot', 'table-wrapper')
    expect(wrapper?.className).toContain('overflow-x-auto')
  })

  it('merges custom className', () => {
    render(<Table className="custom-class" data-testid="table" />)
    expect(screen.getByTestId('table').className).toContain('custom-class')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLTableElement>()
    render(<Table ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })
})

describe('TableHeader', () => {
  it('renders a thead element', () => {
    render(
      <table>
        <TableHeader data-testid="header" />
      </table>,
    )
    expect(screen.getByTestId('header').tagName).toBe('THEAD')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <TableHeader data-testid="header" />
      </table>,
    )
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'table-header')
  })

  it('has bg-muted/50 class', () => {
    render(
      <table>
        <TableHeader data-testid="header" />
      </table>,
    )
    expect(screen.getByTestId('header').className).toContain('bg-muted/50')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLTableSectionElement>()
    render(
      <table>
        <TableHeader ref={ref} />
      </table>,
    )
    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement)
  })
})

describe('TableBody', () => {
  it('renders a tbody element', () => {
    render(
      <table>
        <TableBody data-testid="body" />
      </table>,
    )
    expect(screen.getByTestId('body').tagName).toBe('TBODY')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <TableBody data-testid="body" />
      </table>,
    )
    expect(screen.getByTestId('body')).toHaveAttribute('data-slot', 'table-body')
  })
})

describe('TableFooter', () => {
  it('renders a tfoot element', () => {
    render(
      <table>
        <TableFooter data-testid="footer" />
      </table>,
    )
    expect(screen.getByTestId('footer').tagName).toBe('TFOOT')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <TableFooter data-testid="footer" />
      </table>,
    )
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'table-footer')
  })

  it('has bg-muted/50 class', () => {
    render(
      <table>
        <TableFooter data-testid="footer" />
      </table>,
    )
    expect(screen.getByTestId('footer').className).toContain('bg-muted/50')
  })
})

describe('TableRow', () => {
  it('renders a tr element', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="row" />
        </tbody>
      </table>,
    )
    expect(screen.getByTestId('row').tagName).toBe('TR')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="row" />
        </tbody>
      </table>,
    )
    expect(screen.getByTestId('row')).toHaveAttribute('data-slot', 'table-row')
  })

  it('has hover class', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="row" />
        </tbody>
      </table>,
    )
    expect(screen.getByTestId('row').className).toContain('hover:bg-muted/50')
  })
})

describe('TableHead', () => {
  it('renders a th element', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="head">Header</TableHead>
          </tr>
        </thead>
      </table>,
    )
    expect(screen.getByTestId('head').tagName).toBe('TH')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="head">Header</TableHead>
          </tr>
        </thead>
      </table>,
    )
    expect(screen.getByTestId('head')).toHaveAttribute('data-slot', 'table-head')
  })

  it('has text-foreground class', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="head">Header</TableHead>
          </tr>
        </thead>
      </table>,
    )
    expect(screen.getByTestId('head').className).toContain('text-foreground')
  })

  it('has text-left alignment', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="head">Header</TableHead>
          </tr>
        </thead>
      </table>,
    )
    expect(screen.getByTestId('head').className).toContain('text-left')
  })
})

describe('TableCell', () => {
  it('renders a td element', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="cell">Data</TableCell>
          </tr>
        </tbody>
      </table>,
    )
    expect(screen.getByTestId('cell').tagName).toBe('TD')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="cell">Data</TableCell>
          </tr>
        </tbody>
      </table>,
    )
    expect(screen.getByTestId('cell')).toHaveAttribute('data-slot', 'table-cell')
  })
})

describe('TableCaption', () => {
  it('renders a caption element', () => {
    render(
      <table>
        <TableCaption data-testid="caption">A caption</TableCaption>
      </table>,
    )
    expect(screen.getByTestId('caption').tagName).toBe('CAPTION')
  })

  it('has data-slot attribute', () => {
    render(
      <table>
        <TableCaption data-testid="caption">A caption</TableCaption>
      </table>,
    )
    expect(screen.getByTestId('caption')).toHaveAttribute('data-slot', 'table-caption')
  })

  it('has muted foreground text', () => {
    render(
      <table>
        <TableCaption data-testid="caption">A caption</TableCaption>
      </table>,
    )
    expect(screen.getByTestId('caption').className).toContain('text-muted-foreground')
  })
})

describe('Table composition', () => {
  it('renders a full table structure', () => {
    render(
      <Table>
        <TableCaption>User list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>alice@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: 1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )

    expect(screen.getByText('User list')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })
})
