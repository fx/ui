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
@import '@fx/ui/styles/globals.css';

/* Required: tell Tailwind to scan @fx/ui's compiled output for utility
   classes (bg-primary, text-muted-foreground, etc.). Without this,
   utilities used only inside pre-compiled components are never generated. */
@source '../node_modules/@fx/ui/dist';

/* Required: re-register theme tokens. Tailwind v4 does not propagate
   @theme inline blocks through @import, so the tokens defined in
   globals.css must be declared again in the consumer.

   The published globals.css uses HSL channel values (e.g. "0 0% 100%"),
   so color tokens need hsl() wrappers here. */
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: 'JetBrains Mono', monospace;
  --font-mono: 'JetBrains Mono', monospace;
  --animate-collapsible-down: collapsible-down 0.2s ease-out;
  --animate-collapsible-up: collapsible-up 0.2s ease-out;
}
```

### 2. Import it in your app entry

```tsx
// src/main.tsx
import './index.css'
```

> **Why not just `import '@fx/ui/styles/globals.css'` directly?** You can, but Tailwind v4 won't resolve the `@theme inline` tokens or scan the compiled component classes. Components will render but utility classes like `bg-primary` will be missing, and buttons/inputs may appear unstyled.

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
