import type * as React from 'react'
import { cn } from '@/lib/utils'
import { CopyButton } from './copy-button'

type CommandBlockProps = Omit<
  React.ComponentProps<'div'>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  commands: string[]
  label?: string
}

function CommandBlock({ commands, label, className, ...props }: CommandBlockProps) {
  return (
    <div
      data-slot="command-block"
      className={cn('group relative border border-border bg-card', className)}
      {...props}
    >
      {label && (
        <div className="border-b border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 pr-14 text-sm leading-7">
        {commands.map((command, index) => (
          <code key={`${index}-${command}`} className="block">
            <span aria-hidden="true" className="select-none text-muted-foreground">
              ${' '}
            </span>
            {command}
          </code>
        ))}
      </pre>
      <CopyButton
        text={commands.join('\n')}
        className="absolute right-2 top-2 opacity-60 transition-opacity hover:opacity-100"
      />
    </div>
  )
}

export { CommandBlock }
export type { CommandBlockProps }
