# Copilot Instructions

## PR Review Checklist (CRITICAL)

- **Husky v9 hooks**: `.husky/pre-commit` does NOT need a shebang line. Husky v9 uses a different execution model where hook files contain just the commands to run (e.g., `npx lint-staged`). Do not flag missing shebangs in `.husky/` files.
- **Shadow classes on overlays/triggers are intentional**: Components like menubar, dropdown sub-content, select trigger, and popover intentionally keep `shadow-*` classes for visual depth even when `rounded-*` is removed. Do not flag retained shadows as inconsistent.
- **`rounded-md` on form triggers is intentional**: Select trigger and similar form elements keep `rounded-md` because it resolves to 0 via the `--radius: 0rem` theme variable. Do not flag retained `rounded-md` on triggers as needing removal.
- **Base UI Checkbox `checked` is `boolean`, not `boolean | 'mixed'`**: Base UI uses a separate `indeterminate` prop for the mixed/indeterminate state. Do not suggest handling `checked="mixed"` — that is a Radix API pattern, not Base UI.
