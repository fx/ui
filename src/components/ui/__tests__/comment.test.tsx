import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Comment,
  CommentAction,
  CommentAuthor,
  CommentBody,
  CommentFooter,
  CommentHeader,
  CommentMeta,
  commentVariants,
} from '../comment'

describe('Comment', () => {
  it('renders an article with data-slot', () => {
    render(<Comment aria-label="Comment by Ada Lovelace">Body</Comment>)
    const comment = screen.getByRole('article', { name: 'Comment by Ada Lovelace' })
    expect(comment).toHaveAttribute('data-slot', 'comment')
    expect(comment.className).toContain('bg-card')
    expect(comment.className).toContain('border-l-2')
  })

  it('defaults to a neutral stripe without highlight', () => {
    render(<Comment>Body</Comment>)
    const comment = screen.getByRole('article')
    expect(comment.className).toContain('border-l-border')
    expect(comment.className).not.toContain('ring-2')
  })

  it('applies the inverse accent', () => {
    render(<Comment accent="inverse">Body</Comment>)
    expect(screen.getByRole('article').className).toContain('border-l-foreground')
  })

  it.each([1, 2, 3, 4, 5, 6, 7, 8] as const)('applies identity accent %i', (accent) => {
    render(<Comment accent={accent}>Body</Comment>)
    const classes = screen.getByRole('article').className
    expect(classes).toContain(`border-l-identity-${accent}`)
    expect(classes).toContain('border-l-2')
  })

  it('highlights with a ring', () => {
    render(<Comment highlighted>Body</Comment>)
    const classes = screen.getByRole('article').className
    expect(classes).toContain('ring-2')
    expect(classes).toContain('ring-foreground')
  })

  it('merges custom className', () => {
    render(
      <Comment accent={3} className="custom-class border-l-4">
        Body
      </Comment>,
    )
    const classes = screen.getByRole('article').className
    expect(classes).toContain('custom-class')
    expect(classes).toContain('border-l-4')
    expect(classes).not.toContain('border-l-2')
    expect(classes).toContain('border-l-identity-3')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>()
    render(<Comment ref={ref}>Body</Comment>)
    expect(ref.current?.tagName).toBe('ARTICLE')
  })

  it('exposes its variants', () => {
    expect(commentVariants({ accent: 6, highlighted: true })).toContain('border-l-identity-6')
  })
})

describe('Comment parts', () => {
  const parts = [
    ['CommentHeader', CommentHeader, 'comment-header', 'bg-muted/50'],
    ['CommentAction', CommentAction, 'comment-action', 'ml-auto'],
    ['CommentBody', CommentBody, 'comment-body', 'px-3'],
    ['CommentFooter', CommentFooter, 'comment-footer', 'text-xs'],
  ] as const

  it.each(parts)('%s renders with data-slot and its layout', (_, Part, slot, layout) => {
    render(<Part data-testid="part">Content</Part>)
    const element = screen.getByTestId('part')
    expect(element).toHaveTextContent('Content')
    expect(element).toHaveAttribute('data-slot', slot)
    expect(element.className).toContain(layout)
  })

  it.each(parts)('%s merges className and forwards ref', (_, Part) => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Part ref={ref} className="custom-class">
        Content
      </Part>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.className).toContain('custom-class')
  })

  it('CommentHeader separates itself from the body without wrapping its action', () => {
    render(<CommentHeader data-testid="header" />)
    const classes = screen.getByTestId('header').className
    expect(classes).toContain('border-b')
    expect(classes).not.toContain('flex-wrap')
  })

  it('CommentHeader wraps author and meta in their own region and keeps the action pinned', () => {
    render(
      <CommentHeader data-testid="header">
        <CommentAuthor name="Ada Lovelace" meta="maintainer" />
        <CommentMeta>· 12 min ago</CommentMeta>
        <CommentAction data-testid="action">
          <button type="button">More</button>
        </CommentAction>
      </CommentHeader>,
    )
    const header = screen.getByTestId('header')
    const content = header.querySelector('[data-slot=comment-header-content]')
    const action = screen.getByTestId('action')
    expect(content).not.toBeNull()
    expect(content?.className).toContain('flex-wrap')
    expect(content?.className).toContain('flex-1')
    expect(content?.className).toContain('min-w-0')
    expect(content).toContainElement(screen.getByText('Ada Lovelace'))
    expect(content).toContainElement(screen.getByText('· 12 min ago'))
    expect(content).not.toContainElement(action)
    expect(action.parentElement).toBe(header)
    expect(header.lastElementChild).toBe(action)
    expect(action.className).toContain('shrink-0')
  })

  it('CommentHeader keeps a single region when there is no action', () => {
    render(
      <CommentHeader data-testid="header">
        <CommentAuthor name="Grace Hopper" />
      </CommentHeader>,
    )
    const header = screen.getByTestId('header')
    expect(header.children).toHaveLength(1)
    expect(header.firstElementChild).toHaveAttribute('data-slot', 'comment-header-content')
  })

  it('CommentMeta renders muted inline text', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <CommentMeta ref={ref} className="custom-class">
        12 min ago
      </CommentMeta>,
    )
    expect(ref.current?.tagName).toBe('SPAN')
    expect(ref.current).toHaveAttribute('data-slot', 'comment-meta')
    expect(ref.current?.className).toContain('text-muted-foreground')
    expect(ref.current?.className).toContain('custom-class')
  })

  it('CommentAuthor renders avatar, name and meta', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <CommentAuthor
        ref={ref}
        className="custom-class"
        avatar={<span data-testid="avatar" />}
        name="Ada Lovelace"
        meta="maintainer"
      />,
    )
    expect(ref.current).toHaveAttribute('data-slot', 'comment-author')
    expect(ref.current?.className).toContain('custom-class')
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    const name = screen.getByText('Ada Lovelace')
    expect(name.className).toContain('font-semibold')
    expect(name.className).not.toContain('text-muted-foreground')
    expect(screen.getByText('maintainer').className).toContain('text-muted-foreground')
  })

  it('CommentAuthor omits meta when absent', () => {
    const { container } = render(<CommentAuthor name="Grace Hopper" />)
    expect(container.querySelector('[data-slot=comment-author-meta]')).toBeNull()
  })
})
