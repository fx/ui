import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusOverlayVariants = cva('absolute flex items-center justify-center rounded-full p-0.5', {
  variants: {
    position: {
      'bottom-right': '-bottom-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
      'top-right': '-top-1 -right-1',
      'top-left': '-top-1 -left-1',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
})

interface StatusOverlayProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof statusOverlayVariants> {
  /** Whether to show an animated spinning ring around the overlay */
  animated?: boolean
}

function SpinningRing() {
  return (
    <span
      className="absolute inset-[-1px] animate-spin rounded-full"
      style={{
        background:
          'conic-gradient(from 0deg, rgba(255,255,255,0.95) 0deg, rgba(255,255,255,0.7) 90deg, rgba(255,255,255,0.4) 180deg, rgba(255,255,255,0.15) 270deg, transparent 360deg)',
        mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), black calc(100% - 1.5px))',
        WebkitMask:
          'radial-gradient(farthest-side, transparent calc(100% - 1.5px), black calc(100% - 1.5px))',
        animationDuration: '1.2s',
        animationTimingFunction: 'linear',
        animationDirection: 'reverse',
      }}
    />
  )
}

function StatusOverlay({
  className,
  position,
  animated = false,
  children,
  ref,
  ...props
}: StatusOverlayProps) {
  return (
    <span
      ref={ref}
      data-slot="status-overlay"
      className={cn(statusOverlayVariants({ position }), className)}
      {...props}
    >
      {animated && <SpinningRing />}
      {children}
    </span>
  )
}

export { StatusOverlay, statusOverlayVariants }
export type { StatusOverlayProps }
