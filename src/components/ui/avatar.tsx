import { cva } from 'class-variance-authority'
import type * as React from 'react'
import type { IdentityTone } from '@/lib/identity'
import { cn } from '@/lib/utils'

type AvatarTone = 'neutral' | 'inverse' | IdentityTone

const avatarVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-semibold uppercase leading-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground',
        inverse: 'bg-foreground text-background',
        1: 'bg-identity-1 text-identity-1-foreground',
        2: 'bg-identity-2 text-identity-2-foreground',
        3: 'bg-identity-3 text-identity-3-foreground',
        4: 'bg-identity-4 text-identity-4-foreground',
        5: 'bg-identity-5 text-identity-5-foreground',
        6: 'bg-identity-6 text-identity-6-foreground',
        7: 'bg-identity-7 text-identity-7-foreground',
        8: 'bg-identity-8 text-identity-8-foreground',
      },
      size: {
        sm: 'size-5 text-[0.625rem] [&_svg]:size-3',
        md: 'size-7 text-xs [&_svg]:size-4',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  },
)

interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Accessible name, e.g. the person's display name. Also the source of default initials. */
  label: string
  /** Up to two characters shown in place of the derived initials. */
  initials?: string
  /** Icon shown in place of initials. */
  icon?: React.ReactNode
  tone?: AvatarTone
  size?: 'sm' | 'md'
  /** Hide the avatar from assistive technology when a visible name sits next to it. */
  decorative?: boolean
  ref?: React.Ref<HTMLSpanElement>
}

function initialsOf(label: string): string {
  const words = label.trim().split(/\s+/).filter(Boolean)
  const first = words[0]
  if (!first) return ''
  const last = words.length > 1 ? words[words.length - 1] : undefined
  const chars = last ? [Array.from(first)[0], Array.from(last)[0]] : Array.from(first).slice(0, 2)
  return chars.join('').toUpperCase()
}

/**
 * A square avatar showing initials or an icon, optionally filled with an identity tone.
 */
function Avatar({
  label,
  initials,
  icon,
  tone,
  size,
  decorative = false,
  className,
  ref,
  ...props
}: AvatarProps) {
  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': label } as const)
  const text =
    initials === undefined
      ? initialsOf(label)
      : Array.from(initials).slice(0, 2).join('').toUpperCase()
  return (
    <span
      ref={ref}
      data-slot="avatar"
      className={cn(avatarVariants({ tone, size }), className)}
      {...a11y}
      {...props}
    >
      {icon ?? text}
    </span>
  )
}

export { Avatar, avatarVariants }
export type { AvatarProps, AvatarTone }
