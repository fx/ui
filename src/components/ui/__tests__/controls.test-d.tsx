import { assertType, describe, it } from 'vitest'
import {
  CommandBlock,
  type CommandBlockProps,
  CopyButton,
  type CopyButtonProps,
  ThemeToggle,
  type ThemeToggleProps,
} from '@/index'

describe('control props', () => {
  it('accepts ordinary button props', () => {
    assertType(<CopyButton text="hello" disabled className="custom" />)
    assertType(<ThemeToggle variant="outline" size="sm" />)
  })
  it('owns the content of each control', () => {
    assertType(<CommandBlock commands={['echo hello']} className="custom" />)
    // @ts-expect-error CopyButton owns its icon
    assertType(<CopyButton text="hello">Other content</CopyButton>)
    // @ts-expect-error ThemeToggle owns its icon
    assertType(<ThemeToggle>Other content</ThemeToggle>)
    // @ts-expect-error CommandBlock renders its commands as children
    assertType(<CommandBlock commands={['echo hello']}>Other content</CommandBlock>)
    assertType<CommandBlockProps>({
      commands: [],
      // @ts-expect-error CommandBlock renders its commands as children
      dangerouslySetInnerHTML: { __html: 'Other content' },
    })
    assertType<CopyButtonProps>({
      text: 'hello',
      // @ts-expect-error CopyButton renders its icon as a child
      dangerouslySetInnerHTML: { __html: 'Other content' },
    })
    // @ts-expect-error ThemeToggle renders its icon as a child
    assertType<ThemeToggleProps>({ dangerouslySetInnerHTML: { __html: 'Other content' } })
  })
  it('rejects polymorphic rendering props', () => {
    // @ts-expect-error CopyButton owns its interactive element
    assertType(<CopyButton text="hello" asChild />)
    // @ts-expect-error CopyButton owns its interactive element
    assertType(<CopyButton text="hello" render={<a href="/">Link</a>} />)
    // @ts-expect-error ThemeToggle owns its interactive element
    assertType(<ThemeToggle asChild />)
    // @ts-expect-error ThemeToggle owns its interactive element
    assertType(<ThemeToggle render={<a href="/">Link</a>} />)
  })
})
