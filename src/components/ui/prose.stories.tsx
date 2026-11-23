import type { Meta, StoryObj } from 'storybook'
import { Prose } from './prose'

const meta: Meta<typeof Prose> = {
  title: 'Foundation/Prose',
  component: Prose,
  args: { size: 'base', compactHeadings: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'base'] },
  },
}

export default meta
type Story = StoryObj<typeof Prose>

const sample = (
  <>
    <h1>Lorem ipsum dolor</h1>
    <p>
      Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. See <a href="#example">the example</a> and
      run <code>bun run build</code>.
    </p>
    <h2>Ut enim ad minim</h2>
    <ul>
      <li>Quis nostrud exercitation</li>
      <li>Ullamco laboris nisi ut aliquip</li>
    </ul>
    <h3>Duis aute irure</h3>
    <blockquote>Excepteur sint occaecat cupidatat non proident.</blockquote>
    <pre>
      <code>{`function greet(name) {\n  return \`Hello, \${name}\`\n}`}</code>
    </pre>
    <h4>Sunt in culpa</h4>
    <ol>
      <li>Qui officia deserunt</li>
      <li>Mollit anim id est laborum</li>
    </ol>
    <hr />
    <p>A_very_long_unbroken_identifier_that_should_wrap_instead_of_overflowing_its_container.</p>
  </>
)

export const Default: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Prose {...args}>{sample}</Prose>
    </div>
  ),
}

export const SmallCompactHeadings: Story = {
  args: { size: 'sm', compactHeadings: true },
  render: (args) => (
    <div className="max-w-xl border bg-card p-3">
      <Prose {...args}>{sample}</Prose>
    </div>
  ),
}
