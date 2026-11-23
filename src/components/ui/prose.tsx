import { cva } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

const proseVariants = cva(
  [
    'prose max-w-none [overflow-wrap:anywhere]',
    '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
    'prose-a:underline-offset-2',
    'prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-normal',
    'prose-pre:whitespace-pre-wrap prose-pre:border prose-pre:rounded-none prose-pre:text-xs',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  ],
  {
    variants: {
      size: {
        sm: 'prose-sm',
        base: 'prose-base',
      },
      compactHeadings: {
        true: [
          'prose-h1:text-sm prose-h1:font-semibold prose-h1:mt-3 prose-h1:mb-1',
          'prose-h2:text-sm prose-h2:font-semibold prose-h2:mt-3 prose-h2:mb-1',
          'prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-1',
          'prose-h4:text-sm prose-h4:font-medium prose-h4:mt-3 prose-h4:mb-1',
          '[&_:is(h5,h6)]:text-sm [&_:is(h5,h6)]:font-medium [&_:is(h5,h6)]:mt-3 [&_:is(h5,h6)]:mb-1',
        ],
        false: '',
      },
    },
    defaultVariants: {
      size: 'base',
      compactHeadings: false,
    },
  },
)

interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'base'
  /** Keep headings at body size so rendered content never outweighs a surrounding header. */
  compactHeadings?: boolean
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Typography wrapper for rich text (rendered Markdown, articles) whose colours follow the
 * theme tokens. It styles React children only; parse Markdown or HTML into React nodes first.
 */
function Prose({ size, compactHeadings, className, ref, ...props }: ProseProps) {
  return (
    <div
      ref={ref}
      data-slot="prose"
      className={cn(proseVariants({ size, compactHeadings }), className)}
      {...props}
    />
  )
}

export { Prose, proseVariants }
export type { ProseProps }
