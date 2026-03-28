# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`@fx/ui` — React component library. 28 components built on Base UI primitives with Tailwind CSS v4 and neutral greyscale oklch theming.

## IMPORTANT: Public Repository Rules

This is a **public open-source repository**. Never introduce references to:
- Private or internal projects, organizations, or repositories (e.g. project codenames, internal app names, private GitHub repos)
- Private registries — this package publishes publicly to GitHub Packages
- Internal planning documents, cross-project audits, or migration plans
- Language like "internal package", "private use", "within the organization"
- Spec numbers or task-tracking files that no longer exist in the repo

All documentation, comments, and commit messages must be written as if for a public open-source audience.

## Commands

```sh
bun install              # Install dependencies
bun run build            # Build library (ESM + CJS + types + globals.css)
bun run test             # Run all tests (300 tests across 30 suites)
bun run test -- button   # Run tests matching "button"
bun run lint             # Lint with Biome
bun run lint:fix         # Lint and auto-fix
bun run storybook        # Storybook dev server on port 6006
bun run build-storybook  # Build static Storybook
```

## Architecture

**Build:** Vite 7.x library mode (`vite.config.ts`) outputs ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + rolled-up types (`dist/index.d.ts`). `globals.css` is copied separately to `dist/styles/`. React/react-dom are externalized as peer dependencies.

**Barrel export:** `src/index.ts` re-exports everything. Every public component, type, and variant function must be exported here.

**Theming:** `src/styles/globals.css` defines oklch CSS variables (`:root` for light, `.dark` for dark) mapped to Tailwind via `@theme inline` blocks using direct `var()` references (color-space agnostic). Neutral greyscale only — no color presets. Consumers can override `:root`/`.dark` with any color space. `ThemeProvider` in `src/components/theme-provider.tsx` manages light/dark/system with localStorage persistence and `.dark` class on `<html>`.

**Path alias:** `@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

## Component Pattern

Every component follows the same structure (see `button.tsx` as reference):

1. Import Base UI primitive (when applicable) + CVA + `cn` from `@/lib/utils`
2. Define variants with `cva()` if the component has visual variants
3. Define the component as a named function (not `forwardRef` — React 19 ref forwarding)
4. Add `data-slot="component-name"` attribute on the root element
5. Apply `cn(variants({ variant, size }), className)` for class merging
6. Export component, variants, and types as named exports

**19 components use Base UI primitives**, 9 use plain HTML elements. Check the existing component to see which pattern applies.

## Testing Pattern

Tests live in `src/components/ui/__tests__/[component].test.tsx`. Pattern:
- Import from `@testing-library/react` and `vitest`
- Test: renders, has `data-slot`, applies variants, merges className, forwards ref, handles disabled/interactive states
- Vitest globals are enabled (`describe`, `it`, `expect` available without import, but convention is to import them)
- Test setup: `src/test-setup.ts` imports `@testing-library/jest-dom/vitest`

## Stories Pattern

Stories live alongside components at `src/components/ui/[component].stories.tsx`. CSF3 format with `Meta<typeof Component>` and `StoryObj<typeof Component>`. Organized by category: Foundation, Form, Container, Overlay, Complex.

**Every component MUST have a corresponding Storybook story.** When adding a new component, always create its story file. When modifying a component's API or visual behavior, update its story to reflect the changes.

## Code Style

- **Biome** (not ESLint/Prettier): 2-space indent, single quotes, semicolons as needed, 100 char line width
- `cn()` utility wraps `clsx` + `tailwind-merge` for deduped class merging
- Named function declarations (not arrow functions) for components
- `lucide-react` for internal component icons only
- TypeScript strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`

## Husky

Husky v9 — `.husky/pre-commit` does NOT need a shebang. It runs `npx lint-staged` which applies Biome to staged files.

## Task Tracking

**You MUST load the `/project-management` skill before creating, modifying, or completing any task.** It owns all task-tracking rules and knows where tasks belong. Do not manage tasks without it.
