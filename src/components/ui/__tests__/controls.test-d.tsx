import { assertType, describe, it } from 'vitest'
import { CopyButton, ThemeToggle } from '@/index'

describe('control props', () => {
  it('accepts ordinary button props', () => {
    assertType(<CopyButton text="hello" disabled className="custom" />)
    assertType(<ThemeToggle variant="outline" size="sm" />)
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
