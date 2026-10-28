import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from '../slider'

describe('Slider', () => {
  it('defaults to one named slider at min (or zero)', () => {
    const { rerender } = render(<Slider aria-label="Value" />)
    expect(screen.getByRole('slider', { name: 'Value' })).toHaveValue('0')
    rerender(<Slider key="nonzero" min={15} aria-label="Value" />)
    expect(screen.getAllByRole('slider')).toHaveLength(1)
    expect(screen.getByRole('slider')).toHaveValue('15')
  })

  it.each([
    { defaultValue: 25 },
    { defaultValue: [25] },
    { defaultValue: [20, 80] },
    { defaultValue: [10, 40, 90] },
  ])('renders defaultValue $defaultValue', ({ defaultValue }) => {
    render(<Slider defaultValue={defaultValue} aria-label="Value" />)
    expect(
      screen.getAllByRole('slider').map((input) => input.getAttribute('aria-valuenow')),
    ).toEqual((Array.isArray(defaultValue) ? defaultValue : [defaultValue]).map(String))
  })

  it('updates an uncontrolled scalar and preserves keyboard event details', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onValueCommitted = vi.fn()
    render(
      <Slider
        defaultValue={25}
        aria-label="Value"
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
      />,
    )
    await user.tab()
    expect(screen.getByRole('slider')).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('slider')).toHaveValue('26')
    expect(onValueChange).toHaveBeenLastCalledWith(
      26,
      expect.objectContaining({
        reason: 'keyboard',
        activeThumbIndex: 0,
        event: expect.objectContaining({ key: 'ArrowRight' }),
        cancel: expect.any(Function),
      }),
    )
    expect(onValueCommitted).toHaveBeenLastCalledWith(
      26,
      expect.objectContaining({
        reason: 'keyboard',
        event: expect.objectContaining({ key: 'ArrowRight' }),
      }),
    )
  })

  it.each([
    { values: [25] },
    { values: [20, 80] },
  ])('preserves array callback shape for $values', async ({ values }) => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onValueCommitted = vi.fn()
    render(
      <Slider
        defaultValue={values}
        aria-label="Value"
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
      />,
    )
    await user.tab()
    await user.keyboard('{ArrowRight}')
    const expected = values.map((value, index) => (index === 0 ? value + 1 : value))
    expect(onValueChange).toHaveBeenLastCalledWith(
      expected,
      expect.objectContaining({ reason: 'keyboard', activeThumbIndex: 0 }),
    )
    expect(onValueCommitted).toHaveBeenLastCalledWith(
      expected,
      expect.objectContaining({ reason: 'keyboard' }),
    )
    expect(screen.getAllByRole('slider')[0]).toHaveValue(String(expected[0]))
  })

  it('uses controlled scalar values until the parent supplies the next value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Slider value={30} onValueChange={onValueChange} aria-label="Value" />,
    )
    await user.tab()
    await user.keyboard('{ArrowUp}')
    expect(onValueChange).toHaveBeenCalledWith(31, expect.anything())
    expect(screen.getByRole('slider')).toHaveValue('30')
    rerender(<Slider value={31} onValueChange={onValueChange} aria-label="Value" />)
    expect(screen.getByRole('slider')).toHaveValue('31')
  })

  it('supports controlled arrays and changes the thumb count on rerender', async () => {
    const user = userEvent.setup()
    function ControlledRange() {
      const [value, setValue] = useState([20, 80])
      return <Slider value={value} onValueChange={setValue} aria-label="Value" />
    }
    const { rerender } = render(<ControlledRange />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getAllByRole('slider')[0]).toHaveValue('21')
    rerender(<Slider value={[15, 45, 85]} aria-label="Value" />)
    expect(screen.getAllByRole('slider').map((el) => el.getAttribute('aria-valuenow'))).toEqual([
      '15',
      '45',
      '85',
    ])
    rerender(<Slider value={[50]} aria-label="Value" />)
    expect(screen.getAllByRole('slider')).toHaveLength(1)
    expect(screen.getByRole('slider')).toHaveValue('50')
    rerender(<Slider value={60} aria-label="Value" />)
    expect(screen.getByRole('slider')).toHaveValue('60')
  })

  it('does not recreate thumbs when values change or reset uncontrolled defaults on rerender', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Slider defaultValue={[20, 80]} aria-label="Value" />)
    const first = screen.getAllByRole('slider')[0]
    await user.tab()
    await user.keyboard('{ArrowRight}')
    const warning = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      rerender(<Slider defaultValue={[50]} aria-label="Value" />)
      expect(warning).toHaveBeenCalledWith(expect.stringContaining('changing the default value'))
    } finally {
      warning.mockRestore()
    }
    expect(screen.getAllByRole('slider')).toHaveLength(2)
    expect(screen.getAllByRole('slider')[0]).toBe(first)
    expect(first).toHaveValue('21')
    expect(first).toHaveFocus()
  })

  it.each([
    ['ArrowRight', 4],
    ['ArrowUp', 4],
    ['ArrowLeft', 3],
    ['ArrowDown', 3],
    ['PageUp', 5.5],
    ['PageDown', 1.5],
    ['Home', 1],
    ['End', 6],
  ])('handles %s with decimal steps and bounds', async (key, expected) => {
    const user = userEvent.setup()
    render(
      <Slider min={1} max={6} step={0.5} largeStep={2} defaultValue={3.5} aria-label="Value" />,
    )
    await user.tab()
    await user.keyboard(`{${key}}`)
    expect(screen.getByRole('slider')).toHaveValue(String(expected))
  })

  it('clamps keyboard changes to bounds and uses largeStep with Shift', async () => {
    const user = userEvent.setup()
    render(
      <Slider min={0} max={1} step={0.1} largeStep={0.3} defaultValue={0.5} aria-label="Value" />,
    )
    await user.tab()
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}')
    expect(screen.getByRole('slider')).toHaveValue('0.8')
    await user.keyboard('{End}{ArrowRight}{PageUp}')
    expect(screen.getByRole('slider')).toHaveValue('1')
    await user.keyboard('{Home}{ArrowLeft}{PageDown}')
    expect(screen.getByRole('slider')).toHaveValue('0')
  })

  it('enforces the minimum distance between range thumbs', async () => {
    const user = userEvent.setup()
    render(
      <Slider
        defaultValue={[20, 80]}
        step={5}
        minStepsBetweenValues={2}
        getAriaLabel={(index) => (index === 0 ? 'Minimum' : 'Maximum')}
      />,
    )
    await user.tab()
    await user.keyboard('{End}{ArrowRight}')
    expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveValue('70')
    await user.tab()
    await user.keyboard('{Home}{ArrowLeft}')
    expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveValue('80')
  })

  it('disables all inputs and prevents keyboard interaction', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Slider defaultValue={[20, 80]} disabled onValueChange={onValueChange} aria-label="Value" />,
    )
    for (const input of screen.getAllByRole('slider')) expect(input).toBeDisabled()
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getAllByRole('slider')[0]).not.toHaveFocus()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getAllByRole('slider')[0]).toHaveValue('20')
  })

  it('forwards external labels and descriptions to the actual input', () => {
    render(
      <>
        <span id="value-label">Selected value</span>
        <span id="value-description">Choose a number</span>
        <Slider aria-labelledby="value-label" aria-describedby="value-description" />
      </>,
    )
    const input = screen.getByRole('slider', { name: 'Selected value' })
    expect(input.tagName).toBe('INPUT')
    expect(input).toHaveAccessibleDescription('Choose a number')
  })

  it('supports per-thumb labels and formatted value text with native arguments', () => {
    const getAriaValueText = vi.fn(
      (formatted: string, value: number, index: number) =>
        `${index === 0 ? 'From' : 'To'} ${formatted} (${value})`,
    )
    render(
      <Slider
        defaultValue={[0.2, 0.8]}
        min={0}
        max={1}
        step={0.1}
        locale="en-US"
        format={{ style: 'percent' }}
        aria-label="Fallback"
        getAriaLabel={(index) => (index === 0 ? 'Minimum' : 'Maximum')}
        getAriaValueText={getAriaValueText}
      />,
    )
    expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute(
      'aria-valuetext',
      'From 20% (0.2)',
    )
    expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute(
      'aria-valuetext',
      'To 80% (0.8)',
    )
    expect(getAriaValueText).toHaveBeenCalledWith('20%', 0.2, 0)
    expect(getAriaValueText).toHaveBeenCalledWith('80%', 0.8, 1)
  })

  it('passes native input-change event details and names through for forms', () => {
    const onValueChange = vi.fn()
    const onValueCommitted = vi.fn()
    render(
      <Slider
        name="amount"
        defaultValue={20}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        aria-label="Value"
      />,
    )
    const input = screen.getByRole('slider')
    fireEvent.change(input, { target: { value: '40' } })
    expect(input).toHaveAttribute('name', 'amount')
    expect(input).toHaveValue('40')
    expect(onValueChange).toHaveBeenLastCalledWith(
      40,
      expect.objectContaining({ reason: 'input-change', activeThumbIndex: 0 }),
    )
    expect(onValueCommitted).toHaveBeenLastCalledWith(
      40,
      expect.objectContaining({ reason: 'input-change' }),
    )
  })

  it('allows cancelling a native change', async () => {
    const user = userEvent.setup()
    render(
      <Slider
        defaultValue={20}
        onValueChange={(_, details) => details.cancel()}
        aria-label="Value"
      />,
    )
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('slider')).toHaveValue('20')
  })

  it('forwards the root ref and slots, and merges string or state-based classes', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLDivElement>()
    const { container, rerender } = render(
      <Slider ref={ref} className="w-64 custom" aria-label="Value" />,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'slider')
    expect(ref.current).toHaveClass('w-64', 'custom')
    expect(ref.current).not.toHaveClass('w-full')
    for (const slot of ['slider-control', 'slider-track', 'slider-range', 'slider-thumb']) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).toBeInTheDocument()
    }
    rerender(
      <Slider
        ref={ref}
        defaultValue={0}
        className={(state) => `w-72 value-${state.values[0]}`}
        aria-label="Value"
      />,
    )
    expect(ref.current).toHaveClass('w-72', 'value-0')
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(ref.current).toHaveClass('value-1')
    rerender(<Slider ref={ref} className={() => undefined} aria-label="Value" />)
    expect(ref.current).toHaveClass('w-full')
  })

  it('supports vertical orientation and its keyboard controls', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Slider orientation="vertical" defaultValue={50} aria-label="Value" />,
    )
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('aria-orientation', 'vertical')
    for (const part of container.querySelectorAll('[data-slot]')) {
      expect(part).toHaveAttribute('data-orientation', 'vertical')
    }
    await user.tab()
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveValue('51')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveValue('50')
  })

  it.each([
    { value: 35 },
    { value: [20, 80] },
  ])('server renders and hydrates values $value without recovery', async ({ value }) => {
    const element = <Slider defaultValue={value} aria-label="Value" />
    const container = document.createElement('div')
    container.innerHTML = renderToString(element)
    document.body.append(container)
    const expected = (Array.isArray(value) ? value : [value]).map(String)
    const inputs = within(container).getAllByRole('slider')
    expect(inputs.map((input) => input.getAttribute('aria-valuenow'))).toEqual(expected)
    expect(inputs.map((input) => input.parentElement?.getAttribute('data-index'))).toEqual(
      expected.map((_, index) => String(index)),
    )
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, element, { onRecoverableError })
      })
      expect(within(container).getAllByRole('slider')).toEqual(inputs)
      expect(onRecoverableError).not.toHaveBeenCalled()
      const firstInput = inputs[0]
      if (!firstInput) throw new Error('Expected a server-rendered slider input')
      fireEvent.keyDown(firstInput, { key: 'ArrowRight' })
      expect(firstInput).toHaveValue(String(Number(expected[0]) + 1))
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })
})
