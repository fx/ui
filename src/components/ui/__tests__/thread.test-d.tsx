import { assertType, describe, it } from 'vitest'
import { Avatar, Comment, Thread, ThreadExpander, type ThreadExpanderProps } from '@/index'

describe('comment thread props', () => {
  it('requires an accessible name on Thread', () => {
    assertType(<Thread aria-label="Comments" />)
    assertType(<Thread aria-labelledby="heading" />)
    // @ts-expect-error Thread needs aria-label or aria-labelledby
    assertType(<Thread />)
  })

  it('accepts only known tones and accents', () => {
    assertType(<Avatar label="Ada Lovelace" tone={8} />)
    assertType(<Comment accent="inverse" highlighted />)
    // @ts-expect-error identity tones stop at 8
    assertType(<Avatar label="Ada Lovelace" tone={9} />)
    // @ts-expect-error unknown accent
    assertType(<Comment accent="primary" />)
    // @ts-expect-error Avatar needs a label
    assertType(<Avatar />)
  })

  it('owns the expander content and click handler', () => {
    assertType(<ThreadExpander count={2} onExpand={() => {}} />)
    assertType<ThreadExpanderProps>({
      count: 2,
      onExpand: () => {},
      // @ts-expect-error the label is rendered from count
      children: 'Show',
    })
  })
})
