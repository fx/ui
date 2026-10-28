import { Moon, Sun, SunMoon } from 'lucide-react'
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

function ThemeToggle({ variant = 'ghost', size = 'icon', disabled, ...props }: ThemeToggleProps) {
  const { resolvedTheme, initialized, setTheme } = useTheme()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  return (
    <Button
      {...props}
      data-slot="theme-toggle"
      variant={variant}
      size={size}
      disabled={disabled || !initialized}
      aria-label={initialized ? `Switch to ${next} theme` : 'Loading theme'}
      onClick={() => setTheme(next)}
    >
      {!initialized ? <SunMoon /> : resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

export { ThemeToggle }
export type { ThemeToggleProps }
