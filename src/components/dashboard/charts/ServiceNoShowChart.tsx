import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ServiceNoShowStatsDTO } from "@/types/analytics";

const chartConfig = {
  totalAppointments: {
    label: "Total Appointments",
    color: "var(--chart-1)",
  },
  noShowCount: {
    label: "No-Shows",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface ServiceNoShowChartProps {
  data: ServiceNoShowStatsDTO[];
}

export function ServiceNoShowChart({ data }: ServiceNoShowChartProps) {
  // Sort by no-show rate descending, take top 5
  const chartData = [...data].sort((a, b) => b.noShowRate - a.noShowRate).slice(0, 5);

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader>
        <CardTitle>No-Show Rate by Service</CardTitle>
        <CardDescription>Highest skipped services (No-Shows vs Total)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
              right: 40,
            }}
            barGap={-30}
          >
            <YAxis
              dataKey="serviceName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    if (name === "noShowCount") {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-noShowCount)" />
                          <span className="text-muted-foreground">{chartConfig.noShowCount.label}:</span>
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {value} ({item.payload.noShowRate}%)
                          </span>
                        </div>
                      );
                    }
                    if (name === "totalAppointments") {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-totalAppointments)" />
                          <span className="text-muted-foreground">{chartConfig.totalAppointments.label}:</span>
                          <span className="font-mono font-medium tabular-nums text-foreground">{value}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              }
            />
            <Bar
              dataKey="totalAppointments"
              layout="vertical"
              fill="var(--color-totalAppointments)"
              radius={5}
              barSize={30}
              opacity={1}
            />
            <Bar dataKey="noShowCount" layout="vertical" fill="var(--color-noShowCount)" radius={5} barSize={30} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
