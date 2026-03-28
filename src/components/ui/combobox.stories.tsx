import type { Meta, StoryObj } from 'storybook'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSearch,
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

// ---------------------------------------------------------------------------
// Playground — interactive story with controls
// ---------------------------------------------------------------------------

export const Playground: Story = {
  argTypes: {
    variant: { control: 'select', options: ['default', 'dropdown'] },
    size: { control: 'select', options: ['default', 'xs'] },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    multiple: false,
  },
  render: (args) => {
    const { variant, size, disabled, multiple } = args as {
      variant: 'default' | 'dropdown'
      size: 'default' | 'xs'
      disabled: boolean
      multiple: boolean
    }
    const isDropdown = variant === 'dropdown'

    return (
      <div className={isDropdown ? 'flex items-center gap-2' : 'w-64'}>
        {isDropdown && (
          <span
            className={
              size === 'xs' ? 'text-xs text-muted-foreground' : 'text-sm text-muted-foreground'
            }
          >
            Fruit:
          </span>
        )}
        <Combobox
          items={fruits}
          variant={variant}
          size={size}
          disabled={disabled}
          multiple={multiple}
        >
          <ComboboxAnchor>
            {multiple && !isDropdown && (
              <ComboboxChips>
                {(value: unknown) => {
                  const item = value as Item
                  return (
                    <ComboboxChip key={item.value}>
                      {item.label}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  )
                }}
              </ComboboxChips>
            )}
            <ComboboxInput placeholder={isDropdown ? 'Select fruit...' : 'Search fruits...'} />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            {isDropdown && <ComboboxSearch placeholder="Search..." />}
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
    )
  },
}

// ---------------------------------------------------------------------------
// AllVariants — all 4 variant/size combinations
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Default / Default</p>
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Default / xs</p>
        <div className="w-56">
          <Combobox items={fruits} size="xs">
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Dropdown / Default</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Fruit:</span>
          <Combobox items={fruits} variant="dropdown">
            <ComboboxAnchor>
              <ComboboxInput placeholder="Select fruit..." />
              <ComboboxTrigger />
            </ComboboxAnchor>
            <ComboboxContent>
              <ComboboxSearch placeholder="Search..." />
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Dropdown / xs</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Fruit:</span>
          <Combobox items={fruits} variant="dropdown" size="xs">
            <ComboboxAnchor>
              <ComboboxInput placeholder="Select fruit..." />
              <ComboboxTrigger />
            </ComboboxAnchor>
            <ComboboxContent>
              <ComboboxSearch placeholder="Search..." />
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
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// MultiSelect — demonstrates multi-select in both variants and sizes
// ---------------------------------------------------------------------------

export const MultiSelect: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Default variant with chips (default size)
        </p>
        <div className="w-80">
          <Combobox items={fruits} multiple>
            <ComboboxAnchor>
              <ComboboxChips>
                {(value: unknown) => {
                  const item = value as Item
                  return (
                    <ComboboxChip key={item.value}>
                      {item.label}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  )
                }}
              </ComboboxChips>
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Default variant with chips (xs size)
        </p>
        <div className="w-72">
          <Combobox items={fruits} multiple size="xs">
            <ComboboxAnchor>
              <ComboboxChips>
                {(value: unknown) => {
                  const item = value as Item
                  return (
                    <ComboboxChip key={item.value}>
                      {item.label}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  )
                }}
              </ComboboxChips>
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Dropdown variant with comma-separated display (default size)
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Fruits:</span>
          <Combobox items={fruits} variant="dropdown" multiple>
            <ComboboxAnchor>
              <ComboboxInput placeholder="Select fruits..." />
              <ComboboxTrigger />
            </ComboboxAnchor>
            <ComboboxContent>
              <ComboboxSearch placeholder="Search..." />
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
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Dropdown variant with comma-separated display (xs size)
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Fruits:</span>
          <Combobox items={fruits} variant="dropdown" size="xs" multiple>
            <ComboboxAnchor>
              <ComboboxInput placeholder="Select fruits..." />
              <ComboboxTrigger />
            </ComboboxAnchor>
            <ComboboxContent>
              <ComboboxSearch placeholder="Search..." />
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
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// WithGroups — grouped items (Fruits / Vegetables)
// ---------------------------------------------------------------------------

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
