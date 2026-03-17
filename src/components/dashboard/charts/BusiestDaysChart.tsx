import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { WeekdayStatsDTO } from "@/types/analytics";

const chartConfig = {
  count: {
    label: "Appointments",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type BusiestDaysChartProps = {
  data: WeekdayStatsDTO[];
};

export function BusiestDaysChart({ data }: BusiestDaysChartProps) {
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const existing = data.find((d) => d.dayOfWeek === i);
    return {
      day: DAYS[i],
      count: existing ? existing.count : 0,
    };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Busiest Days</CardTitle>
        <CardDescription>Most active days of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" radius={4} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count === maxCount && maxCount > 0 ? "var(--chart-1)" : "var(--color-count)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
