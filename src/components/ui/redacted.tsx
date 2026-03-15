import { useStreamerMode } from '@/components/streamer-mode-provider'

const STREAMER_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

function getStreamerColor(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0
  }
  return STREAMER_COLORS[Math.abs(hash) % STREAMER_COLORS.length] ?? 'var(--color-chart-1)'
}

interface RedactedProps {
  children: React.ReactNode
  color?: string
  label?: string
  className?: string
}

function Redacted({ children, color, label, className }: RedactedProps) {
  const { enabled } = useStreamerMode()

  if (!enabled) {
    return <>{children}</>
  }

  const bgColor = color ?? (label ? getStreamerColor(label) : 'var(--color-muted)')
  const width = typeof children === 'string' ? `${Math.max(children.length, 3)}ch` : '8ch'

  return (
    <span
      data-slot="redacted"
      className={className}
      style={{
        display: 'inline-block',
        backgroundColor: bgColor,
        minWidth: width,
        height: '1em',
        borderRadius: '2px',
        verticalAlign: 'baseline',
      }}
      aria-hidden="true"
    />
  )
}

export { Redacted, getStreamerColor }
export type { RedactedProps }
