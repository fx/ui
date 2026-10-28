import {
  ChartTooltipContent,
  CollapsibleTrigger,
  MenubarContent,
  Progress,
  SheetContent,
} from '../dist/index.js'

const example = (
  <>
    <ChartTooltipContent
      label={0}
      labelFormatter={(label, payload) => `${label}: ${payload.length}`}
      formatter={(value, name, item, index, payload) =>
        `${value} ${name} ${item.dataKey} ${index} ${payload?.value}`
      }
    />
    <Progress trackClassName="h-1" indicatorClassName="bg-foreground" />
    <SheetContent side="bottom" flush showCloseButton={false} />
    <MenubarContent align="end" alignOffset={1} side="bottom" sideOffset={2} />
    <CollapsibleTrigger asChild nativeButton={false}>
      <div>Open</div>
    </CollapsibleTrigger>
  </>
)
void example
