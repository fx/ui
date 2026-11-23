# @fx/ui

React component library built on Base UI primitives, Tailwind CSS v4, and neutral greyscale HSL theming.

## Stack

- **React 19** — UI framework
- **Base UI** — Unstyled accessible primitives
- **Tailwind CSS v4** — Utility-first styling with `@theme inline`
- **CVA** — Class variance authority for component variants
- **Vite 7.x** — Library-mode build with `vite-plugin-dts`
- **Bun** — Runtime and package manager
- **Biome** — Linting and formatting
- **Vitest** — Unit testing with Testing Library

## Installation

```sh
bun add @fx/ui
```

## Setup

@fx/ui ships a `globals.css` that includes Tailwind CSS v4, theme tokens, and base styles. Consumer projects need a small CSS entrypoint to integrate it properly.

### 1. Create your app CSS entrypoint

Create a CSS file (e.g. `src/index.css`) with the following:

```css
@import '@fx/ui/styles/globals.css' source(none);

/* Scan the app's source files and root HTML; add or adjust paths to cover
   all templates and source files in your project. Paths are relative to this CSS file. */
@source './';
@source '../index.html';

/* Required: tell Tailwind to scan @fx/ui's compiled ESM entry for utility
   classes (bg-primary, text-muted-foreground, etc.). Without this,
   utilities used only inside pre-compiled components are never generated. */
@source '../node_modules/@fx/ui/dist/index.js';

```

### 2. Import it in your app entry

```tsx
// src/main.tsx
import './index.css'
```

> **Why not just `import '@fx/ui/styles/globals.css'` directly?** The imported stylesheet supplies the theme tokens, but Tailwind also needs to scan the compiled component classes. Use the entrypoint above to include those classes and your application's sources.

> Process this CSS with Tailwind; importing it as plain browser CSS does not compile its directives. Theme tokens, typography, fonts, and animation utilities are registered by the shared stylesheet. The `@source` directive includes the compiled component classes.

### 3. Use components

```tsx
import { Button } from '@fx/ui'

export default function App() {
  return <Button variant="default">Click me</Button>
}
```

### Tailwind CSS plugin

If you use `@tailwindcss/vite` or `@tailwindcss/postcss` in your project, it will process the CSS automatically — no additional Tailwind configuration is needed.

### Typography (prose classes)

`globals.css` registers `@tailwindcss/typography`, so consumers get the
`prose`, `prose-sm`, `prose-lg`, `prose-invert`, etc. classes for free —
useful for rendering Markdown, articles, or any rich-text block. The plugin
ships as a regular dependency of `@fx/ui`, so no extra install is needed.

### Animation utilities

`globals.css` imports `tw-animate-css`, so consumers get the enter/exit
utilities — `animate-in`, `animate-out`, `fade-in`, `zoom-in-95`,
`slide-in-from-top-2`, and friends — for free. It ships as a regular
dependency of `@fx/ui`, so no extra install is needed.

`Collapsible` does not use them: `globals.css` defines its own
`collapsible-down`/`collapsible-up` keyframes against Base UI's
`--collapsible-panel-height`, because the versions bundled with
`tw-animate-css` target Radix, Bits, and Reka variables instead.

## Components

| Category | Components |
|---|---|
| **Foundation** | Button, Badge, Input, Textarea, Label, Skeleton, Separator, AspectRatio, Avatar, Prose |
| **Form** | Checkbox, Switch, Select, Slider, Toggle, ToggleGroup, Progress |
| **Container** | Card, Alert, Table, Collapsible, ClampedContent, Comment |
| **Overlay** | Dialog, AlertDialog, Sheet, Popover, Tooltip, DropdownMenu, Menubar |
| **Complex** | Toast, Chart, Thread |

## Comment threads

The comment-thread parts are presentational and compose like `Card`: they render whatever you pass in and do no data fetching or Markdown parsing.

```tsx
import {
  Avatar, ClampedContent, Comment, CommentAuthor, CommentBody, CommentHeader, CommentMeta,
  type IdentityTone, identityIndex, Prose, Thread, ThreadExpander, ThreadItem, useCollapsedRange,
} from '@fx/ui'

function Comments({ comments }) {
  const { hiddenRange, hiddenCount, expand } = useCollapsedRange({ total: comments.length })
  return (
    <Thread aria-label="Comments">
      {comments.map((comment, index) => {
        if (hiddenRange && index >= hiddenRange[0] && index < hiddenRange[1]) {
          return index === hiddenRange[0] ? (
            <ThreadItem key="earlier">
              <ThreadExpander count={hiddenCount} onExpand={expand} />
            </ThreadItem>
          ) : null
        }
        const tone = identityIndex(comment.authorId) as IdentityTone
        return (
          <ThreadItem key={comment.id}>
            <Comment accent={tone}>
              <CommentHeader>
                <CommentAuthor
                  avatar={<Avatar label={comment.author} tone={tone} size="sm" decorative />}
                  name={comment.author}
                />
                <CommentMeta>· {comment.time}</CommentMeta>
              </CommentHeader>
              <CommentBody>
                <ClampedContent>
                  <Prose size="sm" compactHeadings>{comment.html}</Prose>
                </ClampedContent>
              </CommentBody>
            </Comment>
          </ThreadItem>
        )
      })}
    </Thread>
  )
}
```

### Identity colours

`globals.css` defines eight accent tones, `--identity-1` to `--identity-8`, each with an `-foreground` pair, in both themes; Tailwind sees them as `bg-identity-N`, `text-identity-N-foreground`, `border-identity-N` and so on. `identityIndex(key, count = 8)` hashes a stable key (FNV-1a) to a tone in `1..count`, so a person keeps the same colour everywhere.

### Avatar

A square avatar with initials (derived from `label` unless `initials` is given) or an `icon`. `tone` is `neutral`, `inverse` or an identity tone `1`–`8`; `size` is `sm` or `md`. It is a labelled `img`, or hidden from assistive technology with `decorative` when a visible name sits next to it.

### Prose

Typography wrapper for rich text. Its `--tw-prose-*` colours map onto the theme tokens, so it follows light and dark mode without `prose-invert`. `size` is `sm` or `base`; `compactHeadings` keeps headings at body size so content never outweighs a surrounding header.

### ClampedContent

Clips content taller than `maxHeight` (default `20rem`) behind a fade (`fadeFrom`, default `var(--card)`) with a Show more / Show less toggle. It only clamps when the content exceeds `maxHeight × threshold` (default `1.5`), expands when focus moves into the clipped region, and supports `expanded`/`defaultExpanded`/`onExpandedChange`. Measuring needs `ResizeObserver`; without it the content is shown in full.

### Comment

`Comment` is an `<article>` card with a 2px left stripe in its `accent` (`neutral`, `inverse` or `1`–`8`) and an optional `highlighted` ring. Compose it with `CommentHeader`, `CommentAuthor` (`avatar`, `name`, `meta`), `CommentMeta`, `CommentAction`, `CommentBody` and `CommentFooter`.

### Thread

`Thread` is an ordered list of `ThreadItem`s and needs an `aria-label` or `aria-labelledby`. `useCollapsedRange({ total, keepFirst = 1, keepLast = 5, minHidden = 3, forceVisible })` returns the `[start, end)` range to replace with a `ThreadExpander` ("Show N earlier comments"), or `null` when fewer than `minHidden` items would be hidden or a `forceVisible` index falls inside it. `expand()` reveals everything at once.

## Development

Use Bun to install repository dependencies and maintain the authoritative `bun.lock`. The packed-consumer verification uses npm to test installation of the published package.

```sh
bun install          # Install dependencies
bun run build        # Build library
bun run test         # Run tests
bun run lint         # Lint with Biome
bun run storybook    # Start Storybook dev server
```

## License

MIT
