import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DailyStatsDTO } from "@/types/analytics";

const chartConfig = {
  estimatedRevenue: {
    label: "Est. Revenue",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface RevenueTrendChartProps {
  data: DailyStatsDTO[];
  totalRevenue: number;
}

export function RevenueTrendChart({
  data,
  totalRevenue,
}: RevenueTrendChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Estimated Revenue Trend</CardTitle>
        <CardDescription>Daily estimated revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="estimatedRevenue"
              fill="var(--color-estimatedRevenue)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total estimated revenue:{" "}
          <span className="font-bold">₱{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="leading-none text-muted-foreground">
          Based on service base prices
        </div>
      </CardFooter>
    </Card>
  );
}
