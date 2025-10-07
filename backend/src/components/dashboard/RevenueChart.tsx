"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <BarChart data={[]} accessibilityLayer>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={<ChartTooltipContent />}
              wrapperClassName="!bg-popover !border-border"
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
