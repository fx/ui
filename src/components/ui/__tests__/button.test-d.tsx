import { createRef } from 'react'
import { assertType, describe, it } from 'vitest'
import { Button, type ButtonProps } from '@/index'

describe('ButtonProps', () => {
  it('accepts children and className', () => {
    assertType(<Button className="custom">Click me</Button>)
  })

  it('accepts native button attributes', () => {
    assertType(
      <Button type="submit" disabled onClick={() => {}} aria-label="Submit">
        Submit
      </Button>,
    )
    assertType(<Button ref={createRef<HTMLButtonElement>()}>Ref</Button>)
  })

  it('accepts the Base UI render prop', () => {
    assertType(<Button nativeButton={false} render={<a href="/home">Go home</a>} />)
  })

  it('accepts the Radix-compatible asChild prop', () => {
    assertType(
      <Button asChild>
        <a href="/home">Go home</a>
      </Button>,
    )
  })

  it('accepts variant and size', () => {
    assertType(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
  })

  it('rejects an unknown variant', () => {
    // @ts-expect-error 'ghostly' is not one of the declared variants
    assertType(<Button variant="ghostly">Nope</Button>)
  })

  it('exposes the props as a usable object type', () => {
    assertType<ButtonProps>({
      children: 'Click me',
      className: 'custom',
      variant: 'outline',
      size: 'sm',
      onClick: () => {},
    })
  })
})
