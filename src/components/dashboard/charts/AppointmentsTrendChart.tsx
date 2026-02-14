import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import type { DailyStatsDTO } from "@/types/analytics";

const chartConfig = {
  totalAppointments: {
    label: "Total Appointments",
    color: "var(--chart-1)",
  },
  completedAppointments: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface AppointmentsTrendChartProps {
  data: DailyStatsDTO[];
}

export function AppointmentsTrendChart({ data }: AppointmentsTrendChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Appointments Trend</CardTitle>
        <CardDescription>
          Daily volume of total vs. completed appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="completedAppointments"
              type="natural"
              fill="var(--color-completedAppointments)"
              fillOpacity={0.4}
              stroke="var(--color-completedAppointments)"
              stackId="a"
            />
            <Area
              dataKey="totalAppointments"
              type="natural"
              fill="var(--color-totalAppointments)"
              fillOpacity={0.4}
              stroke="var(--color-totalAppointments)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
