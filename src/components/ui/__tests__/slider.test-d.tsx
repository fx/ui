import type { Slider as BaseSlider } from '@base-ui-components/react/slider'
import { createRef } from 'react'
import { assertType, describe, expectTypeOf, it } from 'vitest'
import { Slider, type SliderProps } from '@/index'

describe('Slider public types', () => {
  it('defaults to scalar values and preserves native event types', () => {
    assertType(
      <Slider
        onValueChange={(value, details) => {
          expectTypeOf(value).toEqualTypeOf<number>()
          expectTypeOf(details).toEqualTypeOf<BaseSlider.Root.ChangeEventDetails>()
        }}
        onValueCommitted={(value, details) => {
          expectTypeOf(value).toEqualTypeOf<number>()
          expectTypeOf(details).toEqualTypeOf<BaseSlider.Root.CommitEventDetails>()
        }}
      />,
    )
    assertType<SliderProps>({ defaultValue: 20, ref: createRef<HTMLDivElement>() })
  })

  it('infers scalars from value and defaultValue without narrowing callbacks to literals', () => {
    assertType(
      <Slider value={20} onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<number>()} />,
    )
    assertType(
      <Slider
        defaultValue={20}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<number>()}
      />,
    )
  })

  it('infers mutable arrays in both callbacks and modes', () => {
    const values = [20, 80]
    assertType(
      <Slider
        value={values}
        onValueChange={(value, details) => {
          expectTypeOf(value).toEqualTypeOf<number[]>()
          expectTypeOf(details).toEqualTypeOf<BaseSlider.Root.ChangeEventDetails>()
        }}
        onValueCommitted={(value, details) => {
          expectTypeOf(value).toEqualTypeOf<number[]>()
          expectTypeOf(details).toEqualTypeOf<BaseSlider.Root.CommitEventDetails>()
        }}
      />,
    )
    assertType(
      <Slider
        defaultValue={values}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<number[]>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<number[]>()}
      />,
    )
  })

  it('preserves readonly array and tuple inference', () => {
    const values: readonly number[] = [20, 80]
    assertType(
      <Slider
        value={values}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<readonly number[]>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<readonly number[]>()}
      />,
    )
    const tuple = [20, 80] as const
    assertType(
      <Slider
        defaultValue={tuple}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<typeof tuple>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<typeof tuple>()}
      />,
    )
    assertType<SliderProps<readonly number[]>>({ value: values })
    assertType<SliderProps<number[]>>({ defaultValue: [20] })
  })

  it('preserves single-element array inference in both callbacks and modes', () => {
    const values: readonly number[] = [40]
    assertType(
      <Slider
        defaultValue={values}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<readonly number[]>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<readonly number[]>()}
      />,
    )
    assertType(
      <Slider
        value={values}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<readonly number[]>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<readonly number[]>()}
      />,
    )
    assertType(
      <Slider
        value={[40]}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<number[]>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<number[]>()}
      />,
    )
    assertType(
      <Slider
        defaultValue={[40]}
        onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<number[]>()}
        onValueCommitted={(value) => expectTypeOf(value).toEqualTypeOf<number[]>()}
      />,
    )
  })

  it('exposes thumb accessibility functions, root state classes and div refs', () => {
    expectTypeOf<SliderProps['getAriaLabel']>().toEqualTypeOf<
      BaseSlider.Thumb.Props['getAriaLabel']
    >()
    expectTypeOf<SliderProps['getAriaValueText']>().toEqualTypeOf<
      BaseSlider.Thumb.Props['getAriaValueText']
    >()
    assertType(
      <Slider
        ref={createRef<HTMLDivElement>()}
        getAriaLabel={(index) => {
          expectTypeOf(index).toEqualTypeOf<number>()
          return `Value ${index}`
        }}
        getAriaValueText={(formatted, value, index) => {
          expectTypeOf(formatted).toEqualTypeOf<string>()
          expectTypeOf(value).toEqualTypeOf<number>()
          expectTypeOf(index).toEqualTypeOf<number>()
          return formatted
        }}
        className={(state) => {
          expectTypeOf(state).toEqualTypeOf<BaseSlider.Root.State>()
          return state.disabled ? 'disabled' : undefined
        }}
      />,
    )
  })

  it('rejects invalid values, callbacks, orientation and refs', () => {
    // @ts-expect-error Values must be numeric.
    assertType(<Slider value="20" />)
    // @ts-expect-error Array entries must be numeric.
    assertType(<Slider defaultValue={['20']} />)
    // @ts-expect-error Scalar callbacks cannot receive arrays.
    assertType(<Slider<number> value={20} onValueChange={(_value: number[]) => {}} />)
    // @ts-expect-error Array callbacks cannot receive a scalar.
    assertType(<Slider<number[]> value={[20]} onValueCommitted={(_value: number) => {}} />)
    // @ts-expect-error The root ref points to a div.
    assertType(<Slider ref={createRef<HTMLButtonElement>()} />)
    // @ts-expect-error Orientation is horizontal or vertical.
    assertType(<Slider orientation="diagonal" />)
    // @ts-expect-error Value text uses the pinned formattedValue/value/index signature.
    assertType(<Slider getAriaValueText={(_value: number) => 'Value'} />)
    // @ts-expect-error The generic value must be numeric.
    assertType<SliderProps<string>>({ value: '20' })
  })
})
