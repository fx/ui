import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
})
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (!(key in globalThis))
    Object.defineProperty(globalThis, key, Object.getOwnPropertyDescriptor(dom.window, key))
}
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator })
const React = await import('react')
const { render, screen, waitFor } = await import('@testing-library/react')
const { default: userEvent } = await import('@testing-library/user-event')
const ui =
  process.argv[2] === 'cjs' ? createRequire(import.meta.url)('@fx/ui') : await import('@fx/ui')
const { Combobox, ComboboxAnchor, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } = ui
const h = React.createElement
render(
  h(
    'div',
    null,
    h('span', { id: 'fruit-label' }, 'Choose fruit'),
    h(
      Combobox,
      { items: [{ label: 'Apple', value: 'apple' }] },
      h(ComboboxAnchor, null, h(ComboboxInput, { 'aria-labelledby': 'fruit-label' })),
      h(
        ComboboxContent,
        null,
        h(ComboboxList, null, (item) =>
          h(ComboboxItem, { key: item.value, value: item }, item.label),
        ),
      ),
    ),
  ),
)
const input = screen.getByRole('combobox', { name: 'Choose fruit' })
await userEvent.setup().click(input)
await screen.findByRole('listbox')
await waitFor(() => {
  assert.equal(screen.getByText('Choose fruit').closest('[aria-hidden="true"]'), null)
  assert.equal(screen.getByRole('combobox', { name: 'Choose fruit' }), input)
})
