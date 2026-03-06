import type { Meta, StoryObj } from 'storybook'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from './combobox'

interface Item {
  label: string
  value: string
}

const fruits: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Orange', value: 'orange' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
  { label: 'Strawberry', value: 'strawberry' },
]

const allProduce: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Carrot', value: 'carrot' },
  { label: 'Lettuce', value: 'lettuce' },
  { label: 'Tomato', value: 'tomato' },
]

const produceGroups = [
  {
    label: 'Fruits',
    items: ['apple', 'banana', 'cherry'],
  },
  {
    label: 'Vegetables',
    items: ['carrot', 'lettuce', 'tomato'],
  },
]

const meta: Meta<typeof Combobox> = {
  title: 'Form/Combobox',
  component: Combobox,
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Combobox items={fruits}>
        <ComboboxAnchor>
          <ComboboxInput placeholder="Search fruits..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(item: Item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <div className="w-64">
      <Combobox items={allProduce}>
        <ComboboxAnchor>
          <ComboboxInput placeholder="Search produce..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxEmpty />
          {produceGroups.map((group) => (
            <ComboboxGroup key={group.label}>
              <ComboboxLabel>{group.label}</ComboboxLabel>
              <ComboboxList>
                {(item: Item) =>
                  group.items.includes(item.value) ? (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  ) : null
                }
              </ComboboxList>
            </ComboboxGroup>
          ))}
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Combobox items={fruits} disabled>
        <ComboboxAnchor>
          <ComboboxInput placeholder="Disabled..." />
          <ComboboxTrigger />
        </ComboboxAnchor>
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(item: Item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}
