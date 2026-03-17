import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { HourStatsDTO } from "@/types/analytics";

const chartConfig = {
  count: {
    label: "Appointments",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type PeakHoursChartProps = {
  data: HourStatsDTO[];
};

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  // Pad missing hours with 0
  const fullData = Array.from({ length: 24 }, (_, i) => {
    const existing = data.find((d) => d.hour === i);
    const ampm = i >= 12 ? "PM" : "AM";
    const displayHour = i % 12 === 0 ? 12 : i % 12;
    return {
      hour: i,
      displayHour: `${displayHour}${ampm}`,
      count: existing ? existing.count : 0,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Peak Hours</CardTitle>
        <CardDescription>High traffic times throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={fullData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="displayHour"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={2}
            />
            <YAxis axisLine={false} tickLine={false} hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={4}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
