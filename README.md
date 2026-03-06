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

## Usage

```tsx
import { Button } from '@fx/ui'
import '@fx/ui/styles/globals.css'

export default function App() {
  return <Button variant="default">Click me</Button>
}
```

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
