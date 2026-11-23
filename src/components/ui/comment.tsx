import { cva } from 'class-variance-authority'
import * as React from 'react'
import type { IdentityTone } from '@/lib/identity'
import { cn } from '@/lib/utils'

type CommentAccent = 'neutral' | 'inverse' | IdentityTone

const commentVariants = cva(
  'flex min-w-0 flex-col border border-l-2 bg-card text-card-foreground',
  {
    variants: {
      accent: {
        neutral: 'border-l-border',
        inverse: 'border-l-foreground',
        1: 'border-l-identity-1',
        2: 'border-l-identity-2',
        3: 'border-l-identity-3',
        4: 'border-l-identity-4',
        5: 'border-l-identity-5',
        6: 'border-l-identity-6',
        7: 'border-l-identity-7',
        8: 'border-l-identity-8',
      },
      highlighted: {
        true: 'ring-2 ring-foreground',
        false: '',
      },
    },
    defaultVariants: {
      accent: 'neutral',
      highlighted: false,
    },
  },
)

interface CommentProps extends React.HTMLAttributes<HTMLElement> {
  /** Colour of the left stripe, usually the author's identity tone. */
  accent?: CommentAccent
  /** Draw a ring around the comment, e.g. when it is the linked target. */
  highlighted?: boolean
  ref?: React.Ref<HTMLElement>
}

/** A bordered comment card with an accent stripe; compose it with the Comment* parts. */
function Comment({ accent, highlighted, className, ref, ...props }: CommentProps) {
  return (
    <article
      ref={ref}
      data-slot="comment"
      className={cn(commentVariants({ accent, highlighted }), className)}
      {...props}
    />
  )
}

interface CommentHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * The comment's header row. Direct `CommentAction` children stay pinned at the end while the
 * rest (author, meta, time) wraps inside its own region on narrow screens.
 */
function CommentHeader({ className, ref, children, ...props }: CommentHeaderProps) {
  const content: React.ReactNode[] = []
  const actions: React.ReactNode[] = []
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement(child) && child.type === CommentAction) actions.push(child)
    else content.push(child)
  }
  return (
    <div
      ref={ref}
      data-slot="comment-header"
      className={cn('flex min-w-0 items-start gap-2 border-b bg-muted/50 px-3 py-2', className)}
      {...props}
    >
      <div
        data-slot="comment-header-content"
        className="flex min-h-6 min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 [overflow-wrap:anywhere]"
      >
        {content}
      </div>
      {actions}
    </div>
  )
}

interface CommentAuthorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  avatar?: React.ReactNode
  name: React.ReactNode
  /** Secondary detail shown inline after the name, e.g. a role or handle. */
  meta?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function CommentAuthor({ avatar, name, meta, className, ref, ...props }: CommentAuthorProps) {
  return (
    <div
      ref={ref}
      data-slot="comment-author"
      className={cn('flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1', className)}
      {...props}
    >
      {avatar}
      <span
        data-slot="comment-author-name"
        className="min-w-0 text-sm font-semibold text-foreground"
      >
        {name}
      </span>
      {meta !== undefined && meta !== null && (
        <span data-slot="comment-author-meta" className="min-w-0 text-xs text-muted-foreground">
          {meta}
        </span>
      )}
    </div>
  )
}

interface CommentMetaProps extends React.HTMLAttributes<HTMLSpanElement> {
  ref?: React.Ref<HTMLSpanElement>
}

function CommentMeta({ className, ref, ...props }: CommentMetaProps) {
  return (
    <span
      ref={ref}
      data-slot="comment-meta"
      className={cn('min-w-0 text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

interface CommentActionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function CommentAction({ className, ref, ...props }: CommentActionProps) {
  return (
    <div
      ref={ref}
      data-slot="comment-action"
      className={cn('ml-auto flex min-h-6 shrink-0 items-center gap-1', className)}
      {...props}
    />
  )
}

interface CommentBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function CommentBody({ className, ref, ...props }: CommentBodyProps) {
  return (
    <div
      ref={ref}
      data-slot="comment-body"
      className={cn('min-w-0 px-3 py-3 text-sm', className)}
      {...props}
    />
  )
}

interface CommentFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function CommentFooter({ className, ref, ...props }: CommentFooterProps) {
  return (
    <div
      ref={ref}
      data-slot="comment-footer"
      className={cn('px-3 pb-3 text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Comment,
  CommentAction,
  CommentAuthor,
  CommentBody,
  CommentFooter,
  CommentHeader,
  CommentMeta,
  commentVariants,
}
export type {
  CommentAccent,
  CommentActionProps,
  CommentAuthorProps,
  CommentBodyProps,
  CommentFooterProps,
  CommentHeaderProps,
  CommentMetaProps,
  CommentProps,
}
