import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme-provider'
import { Button, type ButtonProps } from './button'

type ThemeToggleProps = Omit<
  ButtonProps,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'onClick'
  | 'aria-label'
  | 'asChild'
  | 'render'
  | 'nativeButton'
>

function ThemeToggle({ variant = 'ghost', size = 'icon', ...props }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  return (
    <Button
      {...props}
      data-slot="theme-toggle"
      variant={variant}
      size={size}
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

export { ThemeToggle }
export type { ThemeToggleProps }
