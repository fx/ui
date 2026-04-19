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
   @theme inline blocks through @import, so the color and radius tokens
   defined in globals.css must be declared again in the consumer. */
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
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

export function App() {
  return <Button variant="default">Click me</Button>
}
```

### Tailwind CSS plugin

If you use `@tailwindcss/vite` or `@tailwindcss/postcss` in your project, it will process the CSS automatically — no additional Tailwind configuration is needed.

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
