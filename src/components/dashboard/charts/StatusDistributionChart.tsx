import { Cell, Label, Pie, PieChart } from "recharts";

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
import type { StatusStatsDTO } from "@/types/analytics";

const chartConfig = {
  count: {
    label: "Count",
  },
  COMPLETED: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "var(--destructive)",
  },
  NO_SHOW: {
    label: "No Show",
    color: "var(--chart-5)",
  },
  PENDING: {
    label: "Pending",
    color: "var(--muted)",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface StatusDistributionChartProps {
  data: StatusStatsDTO[];
  totalAppointments: number;
}

export function StatusDistributionChart({
  data,
  totalAppointments,
}: StatusDistributionChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Appointment Status</CardTitle>
        <CardDescription>Distribution by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAppointments.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              {data.map((entry, index) => {
                const config =
                  chartConfig[entry.status as keyof typeof chartConfig];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      (config && "color" in config
                        ? config.color
                        : undefined) || "var(--muted)"
                    }
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
