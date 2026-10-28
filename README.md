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
| **Foundation** | Button, Badge, Input, Textarea, Label, Skeleton, Separator, AspectRatio |
| **Form** | Checkbox, Switch, Select, Toggle, ToggleGroup, Progress |
| **Container** | Card, Alert, Table, Collapsible |
| **Overlay** | Dialog, AlertDialog, Sheet, Popover, Tooltip, DropdownMenu, Menubar |
| **Complex** | Toast, Chart |

## Development

```sh
bun install          # Install dependencies
bun run build        # Build library
bun run test         # Run tests
bun run lint         # Lint with Biome
bun run storybook    # Start Storybook dev server
```

## License

MIT
