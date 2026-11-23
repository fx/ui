import { Bot, MoreHorizontal } from 'lucide-react'
import type { Meta, StoryObj } from 'storybook'
import { Avatar } from './avatar'
import { Button } from './button'
import {
  Comment,
  CommentAction,
  CommentAuthor,
  CommentBody,
  CommentFooter,
  CommentHeader,
  CommentMeta,
} from './comment'
import { Prose } from './prose'

const meta: Meta<typeof Comment> = {
  title: 'Container/Comment',
  component: Comment,
  args: { accent: 2, highlighted: false },
  argTypes: {
    accent: { control: 'select', options: ['neutral', 'inverse', 1, 2, 3, 4, 5, 6, 7, 8] },
  },
}

export default meta
type Story = StoryObj<typeof Comment>

export const Default: Story = {
  render: (args) => (
    <Comment {...args} className="max-w-2xl">
      <CommentHeader>
        <CommentAuthor
          avatar={<Avatar label="Ada Lovelace" tone={2} size="sm" decorative />}
          name="Ada Lovelace"
          meta="maintainer"
        />
        <CommentMeta>· 12 min ago</CommentMeta>
        <CommentAction>
          <Button variant="ghost" size="icon-xs" aria-label="More actions">
            <MoreHorizontal />
          </Button>
        </CommentAction>
      </CommentHeader>
      <CommentBody>
        <Prose size="sm" compactHeadings>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Run <code>bun run test</code>{' '}
            before merging.
          </p>
        </Prose>
      </CommentBody>
      <CommentFooter>Edited 3 min ago</CommentFooter>
    </Comment>
  ),
}

export const Accents: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-3">
      <Comment>
        <CommentHeader>
          <CommentAuthor
            avatar={<Avatar label="Grace Hopper" size="sm" decorative />}
            name="Grace Hopper"
          />
          <CommentMeta>· neutral</CommentMeta>
        </CommentHeader>
        <CommentBody>Neutral accent uses the border colour.</CommentBody>
      </Comment>
      <Comment accent="inverse">
        <CommentHeader>
          <CommentAuthor
            avatar={<Avatar label="Build Bot" tone="inverse" size="sm" icon={<Bot />} decorative />}
            name="Build Bot"
            meta="automation"
          />
          <CommentMeta>· inverse</CommentMeta>
        </CommentHeader>
        <CommentBody>Inverse accent uses the foreground colour.</CommentBody>
      </Comment>
      {([1, 3, 5, 7] as const).map((tone) => (
        <Comment key={tone} accent={tone}>
          <CommentHeader>
            <CommentAuthor
              avatar={<Avatar label={`Identity ${tone}`} tone={tone} size="sm" decorative />}
              name={`Identity ${tone}`}
            />
          </CommentHeader>
          <CommentBody>Identity accent {tone}.</CommentBody>
        </Comment>
      ))}
    </div>
  ),
}

export const Highlighted: Story = {
  args: { highlighted: true },
  render: Default.render,
}
