import { createContext, useContext, useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function applyThemeClass(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

function resolveTheme(theme: Theme, systemDark: boolean): 'light' | 'dark' {
  if (theme === 'system') return systemDark ? 'dark' : 'light'
  return theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    const raw = localStorage.getItem('theme')
    const stored: Theme = raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system'
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = resolveTheme(stored, systemDark)
    setThemeState(stored)
    setResolvedTheme(resolved)
    applyThemeClass(resolved)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (theme !== 'system') return
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      applyThemeClass(resolved)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  function setTheme(next: Theme) {
    setThemeState(next)
    localStorage.setItem('theme', next)
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = resolveTheme(next, systemDark)
    setResolvedTheme(resolved)
    applyThemeClass(resolved)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
