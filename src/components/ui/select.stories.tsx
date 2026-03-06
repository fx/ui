import type { Meta, StoryObj } from 'storybook'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from './select'

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48" aria-label="Select a fruit">
        <SelectValue>{(value: string | null) => value ?? 'Select a fruit'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const PositionTop: Story = {
  name: 'Position: Top',
  render: () => (
    <div className="pt-48">
      <Select>
        <SelectTrigger className="w-48" aria-label="Select a fruit">
          <SelectValue>{(value: string | null) => value ?? 'Select a fruit'}</SelectValue>
        </SelectTrigger>
        <SelectContent side="top">
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const AlignStart: Story = {
  name: 'Align: Start',
  render: () => (
    <div className="flex justify-center">
      <Select>
        <SelectTrigger className="w-48" aria-label="Select a fruit">
          <SelectValue>{(value: string | null) => value ?? 'Select a fruit'}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const ItemAligned: Story = {
  name: 'Position: Item-aligned',
  render: () => (
    <Select>
      <SelectTrigger className="w-48" aria-label="Select a fruit">
        <SelectValue>{(value: string | null) => value ?? 'Select a fruit'}</SelectValue>
      </SelectTrigger>
      <SelectContent position="item-aligned">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithScrollButtons: Story = {
  name: 'With Scroll Buttons',
  render: () => (
    <Select>
      <SelectTrigger className="w-48" aria-label="Select a timezone">
        <SelectValue>{(value: string | null) => value ?? 'Select a timezone'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectScrollUpButton />
        <SelectGroup>
          <SelectLabel>Timezones</SelectLabel>
          <SelectItem value="utc-12">UTC-12:00</SelectItem>
          <SelectItem value="utc-11">UTC-11:00</SelectItem>
          <SelectItem value="utc-10">UTC-10:00</SelectItem>
          <SelectItem value="utc-9">UTC-09:00</SelectItem>
          <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
          <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
          <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
          <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
          <SelectItem value="utc-4">UTC-04:00</SelectItem>
          <SelectItem value="utc-3">UTC-03:00</SelectItem>
          <SelectItem value="utc-2">UTC-02:00</SelectItem>
          <SelectItem value="utc-1">UTC-01:00</SelectItem>
          <SelectItem value="utc">UTC+00:00</SelectItem>
          <SelectItem value="utc+1">UTC+01:00</SelectItem>
          <SelectItem value="utc+2">UTC+02:00</SelectItem>
          <SelectItem value="utc+3">UTC+03:00</SelectItem>
          <SelectItem value="utc+4">UTC+04:00</SelectItem>
          <SelectItem value="utc+5">UTC+05:00</SelectItem>
          <SelectItem value="utc+6">UTC+06:00</SelectItem>
          <SelectItem value="utc+7">UTC+07:00</SelectItem>
          <SelectItem value="utc+8">UTC+08:00</SelectItem>
          <SelectItem value="utc+9">UTC+09:00</SelectItem>
          <SelectItem value="utc+10">UTC+10:00</SelectItem>
          <SelectItem value="utc+11">UTC+11:00</SelectItem>
          <SelectItem value="utc+12">UTC+12:00</SelectItem>
        </SelectGroup>
        <SelectScrollDownButton />
      </SelectContent>
    </Select>
  ),
}
