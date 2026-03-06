import * as React from 'react'
import { Legend, type LegendProps, ResponsiveContainer, Tooltip, type TooltipProps } from 'recharts'
import { cn } from '@/lib/utils'

// Chart config type
export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
}

// Context for chart config (exported for testing)
const ChartContext = React.createContext<ChartConfig | null>(null)

function useChartConfig() {
  const config = React.useContext(ChartContext)
  if (!config) {
    throw new Error('useChartConfig must be used within a ChartContainer')
  }
  return config
}

// ChartContainer
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ComponentProps<typeof ResponsiveContainer>['children']
}

function ChartContainer({ className, children, config, style, ...props }: ChartContainerProps) {
  const id = React.useId()
  const colorVars = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value.color) {
      acc[`--color-${key}`] = value.color
    }
    return acc
  }, {})

  return (
    <ChartContext.Provider value={config}>
      <div
        data-slot="chart"
        data-chart={id}
        className={cn(
          'flex aspect-video justify-center text-xs',
          '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
          '[&_.recharts-cartesian-grid_line[stroke=#ccc]]:stroke-border/50',
          '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border',
          '[&_.recharts-dot[stroke=#fff]]:stroke-transparent',
          '[&_.recharts-layer]:outline-none',
          '[&_.recharts-polar-grid_[stroke=#ccc]]:stroke-border',
          '[&_.recharts-radial-bar-background-sector]:fill-muted',
          '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
          '[&_.recharts-reference-line_[stroke=#ccc]]:stroke-border',
          '[&_.recharts-sector[stroke=#fff]]:stroke-transparent',
          '[&_.recharts-sector]:outline-none',
          '[&_.recharts-surface]:outline-none',
          className,
        )}
        style={{ ...colorVars, ...style }}
        {...props}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// ChartTooltip
interface ChartTooltipProps extends TooltipProps<string | number, string> {}

function ChartTooltip(props: ChartTooltipProps) {
  return <Tooltip cursor={false} content={<ChartTooltipContent />} {...props} />
}

// ChartTooltipContent
interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: string | number
    dataKey?: string | number
    color?: string
    payload?: Record<string, unknown>
    fill?: string
  }>
  label?: string
  labelKey?: string
  nameKey?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: 'line' | 'dot' | 'dashed'
}

function ChartTooltipContent({
  active,
  payload,
  className,
  label,
  labelKey,
  nameKey,
  hideLabel = false,
  hideIndicator = false,
  indicator = 'dot',
}: ChartTooltipContentProps) {
  const config = useChartConfig()

  if (!active || !payload?.length) {
    return null
  }

  const tooltipLabel = labelKey ? config[labelKey]?.label || labelKey : label

  return (
    <div
      data-slot="chart-tooltip-content"
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {!hideLabel && tooltipLabel && <div className="font-medium">{tooltipLabel}</div>}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = String(nameKey ? item.payload?.[nameKey] : item.name || item.dataKey)
          const itemConfig = config[key] || config[String(item.dataKey)]
          const indicatorColor = item.color || item.fill || 'var(--color-foreground)'

          return (
            <div
              key={item.dataKey ?? item.name ?? index}
              className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground"
            >
              {!hideIndicator && (
                <div
                  className={cn('shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]', {
                    'h-2.5 w-2.5': indicator === 'dot',
                    'w-1': indicator === 'line',
                    'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                  })}
                  style={
                    {
                      '--color-bg': indicatorColor,
                      '--color-border': indicatorColor,
                    } as React.CSSProperties
                  }
                />
              )}
              <div className="flex flex-1 justify-between gap-2 leading-none">
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">{itemConfig?.label || key}</span>
                </div>
                {item.value !== undefined && (
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ChartLegend
interface ChartLegendProps extends LegendProps {}

function ChartLegend(props: ChartLegendProps) {
  return <Legend content={<ChartLegendContent />} {...props} />
}

// ChartLegendContent
interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: Array<{
    value?: string
    type?: string
    id?: string
    dataKey?: string | number
    color?: string
  }>
  nameKey?: string
  hideIcon?: boolean
}

function ChartLegendContent({
  className,
  payload,
  nameKey,
  hideIcon = false,
}: ChartLegendContentProps) {
  const config = useChartConfig()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      data-slot="chart-legend-content"
      className={cn('flex flex-wrap items-center justify-center gap-4', className)}
    >
      {payload.map((item, index) => {
        const key = String(nameKey ? item.dataKey : item.value)
        const itemConfig = config[key]

        return (
          <div
            key={item.value ?? index}
            className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              !hideIcon && (
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )
            )}
            <span className="text-muted-foreground">{itemConfig?.label || key}</span>
          </div>
        )
      })}
    </div>
  )
}

export {
  ChartContext,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
export type {
  ChartContainerProps,
  ChartTooltipProps,
  ChartTooltipContentProps,
  ChartLegendProps,
  ChartLegendContentProps,
}
