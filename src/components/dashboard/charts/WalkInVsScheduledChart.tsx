import { Cell, Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartLegendItem,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--muted)",
  },
  SCHEDULED: {
    label: "Scheduled",
    color: "var(--primary)",
  },
  WALK_IN: {
    label: "Walk-in",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface WalkInVsScheduledChartProps {
  scheduledCount: number;
  walkInCount: number;
}

export function WalkInVsScheduledChart({ scheduledCount, walkInCount }: WalkInVsScheduledChartProps) {
  const total = scheduledCount + walkInCount;
  const data = [
    {
      type: "SCHEDULED",
      count: scheduledCount,
      percentage: total > 0 ? Math.round((scheduledCount / total) * 100) : 0,
    },
    {
      type: "WALK_IN",
      count: walkInCount,
      percentage: total > 0 ? Math.round((walkInCount / total) * 100) : 0,
    },
  ];

  return (
    <Card className="col-span-full lg:col-span-3">
      <CardHeader>
        <CardTitle>Walk-in vs Scheduled</CardTitle>
        <CardDescription>Ratio of booking methods</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">({(item.payload as Record<string, number>).percentage}%)</span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey="type"
                  formatter={(value, item: ChartLegendItem) => (
                    <span className="flex items-baseline gap-1">
                      {value}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {item.payload?.count as number} ({item.payload?.percentage as number}%)
                      </span>
                    </span>
                  )}
                />
              }
              className="-translate-y-2 flex-wrap gap-2 *:basis-[calc(50%-0.5rem)] *:justify-center"
            />
            <Pie data={data} dataKey="count" nameKey="type" innerRadius={60} outerRadius={80} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {total.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartConfig[entry.type as keyof typeof chartConfig].color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
