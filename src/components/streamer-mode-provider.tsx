import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface StreamerModeContextValue {
  enabled: boolean
  toggle: () => void
}

const StreamerModeContext = createContext<StreamerModeContextValue | undefined>(undefined)

function StreamerModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const toggle = useCallback(() => setEnabled((v) => !v), [])
  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle])
  return <StreamerModeContext.Provider value={value}>{children}</StreamerModeContext.Provider>
}

function useStreamerMode(): StreamerModeContextValue {
  const context = useContext(StreamerModeContext)
  if (context === undefined) {
    throw new Error('useStreamerMode must be used within a StreamerModeProvider')
  }
  return context
}

export { StreamerModeProvider, useStreamerMode }
export type { StreamerModeContextValue }
