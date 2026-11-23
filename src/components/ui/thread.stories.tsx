import { Bot, MoreHorizontal } from 'lucide-react'
import type { Meta, StoryObj } from 'storybook'
import { Avatar, type AvatarTone } from './avatar'
import { Button } from './button'
import { ClampedContent } from './clamped-content'
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
import { Thread, ThreadExpander, ThreadItem, useCollapsedRange } from './thread'

const meta: Meta<typeof Thread> = {
  title: 'Complex/Thread',
  component: Thread,
}

export default meta
type Story = StoryObj<typeof Thread>

interface Author {
  name: string
  tone: AvatarTone
  role?: string
  bot?: boolean
}

const ada: Author = { name: 'Ada Lovelace', tone: 2, role: 'maintainer' }
const grace: Author = { name: 'Grace Hopper', tone: 5 }
const alan: Author = { name: 'Alan Turing', tone: 7 }
const bot: Author = { name: 'Build Bot', tone: 'inverse', role: 'automation', bot: true }

function LongBody() {
  return (
    <>
      <h2>Lorem ipsum dolor sit amet</h2>
      <p>
        Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat.
      </p>
      <h3>Duis aute irure</h3>
      <ul>
        <li>Dolor in reprehenderit in voluptate velit esse</li>
        <li>
          Cillum dolore eu fugiat nulla pariatur, see <code>src/lib/example.ts</code>
        </li>
        <li>Excepteur sint occaecat cupidatat non proident</li>
      </ul>
      <pre>
        <code>{`export function sum(values) {\n  return values.reduce((total, value) => total + value, 0)\n}\n\nconsole.log(sum([1, 2, 3]))`}</code>
      </pre>
      <h4>Sunt in culpa</h4>
      <ol>
        <li>Qui officia deserunt mollit anim id est laborum.</li>
        <li>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</li>
        <li>Accusantium doloremque laudantium, totam rem aperiam.</li>
      </ol>
      <blockquote>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
      </blockquote>
      <p>
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
        velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
        quaerat voluptatem.
      </p>
    </>
  )
}

interface SampleComment {
  author: Author
  time: string
  body: React.ReactNode
  footer?: string
}

const comments: SampleComment[] = [
  { author: ada, time: '3 days ago', body: <LongBody /> },
  { author: grace, time: '3 days ago', body: <p>Lorem ipsum dolor sit amet.</p> },
  {
    author: bot,
    time: '3 days ago',
    body: (
      <p>
        Checks passed on <code>a1b2c3d</code>.
      </p>
    ),
  },
  { author: alan, time: '2 days ago', body: <p>Ut enim ad minim veniam, quis nostrud?</p> },
  { author: ada, time: '2 days ago', body: <p>Duis aute irure dolor in reprehenderit.</p> },
  { author: grace, time: '2 days ago', body: <LongBody />, footer: 'Edited 2 days ago' },
  { author: bot, time: '2 days ago', body: <p>Preview deployed.</p> },
  { author: alan, time: 'yesterday', body: <p>Excepteur sint occaecat cupidatat.</p> },
  { author: ada, time: 'yesterday', body: <p>Sed ut perspiciatis unde omnis.</p> },
  { author: grace, time: 'yesterday', body: <p>Nemo enim ipsam voluptatem.</p> },
  { author: alan, time: 'yesterday', body: <LongBody /> },
  { author: bot, time: '20 hours ago', body: <p>Checks failed: 1 of 42 tests.</p> },
  { author: ada, time: '5 hours ago', body: <p>Neque porro quisquam est, qui dolorem ipsum.</p> },
  { author: grace, time: '2 hours ago', body: <LongBody /> },
  { author: alan, time: '1 hour ago', body: <p>Quis autem vel eum iure reprehenderit.</p> },
  { author: bot, time: '40 min ago', body: <p>Checks passed.</p> },
  {
    author: ada,
    time: '12 min ago',
    body: <p>At vero eos et accusamus et iusto odio dignissimos.</p>,
    footer: 'Marked as resolved',
  },
]

function SampleCommentCard({
  comment,
  highlighted,
}: {
  comment: SampleComment
  highlighted?: boolean
}) {
  const { author } = comment
  return (
    <Comment
      accent={author.tone}
      highlighted={highlighted ?? false}
      aria-label={`${author.name}, ${comment.time}`}
    >
      <CommentHeader>
        <CommentAuthor
          avatar={
            <Avatar
              label={author.name}
              tone={author.tone}
              size="sm"
              decorative
              {...(author.bot ? { icon: <Bot /> } : {})}
            />
          }
          name={author.name}
          meta={author.role}
        />
        <CommentMeta>· {comment.time}</CommentMeta>
        <CommentAction>
          <Button variant="ghost" size="icon-xs" aria-label="More actions">
            <MoreHorizontal />
          </Button>
        </CommentAction>
      </CommentHeader>
      <CommentBody>
        <ClampedContent maxHeight="16rem">
          <Prose size="sm" compactHeadings>
            {comment.body}
          </Prose>
        </ClampedContent>
      </CommentBody>
      {comment.footer && <CommentFooter>{comment.footer}</CommentFooter>}
    </Comment>
  )
}

function SampleThread({ linked }: { linked?: number }) {
  const { hiddenRange, hiddenCount, expand } = useCollapsedRange({
    total: comments.length,
    ...(linked === undefined ? {} : { forceVisible: [linked] }),
  })
  return (
    <div className="max-w-2xl">
      <Thread aria-label="Comments">
        {comments.map((comment, index) => {
          if (hiddenRange && index >= hiddenRange[0] && index < hiddenRange[1]) {
            return index === hiddenRange[0] ? (
              <ThreadItem key="expander">
                <ThreadExpander count={hiddenCount} onExpand={expand} />
              </ThreadItem>
            ) : null
          }
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static sample content
            <ThreadItem key={index}>
              <SampleCommentCard comment={comment} highlighted={index === linked} />
            </ThreadItem>
          )
        })}
      </Thread>
    </div>
  )
}

export const Default: Story = {
  render: () => <SampleThread />,
}

export const LinkedComment: Story = {
  render: () => <SampleThread linked={5} />,
}
