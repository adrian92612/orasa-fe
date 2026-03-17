import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ServiceStatsDTO } from "@/types/analytics";

const chartConfig = {
  count: {
    label: "Appointments",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface PopularServicesChartProps {
  data: ServiceStatsDTO[];
}

export function PopularServicesChart({ data }: PopularServicesChartProps) {
  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader>
        <CardTitle>Popular Services</CardTitle>
        <CardDescription>Most booked services</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="serviceName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" layout="vertical" fill="var(--color-count)" radius={5} maxBarSize={50} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
